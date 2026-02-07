# Implementation Plan - Backend Refactoring

## Phase 1: Foundation (Repositories) [checkpoint: layered_arch]
- [x] Task: Create Base Repository. [layered_arch]
    - [x] Sub-task: Implement `app/repositories/base.py` with generic CRUD operations (CRUDBase pattern).
- [x] Task: Implement Domain Repositories. [layered_arch]
    - [x] Sub-task: Create `app/repositories/performance_repo.py`.
    - [x] Sub-task: Create `app/repositories/notice_repo.py` (and others if any).
- [x] Task: Conductor - User Manual Verification 'Foundation (Repositories)' (Protocol in workflow.md) [layered_arch]

## Phase 2: Business Logic (Services) [checkpoint: layered_arch]
- [x] Task: Create Performance Service. [layered_arch]
    - [x] Sub-task: Move logic from `endpoints/performance.py` to `app/services/performance_service.py`.
    - [x] Sub-task: Handle stats calculation, file upload/delete logic within the service.
- [x] Task: Create Notice Service. [layered_arch]
    - [x] Sub-task: Move logic from `endpoints/notice.py` to `app/services/notice_service.py`.
- [x] Task: Conductor - User Manual Verification 'Business Logic (Services)' (Protocol in workflow.md) [layered_arch]

## Phase 3: API Layer Refactoring [checkpoint: layered_arch]
- [x] Task: Refactor API Endpoints. [layered_arch]
    - [x] Sub-task: Update `endpoints/performance.py` to inject and use `PerformanceService`.
    - [x] Sub-task: Update `endpoints/notice.py` to inject and use `NoticeService`.
    - [x] Sub-task: Ensure no direct DB calls remain in endpoints.
- [x] Task: Conductor - User Manual Verification 'API Layer Refactoring' (Protocol in workflow.md) [layered_arch]

## Phase 4: Sync Watcher & Testing [checkpoint: layered_arch]
- [x] Task: Refactor Sync Watcher. [layered_arch]
    - [x] Sub-task: Update `app/sync_md.py` to use `PerformanceService` or `PerformanceRepository` instead of direct DB calls.
- [x] Task: Comprehensive Testing. [layered_arch]
    - [x] Sub-task: Run full test suite (`pytest`).
    - [x] Sub-task: Verify manual flows (upload, delete, list) via Swagger UI.
- [x] Task: Conductor - User Manual Verification 'Sync Watcher & Testing' (Protocol in workflow.md) [layered_arch]