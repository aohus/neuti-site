# Docker Build & Deploy 최적화 리포트

## 1. 분석 요약

소규모 회사 홈페이지(Next.js + FastAPI + PostgreSQL) Docker 설정에 대해 보안, 빌드 성능, 안정성, 런타임 설정을 분석하고 최적화를 수행했습니다.

## 2. 변경 사항

### P0: 보안/버그 수정

| 항목 | Before | After |
|------|--------|-------|
| Backend 실행 유저 | `root` | `appuser` (non-root) |
| Dockerfile COPY | `COPY . .` (전체 복사) | `alembic.ini`, `alembic/`, `app/` 선택적 COPY |
| apt 캐시 | 레이어에 잔류 (~100MB) | `rm -rf /var/lib/apt/lists/*` 정리 |
| pg_isready (prod) | 플래그 없음 (기본 유저 사용) | `-U postgres -d app` 명시 |

### P1: 빌드 성능 개선

| 항목 | Before | After | 절감 |
|------|--------|-------|------|
| Frontend 빌드 컨텍스트 | ~715MB (`node_modules` 포함) | ~154MB | ~78% |
| Backend 빌드 컨텍스트 | ~265MB (`uploads/` 포함) | ~5MB | ~98% |
| SQL echo 로깅 | `echo=True` (항상) | `echo=settings.SQL_ECHO` (기본 False) | 로그 볼륨 대폭 감소 |
| CORS 설정 | 하드코딩 `["*"]` | `settings.CORS_ORIGINS` (환경변수 설정 가능) | — |

### P2: 운영 안정성

| 항목 | Before | After |
|------|--------|-------|
| Frontend 헬스체크 (prod) | 없음 | `wget --spider http://localhost:3000/` |
| Backend 헬스체크 (dev) | 없음 | `urllib.request.urlopen('http://localhost:8000/health')` |
| sync-watcher 의존성 (dev) | `db: service_healthy` | `backend: service_healthy` |
| frontend 의존성 (dev) | `depends_on: - backend` (시작만 대기) | `backend: service_healthy` (헬스체크 통과 후 시작) |

### P3: 베스트 프랙티스

| 항목 | Before | After |
|------|--------|-------|
| `next.config.ts` backendUrl | 하드코딩 `'http://backend:8000'` | `process.env.BACKEND_INTERNAL_URL \|\| 'http://backend:8000'` |
| CORS origins | `["*"]` 하드코딩 | `settings.CORS_ORIGINS` (환경변수 오버라이드 가능) |
| Traefik 도메인 (prod) | Punycode 하드코딩 | `${DOMAIN_COM}`, `${DOMAIN_NET}` 환경변수 |

## 3. 수정 파일 목록

| # | 파일 | 변경 유형 |
|---|------|-----------|
| 1 | `backend/Dockerfile` | 수정 |
| 2 | `docker-compose.prod.yml` | 수정 |
| 3 | `docker-compose.yml` | 수정 |
| 4 | `frontend/.dockerignore` | 신규 |
| 5 | `backend/.dockerignore` | 수정 |
| 6 | `backend/app/core/config.py` | 수정 |
| 7 | `backend/app/db/session.py` | 수정 |
| 8 | `frontend/next.config.ts` | 수정 |
| 9 | `backend/app/main.py` | 수정 |
| 10 | `.env.prod` | 수정 |

## 4. 검증 방법

```bash
# 1. Dev 빌드 확인
docker compose build

# 2. Dev 서비스 실행 + 헬스체크 확인
docker compose up -d
docker compose ps  # 모든 서비스 healthy 확인

# 3. Prod 빌드 확인
docker compose -f docker-compose.prod.yml build

# 4. Backend non-root 확인
docker exec <backend-container> whoami  # → appuser

# 5. SQL echo 비활성화 확인
# backend 로그에 SQL 쿼리 미출력 확인

# 6. 이미지 크기 비교
docker images | grep neuti
```
