# Implementation Plan: 수목진단의뢰 페이지 구현

## Phase 1: Backend API & Database [checkpoint: b105f09]
의뢰 정보를 저장하고 처리할 백엔드 시스템을 구축합니다.

- [x] **Task: Setup Backend Dependencies**
    - [x] Add `fastapi-mail` (or similar) and `python-multipart` to backend dependencies.
    - [x] Configure environment variables for email service (SMTP) and file upload path.
- [x] **Task: Define Database Model & Schema**
    - [x] Create SQLAlchemy model `DiagnosisRequest` (name, contact, email, address, symptom, etc.).
    - [x] Create Pydantic schemas for request validation.
    - [x] Generate Alembic migration script.
- [x] **Task: Implement Request Submission API**
    - [x] Create API endpoint `POST /api/diagnosis` to handle form data and file uploads.
    - [x] Implement logic to save file to disk/storage and record info in DB.
    - [x] Implement email notification logic (mock or real SMTP).
    - [x] Write tests for the API endpoint (success and failure cases).
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Backend API & Database' (Protocol in workflow.md)**

## Phase 2: Frontend UI & Form
사용자가 의뢰를 접수할 수 있는 웹 페이지를 구현합니다.

- [x] **Task: Implement File Download Section**
    - [x] Create a UI section for downloading `수목진단의뢰.hwp`.
    - [x] Move the HWP file to `frontend/public/downloads/` (or serve via API).
- [x] **Task: Implement Online Diagnosis Form**
    - [x] Create `DiagnosisForm` component using React Hook Form.
    - [x] Implement input fields: Name, Contact, Email, Address, Symptom.
    - [x] Implement file upload input with preview if possible.
    - [x] Write unit tests for form validation logic.
- [x] **Task: Connect Form to API**
    - [x] Implement submission handler to send `FormData` to backend.
    - [x] Handle loading states and success/error responses.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Frontend UI & Form' (Protocol in workflow.md)**

## Phase 3: Integration & Finalization
전체 기능을 통합하고 사용자 경험을 다듬습니다.

- [ ] **Task: UI Polish & Responsive Design**
    - [ ] Style the form according to the Green/Brown theme.
    - [ ] Ensure the layout is responsive on mobile devices.
    - [ ] Add success confirmation message/modal after submission.
- [ ] **Task: Documentation & Cleanup**
    - [ ] Generate Implementation Report.
    - [ ] Ensure temporary files are cleaned up.
- [ ] **Task: Final Checkpoint and Track Finalization**
