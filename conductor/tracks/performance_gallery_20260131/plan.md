# Implementation Plan: 주요 실적 페이지 갤러리 구현

## Phase 1: Data Structure & Management [checkpoint: 0134e2b]
실적 데이터를 코드와 분리하여 관리하기 위한 기반을 다집니다.

- [x] **Task: Define Data Schema & File**
    - [x] Create TypeScript interface `Project` for project data.
    - [x] Extract content from `assets/content_text/공사실적.md` and populate `frontend/src/data/projects.json`.
    - [x] Write a test to ensure the JSON file adheres to the schema.
- [x] **Task: Implement Data Access Layer**
    - [x] Create a utility function to load and parse project data.
    - [x] Write unit tests for data loading function.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Data Structure & Management' (Protocol in workflow.md)**

## Phase 2: UI Components (Card & Grid) [checkpoint: 8740b71]
시각적 요소를 담당하는 컴포넌트를 구현합니다.

- [x] **Task: Implement ProjectCard Component**
    - [x] Create `ProjectCard` component displaying image, title, summary, and tags.
    - [x] Write tests to verify content rendering in the card.
    - [x] Apply hover effects and Tailwind styling consistent with the design guide.
- [x] **Task: Implement ProjectGrid Component**
    - [x] Create `ProjectGrid` component for responsive layout (1col mobile, 2col tablet, 3-4col desktop).
    - [x] Write tests to check grid structure logic.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: UI Components (Card & Grid)' (Protocol in workflow.md)**

## Phase 3: Logic & Interactivity [checkpoint: 25a103d]
사용자 상호작용(필터, 검색, 페이징)을 처리하는 로직을 구현합니다.

- [x] **Task: Implement Filtering & Search Logic**
    - [x] Create `useProjects` hook to handle filtering by category and search query.
    - [x] Write unit tests for filtering and search logic (e.g., case-insensitive search).
- [x] **Task: Implement Pagination Logic**
    - [x] Add pagination support to `useProjects` hook.
    - [x] Write tests for page calculation and slicing.
- [x] **Task: Implement Filter & Search UI Components**
    - [x] Create `CategoryFilter`, `SearchBar`, and `Pagination` components.
    - [x] Write interaction tests (e.g., clicking a tab updates the state).
- [x] **Task: Conductor - User Manual Verification 'Phase 3: Logic & Interactivity' (Protocol in workflow.md)**

## Phase 4: Integration & Finalization
모든 요소를 통합하여 페이지를 완성합니다.

- [ ] **Task: Assemble Performance Page**
    - [ ] Integrate components and hooks into `app/performance/page.tsx`.
    - [ ] Move images from `assets/` to `frontend/public/images/projects/` for access.
    - [ ] Write integration tests for the full page workflow.
- [ ] **Task: Documentation & Cleanup**
    - [ ] Generate Implementation Report.
    - [ ] Ensure all images are optimized and alt texts are correct.
- [ ] **Task: Final Checkpoint and Track Finalization**
