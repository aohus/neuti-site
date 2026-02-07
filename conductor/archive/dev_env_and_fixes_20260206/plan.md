# Implementation Plan - Dev Env & Fixes

## Phase 1: Docker Environment Setup [checkpoint: e1d13d3]
- [x] Task: Rename existing `docker-compose.yml` to `docker-compose.prod.yml` (handle existing prod file if any). [e1d13d3]
- [x] Task: Create new `docker-compose.yml` for local development. [e1d13d3]
    - [x] Sub-task: Configure Volume Mounts for Frontend (`./frontend:/app`) and Backend (`./backend:/app`).
    - [x] Sub-task: Set command to run in dev mode (Next.js `dev`, FastAPI `reload`).
    - [x] Sub-task: Ensure shared volumes (e.g., uploads) remain consistent.
- [x] Task: Conductor - User Manual Verification 'Docker Environment Setup' (Protocol in workflow.md) [e1d13d3]

## Phase 2: Backend Bug Fix (Performance Deletion) [checkpoint: e1d13d3]
- [x] Task: Locate Performance Deletion Logic in Backend. [e1d13d3]
- [x] Task: Implement File Deletion Logic. [e1d13d3]
    - [x] Sub-task: In the delete endpoint, identify the corresponding MD file path based on the performance ID or attributes.
    - [x] Sub-task: Use `os.remove` or `pathlib` to delete the file from `backend/data/performances/`.
- [x] Task: Test Deletion Persistence. [e1d13d3]
    - [x] Sub-task: Delete a performance via API -> Restart Server -> Verify it's gone.
- [x] Task: Conductor - User Manual Verification 'Backend Bug Fix' (Protocol in workflow.md) [e1d13d3]

## Phase 3: Frontend UI Improvements [checkpoint: e1d13d3]
- [x] Task: Update `StatisticsDashboard` Scroll Animation. [e1d13d3]
    - [x] Sub-task: Adjust `useTransform` range to make it fade out faster (e.g., `[0, 100]` instead of `[0, 300]`).
- [x] Task: Simplify Performance Page. [e1d13d3]
    - [x] Sub-task: Remove Search Input component from `frontend/src/app/performance/page.tsx` (or where it resides).
    - [x] Sub-task: Refactor Filter UI to show only 'Category' and 'Location' options cleanly.
- [x] Task: Conductor - User Manual Verification 'Frontend UI Improvements' (Protocol in workflow.md) [e1d13d3]

## Phase 4: Bug Fixes & Tuning [checkpoint: ba529aa]
- [x] Task: Fix API Connection & Database Issues. [ba529aa]
    - [x] Sub-task: Update `docker-compose.yml` to include `alembic upgrade head` and healthchecks.
    - [x] Sub-task: Map frontend to port `3001` to match user environment.
- [x] Task: Refine Statistics Animation. [ba529aa]
    - [x] Sub-task: Adjust `useTransform` range in `StatisticsDashboard.tsx` to peak later and stay longer.
- [x] Task: Conductor - User Manual Verification 'Bug Fixes & Tuning' (Protocol in workflow.md) [ba529aa]