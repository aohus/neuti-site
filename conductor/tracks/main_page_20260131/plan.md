# Implementation Plan: 메인 페이지 구현

## Phase 1: Basic Structure & Hero Carousel
메인 페이지의 골격과 핵심적인 캐러셀 섹션을 구현합니다.

- [x] **Task: Setup Main Page Scaffolding**
    - [x] Clean up current `app/page.tsx`.
    - [x] Create a reusable `Container` component using Tailwind.
    - [x] Define the overall page background and typography.
- [x] **Task: Implement Hero Carousel**
    - [x] Create `MainCarousel` component with auto-play and manual controls.
    - [x] Apply text shadows and brightness filters as per original design.
    - [x] Write tests for carousel visibility and content.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Basic Structure & Hero Carousel' (Protocol in workflow.md)**

## Phase 2: Information & Service Sections
회사의 가치와 주요 사업 분야를 소개하는 섹션들을 구현합니다.

- [x] **Task: Implement Mission & Landscaping Sections**
    - [x] Create Mission Statement banner (Section 2).
    - [x] Implement Landscaping & Garden section with side-by-side layout (Section 3).
    - [x] Re-create icons and styling using SVG or Lucide.
- [x] **Task: Implement Tree Hospital Section**
    - [x] Create Tree Hospital card grid (Section 4).
    - [x] Implement hover effects for cards consistent with the design guide.
    - [x] Write unit tests for card rendering.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Information & Service Sections' (Protocol in workflow.md)**

## Phase 3: Dynamic Data & Final CTA
최신 데이터를 가져와 표시하고 하단 배너를 완성합니다.

- [x] **Task: Integrate Latest Updates (Notice & Projects)**
    - [x] Fetch latest 5 notices from `/api/v1/notice/`.
    - [x] Fetch latest 4 projects from `/api/v1/performance/` (or current data file).
    - [x] Implement 'Recent Updates' and 'Major Projects' grid layout (Section 5).
- [x] **Task: Implement Final CTA Banner**
    - [x] Create the green CTA banner with a pill-shaped button (Section 6).
    - [x] Verify all links (`/intro`, `/diagnosis`, `/notice`, etc.).
- [x] **Task: Conductor - User Manual Verification 'Phase 3: Dynamic Data & Final CTA' (Protocol in workflow.md)**

## Phase 4: Quality Check & Finalization
전체적인 완성도를 높이고 트랙을 마무리합니다.

- [x] **Task: Final Polish & Responsive Check**
    - [x] Detailed mobile view testing for all sections.
    - [x] Optimize images using `next/image`.
    - [x] Generate Implementation Report.
- [x] **Task: Final Checkpoint and Track Finalization**
