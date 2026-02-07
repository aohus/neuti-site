# Track Specification: 개발 환경 개선 및 기능 수정 (dev_env_and_fixes)

## 1. Overview
로컬 개발 생산성을 높이기 위해 Docker 환경을 개편하고, 발견된 시공사례 삭제 버그와 프론트엔드 UI/UX 개선 사항을 적용합니다.

## 2. Requirements

### 2.1 개발 환경 (Dev Ops)
- **Docker Compose 분리:**
    - 기존 `docker-compose.yml` -> `docker-compose.prod.yml`로 이름 변경 (기존 prod 파일이 있다면 덮어쓰거나 확인).
    - 새로운 `docker-compose.yml` 작성:
        - 로컬 소스 코드와 컨테이너 내부를 Volume Mount하여 수정 사항 즉시 반영 (Hot Reload).
        - Frontend: Next.js 개발 모드 (`npm run dev`)
        - Backend: FastAPI Reload 모드 (`uvicorn app.main:app --reload --host 0.0.0.0`)

### 2.2 백엔드 (Bug Fix)
- **시공사례 삭제 영속성 보장:**
    - 현재: DB에서만 삭제되고 원본 MD 파일이 남아있어 재빌드/재시작 시 DB가 초기화되면서 다시 로드됨.
    - 수정: 시공사례 삭제 API 호출 시, DB 레코드 삭제와 함께 **`backend/data/performances/` 경로의 해당 MD 파일도 삭제**하는 로직 추가.

### 2.3 프론트엔드 (UI/UX Improvement)
- **메인 페이지:**
    - `StatisticsDashboard`의 스크롤 페이드아웃 타이밍을 조절 (더 적은 스크롤 양에도 빠르게 사라지도록).
- **시공사례 페이지 (`/performance`):**
    - 상단 **검색창(Search Input) 컴포넌트 삭제**.
    - 필터 UI 단순화: **'작업 분류'**와 **'대상지 분류'** 칩(Chip) 또는 버튼만 남기고 나머지는 정리.

## 3. Acceptance Criteria
- 로컬에서 코드 수정 시 도커 재빌드 없이 브라우저에 반영되는가?
- 시공사례를 삭제하고 서버를 재시작해도 해당 글이 다시 나타나지 않는가?
- 메인 통계 데이터가 스크롤 초반에 빠르게 사라지는가?
- 시공사례 페이지에 검색창이 없고 필터가 심플해졌는가?