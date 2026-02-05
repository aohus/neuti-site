# Implementation Plan: Main Page UX Improvement & Client Banner

메인 페이지의 Hero 섹션 레이아웃 문제를 해결하고, 발주처 CI 롤링 배너를 추가하여 시각적 완성도와 신뢰도를 높입니다.

## Phase 1: Preparation & Analysis
- [x] Task: Analyze current Hero section component and CSS. Identify the cause of the overlap with the GNB.
- [x] Task: Verify the contents of `./assets/발주처CI/` and prepare public assets for the frontend.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Preparation & Analysis' (Protocol in workflow.md)

## Phase 2: Hero Section Layout Fix (TDD)
- [ ] Task: Write tests to verify Hero section positioning and container spacing.
- [ ] Task: Implement CSS/Layout fixes to prevent GNB overlap and center the Hero content properly.
- [ ] Task: Verify fix across different screen sizes (Responsive check).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Hero Section Layout Fix' (Protocol in workflow.md)

## Phase 3: Client CI Rolling Banner Implementation (TDD)
- [ ] Task: Write tests for the Rolling Banner component (rendering items, animation structure).
- [ ] Task: Implement `ClientBanner` component with infinite scrolling CSS animation.
- [ ] Task: Integrate `ClientBanner` into the Main Page, positioned below the Hero section.
- [ ] Task: Apply responsive styling for the banner (logo sizes, speed).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Client CI Rolling Banner' (Protocol in workflow.md)

## Phase 4: Final Review & Refinement
- [ ] Task: Final visual check against the reference image (Wishket style).
- [ ] Task: Run full test suite and linting.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Review & Refinement' (Protocol in workflow.md)
