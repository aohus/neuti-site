# Implementation Plan: Main Page UX Improvement & Client Banner

메인 페이지의 Hero 섹션 레이아웃 문제를 해결하고, 발주처 CI 롤링 배너를 추가하여 시각적 완성도와 신뢰도를 높입니다.

## Phase 1: Preparation & Analysis [checkpoint: 55d02d7]
- [x] Task: Analyze current Hero section component and CSS. Identify the cause of the overlap with the GNB.
- [x] Task: Verify the contents of `./assets/발주처CI/` and prepare public assets for the frontend.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Preparation & Analysis' (Protocol in workflow.md)

## Phase 2: Hero Section Layout Fix (TDD) [checkpoint: 94da661]
- [x] Task: Write tests to verify Hero section positioning and container spacing.
- [x] Task: Implement CSS/Layout fixes to prevent GNB overlap and center the Hero content properly.
- [x] Task: Verify fix across different screen sizes (Responsive check).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Hero Section Layout Fix' (Protocol in workflow.md)

## Phase 3: Client CI Rolling Banner Implementation (TDD)
- [x] Task: Write tests for the Rolling Banner component (rendering items, animation structure).
- [x] Task: Implement `ClientBanner` component with infinite scrolling CSS animation.
- [x] Task: Integrate `ClientBanner` into the Main Page, positioned below the Hero section.
- [x] Task: Apply responsive styling for the banner (logo sizes, speed).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Client CI Rolling Banner' (Protocol in workflow.md)

## Phase 4: Refinement based on Feedback
- [x] Task: Adjust MainCarousel height to occupy most of the viewport (trustworthy look).
- [x] Task: Replace MainCarousel background photo with a simple, solid/gradient design.
- [x] Task: Fix ClientBanner overlap issue (increase spacing or fix animation).
- [x] Task: Conductor - User Manual Verification 'Phase 4: Refinement' (Protocol in workflow.md)

## Phase 5: Advanced Refinement (Reliability & Quality)
- [x] Task: Fix Rolling Banner overlap definitively (use min-width and margin).
- [x] Task: Upgrade Hero Section with "Social Proof" metrics (completed projects count, etc.) and high-quality background overlay to convey trust.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Advanced Refinement' (Protocol in workflow.md)
