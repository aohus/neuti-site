# 개발 이력

2026-01 ~ 2026-02 사이 진행한 작업 트랙 요약. 상세 계획·리포트는 폐기된 `.conductor/`에
있었으며, 여기에는 "무엇을 왜 했는지"만 남긴다. 실제 구현은 코드와 git 로그가 정본이다.

## 트랙 목록

| 시기 | 트랙 | 내용 |
|------|------|------|
| 2026-01-31 | MVP Core | FastAPI + Next.js + PostgreSQL 기본 골격 |
| 2026-01-31 | 메인 페이지 구현 | 히어로·기술력·실적 등 홈 구성 |
| 2026-01-31 | 회사소개 페이지 고도화 | CEO 인터뷰·브로슈어 기반 콘텐츠 |
| 2026-01-31 | 주요사업 페이지 고도화 | 나무병원/조경식재 섹션, 카테고리별 시공사례 연동 |
| 2026-01-31 | 주요실적 페이지 | 시공사례 목록·상세 |
| 2026-01-31 | 시공사례 갤러리 | 갤러리형 포트폴리오 |
| 2026-01-31 | 게시판 시스템 | 공지사항 / 문의 CRUD |
| 2026-01-31 | 수목진단 의뢰 | `/request` 폼 + `DiagnosisRequest` |
| 2026-01-31 | 마크다운 기반 시공사례 | `data/performances/*.md` → DB 동기화, 검색·필터 |
| 2026-02-01 | UI/UX 통일감 및 전문성 제고 | 디자인 일관성 정리 |
| 2026-02-01 | 마크다운 렌더링 고도화 | `app/utils/markdown.py` 파서, image_row(before/after) |
| 2026-02-02 | 시공사례 수정 기능 | 관리자 수정 페이지, 사진 삽입/삭제 |
| 2026-02-03 | Sync Watcher | md 파일 변경 감시 후 자동 동기화 (`sync_md.py --watch`) |
| 2026-02-05 | 홈서버 배포 | Tailscale + 프라이빗 레지스트리 + Traefik 기반 CI/CD |
| 2026-02-05 | 메인 페이지 개선 | 히어로/기술력 영역 개편, before/after 노출, 통계·최근사례 정리 |
| 2026-02-06 | 홈 콘텐츠 업데이트 | 히어로·기술력 섹션 문구/데이터 |
| 2026-02-06 | 백엔드 아키텍처 리팩토링 | model / schema / repository / service / endpoint 5계층 정착 |
| 2026-02-06 | 개발 환경 정비 | 헬스체크, depends_on 조건, 빌드 컨텍스트 최적화 |
| 2026-02-13 | 견적 요청 관리 시스템 | `EstimateRequest` + 관리자 페이지 (아래 상세) |

미완으로 남은 트랙: **공지사항 게시판 고도화**(`notice_board_20260203`).
기본 CRUD는 동작하나 트랙 자체는 완료 처리되지 않았다.

## 2026-02-13 작업 상세

이후 작업의 기반이 되므로 남긴다.

### 견적 요청 관리 (Full-Stack)

- `EstimateRequest` 모델에 `status` 컬럼 (`new` / `in_progress` / `completed`, 기본 `new`)
- `EstimateRequestStatusUpdate` 스키마, `EstimateRequestResponse`에 `status` 추가
- 서비스: `update_status()`, `delete_request()`, `get_requests()` (status 필터, `created_at` 역순)
- API: `PATCH /estimate/{id}/status`, `DELETE /estimate/{id}`, `GET /estimate/?status=new`
  (모두 관리자 전용)
- 이메일 알림 `send_estimate_notification()` 추가 — **SMTP 미설정으로 현재 주석 처리**
- 마이그레이션 `d4e5f6g7h8i9` — `estimaterequest.status` 컬럼
- 관리자 페이지 `/admin/estimates` — 상태별 필터 탭(건수 표시), 상태 배지·카드 테두리 색 구분,
  상태 변경/삭제 액션

### 관리자 접근 동선

- `Layout.tsx` — copyright 옆 "관리자" 링크 → `/login`
- `Navbar.tsx` — `isAdmin`일 때 "문의 관리" 버튼 노출 → `/admin/estimates`

### 주요사업 페이지 이미지·디자인

- `assets/img/주요사업/` → `frontend/public/images/business/`
  (`나무1~3.jpg` → `tree-hospital-1~3.jpg`, `조경1~3.jpg` → `landscaping-1~3.jpg`)
- `TreeHospitalSection` / `LandscapingSection` — placeholder를 실사진으로 교체,
  12컬럼 비대칭 그리드, 피처 카드를 둥근 박스에서 미니멀 리스트(divide-y)로 변경
