# Implementation Plan - Home Content Update

## Phase 1: Asset Preparation & Setup [checkpoint: 6bad758]
- [x] Task: Create directory structure for new assets in `frontend/public/images` (mirroring `assets/img`) [6bad758]
    - [x] Sub-task: Copy hero images to `frontend/public/images/hero`
    - [x] Sub-task: Copy technology section images to `frontend/public/images/technology` (organized by category folders)
- [x] Task: Create a utility/config file to map image paths and tags [6bad758]
    - [x] Sub-task: Define a data structure (array/object) in `frontend/src/data/home-content.ts` that holds the 7 categories, image paths, and tags (derived from filenames).
- [x] Task: Conductor - User Manual Verification 'Asset Preparation & Setup' (Protocol in workflow.md) [6bad758]

## Phase 2: Hero Section Update
- [x] Task: Update Hero Component [a791426]
    - [x] Sub-task: Modify `frontend/src/components/Hero.tsx` (or equivalent) to accept the new image list.
    - [x] Sub-task: Implement fade/slide animation for the 2 hero images.
    - [x] Sub-task: Verify responsive sizing for hero images.
- [ ] Task: Conductor - User Manual Verification 'Hero Section Update' (Protocol in workflow.md)

## Phase 3: Technology Section Implementation
- [ ] Task: Create 'Technology Grid' Component
    - [ ] Sub-task: Create `frontend/src/components/TechnologySection.tsx`.
    - [ ] Sub-task: Implement the layout for the 7 categories (Card/Container structure).
- [ ] Task: Create 'Image Gallery' Sub-Component
    - [ ] Sub-task: Create a component to render the 2-5 images within a category card.
    - [ ] Sub-task: Implement Masonry or flexible grid styling for mixed aspect ratios.
    - [ ] Sub-task: Implement the 'Tag Badge' component to display 'Before', 'After', etc., based on the data.
- [ ] Task: Integrate Technology Section into Main Page
    - [ ] Sub-task: Replace the old 3-card section in `frontend/src/app/page.tsx` with the new `TechnologySection`.
- [ ] Task: Conductor - User Manual Verification 'Technology Section Implementation' (Protocol in workflow.md)

## Phase 4: Refinement & Polish
- [ ] Task: Responsive Design Adjustments
    - [ ] Sub-task: Adjust grid columns for mobile/tablet/desktop.
    - [ ] Sub-task: Ensure text and badges are readable on all devices.
- [ ] Task: Performance Optimization
    - [ ] Sub-task: Ensure images use Next.js `Image` component for optimization.
- [ ] Task: Final Review & Cleanup
    - [ ] Sub-task: Remove unused old assets or code related to the old 3-card section.
- [ ] Task: Conductor - User Manual Verification 'Refinement & Polish' (Protocol in workflow.md)