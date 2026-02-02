# Implementation Plan - 시공사례 수정 기능

## Phase 1: 백엔드 정책 변경 및 API 구현 (Backend & Core)
이 단계에서는 데이터 관리 정책을 파일 중심에서 DB 중심으로 변경하고, 수정을 위한 API를 구현합니다.

- [x] Task: `sync_md.py` 동기화 로직 수정 (DB 삭제 방지)
    - [x] `backend/app/sync_md.py`에서 기존 DB 레코드 삭제 로직(delete_query) 제거 또는 조건부 실행으로 변경.
    - [x] DB에 존재하면 건너뛰고, 없으면 추가하는 'Seed' 방식으로 로직 안정화.
- [x] Task: 성능(Performance) 업데이트 API 구현 (TDD)
    - [x] `backend/tests/test_performance.py`에 `update_performance` 관련 실패하는 테스트 케이스 추가 (수정 권한, 데이터 검증).
    - [x] `backend/app/api/api_v1/endpoints/performances.py` (또는 유사 경로)에 PUT 엔드포인트 구현.
    - [x] Pydantic Schema (`PerformanceUpdate`)가 모든 필드(썸네일, 본문 등)를 허용하는지 재확인.
    - [x] 테스트 통과 및 리팩토링.
- [x] Task: 이미지 업로드 API 구현 (Editor Support)
    - [x] 에디터 내 이미지 업로드를 위한 `POST /api/v1/upload/image` 엔드포인트 구현 (또는 기존 업로드 API 활용).
    - [x] 업로드된 이미지가 `uploads/` 디렉토리에 저장되고 접근 가능한 URL을 반환하는지 테스트.
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: 프론트엔드 에디터 도입 및 UI 구현 (Frontend)
이 단계에서는 Tiptap 에디터를 도입하고 수정 페이지 UI를 구축합니다.

- [x] Task: Tiptap 에디터 컴포넌트 개발
    - [x] 필요한 패키지 설치 (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image` 등).
    - [x] `frontend/src/components/Editor/TiptapEditor.tsx` (가칭) 컴포넌트 생성.
    - [x] 드래그 앤 드롭 이미지 기능 활성화 및 이미지 업로드 핸들러(Hook) 연동.
- [x] Task: 시공사례 수정 페이지 구현
    - [x] `frontend/src/app/performance/[id]/edit/page.tsx` 생성.
    - [x] 기존 데이터(초기값)를 불러와 폼(React Hook Form 추천)과 에디터에 바인딩하는 로직 구현.
    - [x] 제목, 카테고리, 날짜 등 메타데이터 입력 UI 구성 (Tailwind CSS 적용).
- [x] Task: 수정 기능 통합 및 테스트
    - [x] '저장' 버튼 클릭 시 백엔드 API로 데이터 전송 (Payload 구성 확인).
    - [x] 성공 시 상세 페이지로 리다이렉트 및 토스트 메시지 출력.
    - [x] Jest를 이용한 에디터 렌더링 및 폼 제출 기본 동작 테스트.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: 최종 점검 및 안정화 (Stabilization)
- [ ] Task: 전체 통합 테스트 (E2E Manual)
    - [ ] 마크다운으로 생성된 글을 웹에서 수정해보고 DB 유지 여부 확인.
    - [ ] 썸네일 변경 및 본문 이미지 순서 변경 동작 확인.
- [ ] Task: 문서화 및 정리
    - [ ] 변경된 API 스펙 및 데이터 관리 정책 문서 업데이트.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
