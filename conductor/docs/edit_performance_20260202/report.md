# Report: 시공사례 글 수정 기능 개발 (2026-02-02)

## Summary
관리자가 시공사례(Performance) 게시글을 웹상에서 직접 수정할 수 있는 기능을 구현했습니다. Tiptap 에디터를 도입하여 직관적인 WYSIWYG 편집 환경을 제공하며, 수정된 내용은 데이터베이스에 저장됩니다. 또한, 마크다운 파일과의 동기화 로직을 개선하여 데이터 유실을 방지했습니다.

## Key Features
1.  **Backend (API)**
    -   `PUT /backend-api/performance/{id}`: 게시글 수정 API 구현.
    -   `POST /backend-api/upload-image`: 에디터 내 이미지 업로드 API 구현.
    -   `sync_md.py` 개선: 마크다운 파일 동기화 시 기존 DB 레코드가 있으면 삭제하지 않고 업데이트(또는 우선순위 조정)하도록 로직 변경.
2.  **Frontend (UI/UX)**
    -   `TiptapEditor` 컴포넌트: 이미지 드래그 앤 드롭, 기본 서식 편집 지원.
    -   시공사례 수정 페이지 (`/performance/[id]/edit`): 기존 데이터 로드, 폼 바인딩, 수정 요청 처리.
    -   JSON/HTML 변환 로직: DB에 저장된 마크다운/JSON 콘텐츠를 에디터 호환 HTML로 변환하여 로드.

## Outcome
관리자는 이제 파일 시스템에 직접 접근하지 않고도 웹 어드민 인터페이스를 통해 시공사례의 오타 수정, 이미지 교체, 메타데이터(연도, 카테고리 등) 변경을 손쉽게 수행할 수 있습니다.
