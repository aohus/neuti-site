# 배포 · 인프라 운영 가이드

## 요약

`main` 브랜치에 push 하면 배포가 끝난다. GitHub Actions가 이미지를 빌드해 홈서버의
프라이빗 레지스트리에 푸시하고, uploads를 동기화한 뒤 compose를 재기동한다.
마이그레이션·시드·시공사례 동기화는 백엔드 컨테이너가 기동할 때 스스로 실행한다.

## 구성

```
GitHub Actions (ubuntu-latest)
  │  Tailscale VPN (100.x.x.x)
  ▼
홈서버
  ├─ Docker Registry (:5000, insecure — Tailscale 내부이므로 HTTP)
  ├─ Traefik (proxy-network, Let's Encrypt)
  └─ ~/workspace/neuti-site/
       ├─ docker-compose.prod.yml   (CI가 scp로 덮어씀)
       ├─ .env                       (서버에만 존재. 저장소에 없음)
       └─ backend/uploads/           (bind mount → /app/uploads)
```

컨테이너: `neuti-backend` (FastAPI, 512M/0.5cpu), `neuti-frontend` (Next.js, 512M/0.5cpu),
`neuti-db` (postgres:15-alpine, 256M/0.25cpu, `postgres_data_prod` 볼륨).

## 개발 환경

```bash
docker compose up -d     # backend:8003, frontend:3003, db:5433
```

- `backend` — 기동 시 `alembic upgrade head` → `seed_technology` → uvicorn `--reload`
- `sync-watcher` — `python app/sync_md.py --watch`. `backend`가 healthy 된 뒤 시작
- `frontend` — `npm run dev`. `backend`가 healthy 된 뒤 시작
- 모든 서비스에 헬스체크가 있어 `docker compose ps`로 상태 확인 가능

## CI/CD 파이프라인 (`.github/workflows/deploy.yml`)

트리거: `push`(main) 또는 `workflow_dispatch`. `concurrency: production`으로 동시 배포 방지.

1. **Tailscale 연결** — OAuth client(`tag:ci`)로 홈서버 사설망 접속
2. **backend / frontend 이미지 빌드·푸시** — `<TS_IP>:5000/neuti-{backend,frontend}:{sha,latest}`,
   GHA 캐시 사용 (`scope=backend` / `scope=frontend`)
3. **compose 파일 scp** — `docker-compose.prod.yml` → `~/workspace/neuti-site`
4. **uploads 동기화** — 아래 "uploads 동기화" 참조
5. **배포** — `.env` 존재 및 필수 변수 검증 → 현재 이미지를 `:previous`로 태깅(롤백용) →
   `pull` → `up -d` → 헬스체크 60초 대기 → 성공 시 `docker image prune -f`

### 필요한 GitHub Secrets

| 이름 | 용도 |
|------|------|
| `HOMESERVER_TS_IP` | Tailscale IP (100.x.x.x) |
| `TS_OAUTH_CLIENT_ID` / `TS_OAUTH_SECRET` | Tailscale OAuth |
| `USERNAME` | 홈서버 SSH 계정 |
| `SSH_PRIVATE_KEY` | 배포용 SSH 개인키 |

### 홈서버 사전 준비

- 레지스트리: `docker run -d -p 5000:5000 --restart always --name registry registry:2`
- `~/workspace/neuti-site/.env` — 아래 변수 필요
- Tailscale ACL에 `tag:ci` 설정
- `proxy-network` (external) 및 Traefik 기동

### `.env` 변수 (홈서버)

```
POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB
POSTGRES_SERVER          # prod compose가 neuti-db 로 덮어씀
SECRET_KEY               # JWT 서명 키
UPLOAD_DIR
ADMIN_USERNAME / ADMIN_PASSWORD
MAIL_USERNAME / MAIL_PASSWORD / MAIL_FROM / MAIL_SERVER / MAIL_PORT
DOMAIN_COM / DOMAIN_NET  # punycode 도메인
```

배포 스크립트는 `POSTGRES_PASSWORD`, `SECRET_KEY`, `ADMIN_PASSWORD` 세 개의 존재를 검증한 뒤
진행한다. 없으면 배포가 중단된다.

## 백엔드 기동 시퀀스 (prod)

`docker-compose.prod.yml`의 `command`가 순서대로 실행한다:

```
alembic upgrade head
  → python -m app.seed_technology
  → sync_all_performances()      # backend/data/performances/*.md → DB
  → uvicorn app.main:app
```

덕분에 **마이그레이션이나 시공사례 md를 배포하려고 서버에 수동 접속할 일이 없다.**

## Traefik 라우팅

도메인: `XN--910B90BW7NHUBU9W9VR.COM` / `.NET` + 각 `www.` 변형 (느티나무병원 punycode).
TLS는 Let's Encrypt(`certresolver=letsencrypt`), 엔트리포인트는 `websecure`.

| 라우터 | 우선순위 | 규칙 |
|--------|---------|------|
| `neuti-backend` | 10 | `PathPrefix(/backend-api)` 또는 `PathPrefix(/uploads)` |
| `neuti-frontend` | 1 | 그 외 전부 |

백엔드 라우터에는 `replacepathregex` 미들웨어가 붙어 `^/backend-api/(.*)` → `/api/v1/$1`로
경로를 바꾼다. 개발 환경에서는 Next.js rewrites가 같은 역할을 한다.

## uploads 동기화 (주의 필요)

`backend/uploads/`는 `.dockerignore`로 이미지에서 제외되고, 운영에서는 호스트 디렉터리를
`/app/uploads`로 bind mount 한다. 따라서 **git에 커밋한 시공사례 이미지는 CI가 rsync 하지
않으면 운영에 영원히 도달하지 않는다** (본문은 뜨는데 이미지만 404 나는 원인).

동기화 단계가 하는 일:

1. **소유권 정규화** — uploads 안에 배포 유저가 아닌(root 소유) 파일이 섞이면 rsync가
   `mkstemp: Permission denied (13)` → exit 23으로 죽는다. busybox 컨테이너로
   `chown -R` 해서 배포 유저 소유로 되돌린 뒤 진행한다.
2. **rsync `-az`** — `backend/uploads/` → 홈서버. **`--delete`는 절대 붙이지 말 것.**
   같은 디렉터리에 관리자 UI로 업로드된 `uuid.jpg`가 있고, 그건 git에 없으므로 지워진다.
3. **stale 디렉터리 정리** — rsync 뒤에 `uploads/` 바로 아래 **디렉터리**만 비교해
   저장소에 없는 것을 제거한다. 관리자 업로드분은 최상위 *파일*이라 걸리지 않는다.
   양쪽 정렬은 `LC_ALL=C`로 고정한다 — 러너와 홈서버 로케일이 다르면 한글 정렬 순서가
   어긋나 멀쩡한 폴더를 지울 수 있다.

## 롤백

배포 직전 현재 이미지를 `:previous`로 태깅해 둔다.

```bash
cd ~/workspace/neuti-site
docker tag localhost:5000/neuti-backend:previous  localhost:5000/neuti-backend:latest
docker tag localhost:5000/neuti-frontend:previous localhost:5000/neuti-frontend:latest
docker compose -f docker-compose.prod.yml up -d
```

DB 마이그레이션은 자동 롤백되지 않는다. 스키마 변경을 되돌려야 하면
`alembic downgrade -1`을 별도로 실행할 것.

## Docker 설정 이력 (2026-02)

빌드/보안/안정성 최적화로 적용된 항목:

| 항목 | 변경 |
|------|------|
| Frontend 빌드 컨텍스트 | ~715MB → ~154MB (`frontend/.dockerignore` 신규) |
| Backend 빌드 컨텍스트 | ~265MB → ~5MB (`uploads/` 등 제외) |
| Backend Dockerfile COPY | `COPY . .` → `alembic.ini`/`alembic`/`app`/`data` 선택 COPY |
| apt 캐시 | `rm -rf /var/lib/apt/lists/*`로 레이어 정리 (~100MB) |
| SQL 로깅 | `echo=True` 고정 → `echo=settings.SQL_ECHO` (기본 False) |
| CORS | 하드코딩 `["*"]` → `settings.CORS_ORIGINS` (기본값은 여전히 `["*"]`) |
| 헬스체크 | prod frontend(wget), dev backend(urllib) 추가 |
| 의존성 | dev의 `depends_on`을 `service_healthy` 조건으로 강화 |
| next.config.ts | 하드코딩 backendUrl → `process.env.BACKEND_INTERNAL_URL` |
| Traefik 도메인 | punycode 하드코딩 → `${DOMAIN_COM}` / `${DOMAIN_NET}` |

> **현재 상태 주의**: 당시 계획에는 백엔드를 non-root(`appuser`)로 돌리는 항목이 있었지만,
> 현재 `backend/Dockerfile`에는 `USER` 지시자가 없어 **백엔드 컨테이너는 root로 실행된다.**
> `deploy.yml`의 uploads 소유권 정규화가 이 전제에 의존한다(소유권을 배포 유저로 바꿔도
> 앱의 업로드 쓰기가 깨지지 않는 이유). non-root로 바꾸려면 uploads 소유권 처리도 함께
> 손봐야 한다.

## 미완 항목

- **견적 요청 이메일 알림** — `backend/app/utils/email.py`의 `send_estimate_notification()`은
  구현돼 있으나 `endpoints/estimate_request.py`에서 주석 처리 상태다.
  네이버 메일 SMTP(POP3/SMTP 사용 허용) 설정 후 주석을 해제하면 동작한다.
  참고로 `config.py`의 `MAIL_SERVER` 기본값은 `smtp.gmail.com`이므로 네이버를 쓰려면
  `.env`에서 덮어써야 한다.
