# Implementation Plan - Home Content Update

## Phase 1: Asset Preparation & Setup [checkpoint: 6bad758]
- [x] Task: Create directory structure for new assets in `frontend/public/images` (mirroring `assets/img`) [6bad758]
    - [x] Sub-task: Copy hero images to `frontend/public/images/hero`
    - [x] Sub-task: Copy technology section images to `frontend/public/images/technology` (organized by category folders)
- [x] Task: Create a utility/config file to map image paths and tags [6bad758]
    - [x] Sub-task: Define a data structure (array/object) in `frontend/src/data/home-content.ts` that holds the 7 categories, image paths, and tags (derived from filenames).
- [x] Task: Conductor - User Manual Verification 'Asset Preparation & Setup' (Protocol in workflow.md) [6bad758]

## Phase 2: Hero Section Update [checkpoint: 2c79fc3]
- [x] Task: Update Hero Component [2c79fc3]
    - [x] Sub-task: Modify `frontend/src/components/Hero.tsx` (or equivalent) to accept the new image list.
    - [x] Sub-task: Implement fade/slide animation for the 2 hero images.
    - [x] Sub-task: Verify responsive sizing for hero images.
- [x] Task: Conductor - User Manual Verification 'Hero Section Update' (Protocol in workflow.md) [2c79fc3]

## Phase 3: Technology Section Implementation [checkpoint: final]
- [x] Task: Implement Interactive Technology Section with Tab & Grid [final]
    - [x] Sub-task: Refactor `TechnologySection` to use Tab navigation for categories.
    - [x] Sub-task: Implement 'Interactive Comparison' with 16:9 main frame and thumbnails.
    - [x] Sub-task: Connect thumbnail clicks to main frame preview and main frame click to Lightbox.
- [x] Task: Conductor - User Manual Verification 'Technology Section Implementation' (Protocol in workflow.md) [final]

## Phase 4: Refinement & Polish [checkpoint: final]
- [x] Task: Hero & CTA Content Refinement [final]
    - [x] Sub-task: Update Hero copy to focus on Green Maintenance and Landscape Planting.
    - [x] Sub-task: Redesign TargetCTA cards for better visibility and modern clean style.
- [x] Task: Global Layout & Spacing [final]
    - [x] Sub-task: Slim down ClientBanner and show full color logos.
    - [x] Sub-task: Implement scroll-based fade for StatisticsDashboard.
    - [x] Sub-task: Increase spacing between main sections for better balance.
- [x] Task: Conductor - User Manual Verification 'Refinement & Polish' (Protocol in workflow.md) [final]