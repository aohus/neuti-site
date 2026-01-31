# Implementation Plan: 게시판 시스템 (공지사항 및 시공/견적문의) 구현

## Phase 1: Backend - Authentication & Models
게시판 데이터 구조와 관리자 인증 시스템을 구축합니다.

- [x] **Task: Setup Authentication System**
    - [x] Add `python-jose` and `passlib` for JWT and hashing.
    - [x] Create `Admin` user configuration (via env vars).
    - [x] Implement `POST /api/auth/login` endpoint returning access token.
    - [x] Write tests for login success/failure.
- [x] **Task: Define Database Models**
    - [x] Create `Notice` model (title, content, created_at, views).
    - [x] Create `Inquiry` model (title, content, author, password_hash, created_at, is_secret).
    - [x] Create `Answer` model (linked to Inquiry, content, created_at).
    - [x] Generate Alembic migrations.
- [x] **Task: Implement Board APIs**
    - [x] Create CRUD endpoints for `Notice` (protected by admin dependency).
    - [x] Create CRUD endpoints for `Inquiry` (create public, read/update/delete protected by password or admin).
    - [x] Create endpoint for `Answer` (admin only).
    - [x] Write tests for API permissions and logic.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Backend - Authentication & Models' (Protocol in workflow.md)**

## Phase 2: Frontend - Components & Pages
게시판 UI와 인증 관련 프론트엔드 기능을 구현합니다.

- [ ] **Task: Implement Auth Context & Login Page**
    - [ ] Create `AuthProvider` to manage JWT token and admin state.
    - [ ] Create `/login` page with ID/PW form.
    - [ ] Handle login API call and redirect.
- [ ] **Task: Implement Common Board Components**
    - [ ] Create `BoardTable` component (headers, data rows).
    - [ ] Create `Pagination` and `SearchBar` components.
    - [ ] Write unit tests for table rendering.
- [ ] **Task: Implement Notice & QnA Pages**
    - [ ] Create `/notice` list and detail pages.
    - [ ] Create `/qna` list and detail pages.
    - [ ] Implement write/edit forms for both.
    - [ ] Implement password prompt modal for secret QnA posts.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Frontend - Components & Pages' (Protocol in workflow.md)**

## Phase 3: Integration & Finalization
기능을 통합하고 사용자 경험을 최적화합니다.

- [ ] **Task: Integrate API & Permissions**
    - [ ] Connect frontend components to backend APIs.
    - [ ] Conditionally render 'Write/Edit/Delete' buttons based on admin status.
    - [ ] Implement logic for QnA password verification flow.
- [ ] **Task: UI Polish & Cleanup**
    - [ ] Apply Tailwind styling to match the site theme.
    - [ ] Check mobile responsiveness for tables.
    - [ ] Generate Implementation Report.
- [ ] **Task: Final Checkpoint and Track Finalization**
