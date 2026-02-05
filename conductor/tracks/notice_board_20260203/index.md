# Track: 공지사항 게시판 구현 (2026-02-03)

## Objective
공지사항 게시판을 구현하여 관리자가 중요 소식을 전달하고 일반 사용자가 이를 열람할 수 있도록 합니다.

## Context
- **Product Definition**: [Product Definition](../product.md) (Section 6.5)
- **Permissions**:
    - 관리자: 작성(Create), 수정(Update), 삭제(Delete)
    - 일반 사용자: 목록 조회(List), 상세 조회(Read)
- **Features**: 페이징, 키워드 검색, 조회수 증가.

## Plan

### Phase 1: Backend Implementation
- [ ] **Model & Schema**:
    - `Notice` 모델 확인 및 보완 (제목, 본문, 작성자, 조회수, 작성일 등).
    - Pydantic Schema (`NoticeCreate`, `NoticeUpdate`, `NoticeResponse`) 정의.
- [ ] **API Endpoints (`/api/v1/notices`)**:
    - `GET /`: 목록 조회 (페이징, 검색).
    - `GET /{id}`: 상세 조회 (조회수 증가 로직 포함).
    - `POST /`: 작성 (관리자 권한).
    - `PUT /{id}`: 수정 (관리자 권한).
    - `DELETE /{id}`: 삭제 (관리자 권한).
- [ ] **Tests**:
    - `backend/tests/test_notice.py` 작성 및 통과.

### Phase 2: Frontend Implementation
- [ ] **Components**:
    - `NoticeList`: 목록 테이블/리스트 UI.
    - `NoticeDetail`: 상세 내용 뷰.
    - `NoticeForm`: 작성/수정 폼 (기존 Tiptap 에디터 재사용 가능).
- [ ] **Pages**:
    - `/notice`: 목록 페이지.
    - `/notice/[id]`: 상세 페이지.
    - `/notice/new`: 작성 페이지 (관리자 전용).
    - `/notice/[id]/edit`: 수정 페이지 (관리자 전용).
- [ ] **Integration**:
    - API 연동 및 에러 처리.

### Phase 3: Verification
- [ ] **Manual Testing**:
    - 관리자 로그인 후 작성/수정/삭제 테스트.
    - 비로그인 상태에서 조회 테스트.
    - 검색 및 페이징 동작 확인.

## Status
- [ ] Phase 1: Backend Implementation
- [ ] Phase 2: Frontend Implementation
- [ ] Phase 3: Verification
