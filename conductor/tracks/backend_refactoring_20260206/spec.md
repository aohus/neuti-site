# Track Specification: 백엔드 아키텍처 리팩토링 (backend_refactoring)

## 1. Overview
현재 혼재된 백엔드 로직을 **Layered Architecture (API - Service - Repository)** 패턴으로 재구성하여 유지보수성, 테스트 용이성, 코드 가독성을 극대화합니다. 기존 기능은 100% 동일하게 동작해야 하며, 어떠한 버그도 허용하지 않습니다.

## 2. Structural Requirements

### 2.1 Layer Separation
- **API Layer (`app/api`):** 요청/응답 처리, 데이터 검증(Pydantic), 의존성 주입 담당. 비즈니스 로직을 포함하지 않음.
- **Service Layer (`app/services`):** 비즈니스 로직, 트랜잭션 관리, 도메인 규칙 처리 담당. Repository를 호출함.
- **Repository Layer (`app/repositories`):** DB 접근, CRUD 작업 담당. SQL/ORM 로직을 캡슐화함.

### 2.2 Directory Structure Reform
```
backend/app/
├── api/
│   └── api_v1/
│       └── endpoints/  # 라우터 정의
├── core/               # 설정, 보안, 예외 처리
├── db/                 # DB 세션, Base 모델
├── models/             # SQLAlchemy 모델
├── schemas/            # Pydantic 스키마
├── repositories/       # [New] DB 접근 계층
├── services/           # [New] 비즈니스 로직 계층
└── utils/              # 공통 유틸리티
```

## 3. Functional Requirements (No Change)
- 모든 기존 API 엔드포인트는 리팩토링 후에도 **동일한 URL, 동일한 파라미터, 동일한 응답**을 유지해야 합니다.
- **특히 주의할 점:**
    - `sync_watcher`의 마크다운 동기화 로직도 Service/Repository 패턴을 따르도록 수정.
    - 파일 업로드 및 삭제 로직(MD 파일 연동)이 Service 계층에서 안전하게 처리되어야 함.

## 4. Acceptance Criteria
- `pytest` 실행 시 모든 기존 테스트가 **통과(PASS)**해야 한다.
- `app/api/api_v1/endpoints/*.py` 파일 내에 직접적인 DB 호출(`await db.execute(...)`) 코드가 없어야 한다.
- 순환 참조(Circular Import) 오류가 발생하지 않아야 한다.
