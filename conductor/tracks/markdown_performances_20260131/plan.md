# Implementation Plan: 마크다운 기반 시공 사례 및 고도화 검색 시스템

마크다운 파일을 통한 게시글 등록 기능을 구현하고, 상세한 메타데이터 필터링 시스템을 구축합니다.

## Phase 1: Database & Metadata Expansion [checkpoint: 74be88f]
- [x] Task: Backend - `Performance` 모델 필드 확장 및 Alembic 마이그레이션
- [x] Task: Backend - Pydantic 스키마 업데이트 및 기존 CRUD 로직 대응
- [x] Task: Conductor - User Manual Verification 'Phase 1: DB Expansion' (Protocol in workflow.md)

## Phase 2: Markdown Parser & File Sync Engine [checkpoint: 88508]
- [x] Task: Backend - YAML Frontmatter 파서 구현 (Python `python-frontmatter` 등 활용)
- [x] Task: Backend - 마크다운 본문을 기존 블록 구조(`ContentBlock[]`)로 변환하는 변환기 구현
- [x] Task: Backend - 로컬 파일 동기화 스크립트(`sync_md.py`) 구현
- [x] Task: Conductor - User Manual Verification 'Phase 2: Parser & Sync Engine' (Protocol in workflow.md)

## Phase 3: Admin UI & Search Logic [checkpoint: 88508]
- [x] Task: Backend - 다중 필터링을 지원하는 목록 조회 API 고도화
- [x] Task: Frontend - 관리자 페이지에 마크다운 파일 업로드 기능 추가
- [x] Task: Frontend - 시공 사례 목록 페이지에 상세 필터(연도, 분야, 대상지 등) 추가
- [x] Task: Conductor - User Manual Verification 'Phase 3: Admin & Search UI' (Protocol in workflow.md)

## Phase 4: Rendering & UI Refinement
- [x] Task: Frontend - 상세 페이지 렌더링 로직 최종 점검 (기존 UI와 100% 일치 보장)
- [x] Task: Frontend - 필터링 및 검색 기능 사용자 경험(UX) 최적화
- [x] Task: Conductor - User Manual Verification 'Phase 4: Rendering & Refinement' (Protocol in workflow.md)

## Phase 5: Data Migration (Additional)
- [x] Task: Assets - `공사실적.md` 데이터를 마크다운 파일로 일괄 변환 및 DB 동기화