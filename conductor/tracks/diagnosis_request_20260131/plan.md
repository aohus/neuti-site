# Implementation Plan: 수목진단의뢰 페이지 구현

## Phase 1: Backend API & Database
의뢰 정보를 저장하고 처리할 백엔드 시스템을 구축합니다.

- [ ] **Task: Setup Backend Dependencies**
    - [ ] Add `fastapi-mail` (or similar) and `python-multipart` to backend dependencies.
    - [ ] Configure environment variables for email service (SMTP) and file upload path.
- [ ] **Task: Define Database Model & Schema**
    - [ ] Create SQLAlchemy model `DiagnosisRequest` (name, contact, email, address, symptom, etc.).
    - [ ] Create Pydantic schemas for request validation.
    - [ ] Generate Alembic migration script.
- [ ] **Task: Implement Request Submission API**
    - [ ] Create API endpoint `POST /api/diagnosis` to handle form data and file uploads.
    - [ ] Implement logic to save file to disk/storage and record info in DB.
    - [ ] Implement email notification logic (mock or real SMTP).
    - [ ] Write tests for the API endpoint (success and failure cases).
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Backend API & Database' (Protocol in workflow.md)**

## Phase 2: Frontend UI & Form
사용자가 의뢰를 접수할 수 있는 웹 페이지를 구현합니다.

- [ ] **Task: Implement File Download Section**
    - [ ] Create a UI section for downloading `수목진단의뢰.hwp`.
    - [ ] Move the HWP file to `frontend/public/downloads/` (or serve via API).
- [ ] **Task: Implement Online Diagnosis Form**
    - [ ] Create `DiagnosisForm` component using React Hook Form.
    - [ ] Implement input fields: Name, Contact, Email, Address, Symptom.
    - [ ] Implement file upload input with preview if possible.
    - [ ] Write unit tests for form validation logic.
- [ ] **Task: Connect Form to API**
    - [ ] Implement submission handler to send `FormData` to backend.
    - [ ] Handle loading states and success/error responses.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Frontend UI & Form' (Protocol in workflow.md)**

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
