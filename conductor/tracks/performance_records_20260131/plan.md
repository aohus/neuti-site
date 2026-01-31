# Implementation Plan: 시공 사례(활동 기록) 페이지 고도화

'시공 사례' 페이지에 관리자가 이미지와 글을 등록할 수 있는 기능을 추가하고, 상세 페이지를 블로그 스타일로 구현합니다.

## Phase 1: Database & Backend API Setup [checkpoint: f4dd040]
- [x] Task: Backend - 시공 사례(`Performance`) 테이블 스키마 설계 및 Alembic 마이그레이션
- [x] Task: Backend - 이미지 업로드 API 구현 (멀티파트 파일 업로드 처리)
- [x] Task: Backend - 시공 사례 CRUD API 구현 (FastAPI)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Setup' (Protocol in workflow.md)

## Phase 2: Frontend Data Fetching & State Management
- [x] Task: Frontend - 시공 사례 관련 API 타입 정의 및 Axios 인스턴스 설정
- [x] Task: Frontend - 목록 조회를 위한 React Query(또는 SWR) Hook 구현
- [x] Task: Conductor - User Manual Verification 'Phase 2: Frontend Data' (Protocol in workflow.md)

## Phase 3: Admin Features (Create/Update Post)
- [x] Task: Frontend - 관리자 권한 확인 로직 및 '글쓰기' 버튼 구현
- [x] Task: Frontend - 시공 사례 등록/수정 폼 구현
    - 이미지 업로드 및 미리보기 기능
    - 텍스트 에디터(간이 에디터 또는 블록 방식) 적용
- [x] Task: Conductor - User Manual Verification 'Phase 3: Admin Features' (Protocol in workflow.md)

## Phase 4: UI Refinement & Detail Page
- [x] Task: Frontend - 시공 사례 목록 페이지 UI 업데이트 (기존 레이아웃 유지 및 데이터 연결)
- [x] Task: Frontend - 블로그 스타일의 상세 페이지(`/performance/{id}`) 구현
    - 이미지와 텍스트가 조화로운 레이아웃
- [x] Task: Frontend - 반응형 디자인 및 스타일 다듬기 (Tailwind CSS)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Final UI' (Protocol in workflow.md)