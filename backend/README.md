# Neuti Backend API

느티나무병원 협동조합 홈페이지 백엔드. FastAPI(async) + SQLAlchemy 2.0(asyncpg) + PostgreSQL 15.

## 실행

저장소 루트에서 Docker로 띄우는 것이 기본이다.

```bash
docker compose up -d              # backend:8003, frontend:3003, db:5433
docker compose logs -f backend
docker compose exec backend bash
```

기동 시 `alembic upgrade head` → `python -m app.seed_technology` → uvicorn `--reload` 순으로 실행된다.

- OpenAPI 문서: http://localhost:8003/docs
- 헬스체크: http://localhost:8003/health

## 명령어 (컨테이너 내부)

```bash
alembic upgrade head                            # 마이그레이션 적용
alembic revision --autogenerate -m "msg"        # 마이그레이션 생성
python -m app.seed_technology                   # 기술력 항목 시드
python app/sync_md.py --watch                   # 시공사례 md 변경 감시 (sync-watcher 서비스)
pytest                                          # 테스트
```

## 레이어 구조

```
app/
├── api/api_v1/
│   ├── api.py            라우터 등록
│   ├── deps.py           get_db, get_current_admin(_optional)
│   └── endpoints/        notice, inquiry, diagnosis, estimate_request,
│                         performance, technology_item, login
├── core/config.py        Settings (pydantic-settings)
├── db/
│   ├── base.py           모델 import 집합 — Alembic 자동감지에 필수
│   └── session.py        async engine / sessionmaker
├── models/               SQLAlchemy 모델
├── schemas/              Pydantic v2 스키마
├── repositories/         CRUDBase[Model, Create, Update]
├── services/             비즈니스 로직
├── utils/
│   ├── markdown.py       시공사례 md 파서 (image_row 등)
│   └── email.py          메일 발송
├── sync_md.py            data/performances/*.md → DB 동기화
└── seed_technology.py
```

새 엔티티를 추가할 때의 5파일 + 2등록 절차는 저장소 루트 `CLAUDE.md`를 참조.

## 시공사례 마크다운 동기화

`data/performances/*.md`가 정본이고, `sync_md.py`가 DB에 반영한다.

- 매칭 키는 `performance.source_file` (md 파일명, NFC 정규화). `title`을 바꿔도 같은 행이 갱신된다
- md를 지우면 `sync_all_performances()`가 해당 행을 삭제한다
- `source_file`이 NULL인 행(관리자 UI 등록분)은 동기화가 건드리지 않는다
- 프론트매터에 `title`(주제목)과 `subtitle`(부제목)을 함께 쓴다
- `![]()` 라인이 연속 2개면 파서가 `image_row`로 묶고 프론트가 Before/After 뱃지를 붙인다
- 캡션은 `alt` 텍스트로 쓴다 (별도 이탤릭 캡션 줄을 두면 두 번 렌더링된다)

운영에서는 백엔드 컨테이너가 기동할 때 자동으로 동기화한다.

## 설정

`backend/.env`(개발) / 홈서버 `.env`(운영)에서 읽는다. 주요 항목:

| 변수 | 기본값 | 비고 |
|------|--------|------|
| `POSTGRES_SERVER/PORT/USER/PASSWORD/DB` | localhost:5432/postgres/postgres/app | |
| `SECRET_KEY` | 개발용 더미 | 운영에서 반드시 교체 |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | admin / admin1234 | 운영에서 반드시 교체 |
| `SQL_ECHO` | `False` | SQL 로깅 |
| `CORS_ORIGINS` | `["*"]` | |
| `UPLOAD_DIR` | `uploads` | 운영에서는 호스트 bind mount |
| `PERFORMANCE_DATA_DIR` | `data/performances` | |
| `MAIL_*` | `MAIL_SERVER`는 gmail 기본값 | 네이버 SMTP 쓰려면 덮어쓸 것 |

JWT는 HS256, 만료 8일.

## 테스트

```bash
pytest                    # tests/ — health, login, board, diagnosis, performance, markdown parser
```
