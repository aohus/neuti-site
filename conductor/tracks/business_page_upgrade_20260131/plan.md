# Implementation Plan: 주요 사업 페이지 고도화 및 사례 연동

브로슈어 감성의 스토리텔링 레이아웃을 구현하고, 시공 사례를 카테고리별로 자동 연동합니다.

## Phase 1: Backend & Data Schema Update [checkpoint: e8fd0ba]
시공 사례를 사업 분야별로 분류하기 위한 데이터 기반을 마련합니다.

- [x] Task: Backend - `Performance` 모델에 `category` 필드 추가 및 마이그레이션
- [x] Task: Backend - Pydantic 스키마(`PerformanceCreate`, `PerformanceUpdate`) 업데이트
- [x] Task: Frontend - `Performance` 타입 정의에 `category` 추가
- [x] Task: Frontend - `PerformanceForm`에 카테고리 선택(Radio 또는 Select) UI 추가
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend & Admin Setup' (Protocol in workflow.md)

## Phase 2: Major Business UI - Tree Hospital Section
"나무병원 사업" 영역을 시원한 브로슈어 스타일로 구현합니다.

- [x] Task: Frontend - `BusinessHero` 컴포넌트 구현 (페이지 상단 타이틀)
- [x] Task: Frontend - '나무병원 사업' 상세 섹션 구현
- [x] Task: Frontend - '나무병원' 카테고리 시공 사례 페칭 및 연동
- [x] Task: Conductor - User Manual Verification 'Phase 2: Tree Hospital Section' (Protocol in workflow.md)

## Phase 3: Major Business UI - Landscaping Section
"조경식재 사업" 영역을 전문적인 포트폴리오 스타일로 구현합니다.

- [x] Task: Frontend - '조경식재 사업' 상세 섹션 구현
- [x] Task: Frontend - '조경식재' 카테고리 시공 사례 페칭 및 연동
- [x] Task: Conductor - User Manual Verification 'Phase 3: Landscaping Section' (Protocol in workflow.md)

## Phase 4: Final Polish & Animation
전체적인 완성도를 높이고 사용자 경험을 개선합니다.

- [x] Task: Frontend - `framer-motion`을 이용한 스크롤 애니메이션 적용
- [x] Task: Frontend - 모바일 반응형 레이아웃 최종 점검
- [x] Task: Final Checkpoint and Track Finalization
    - Implementation Report 작성 및 아카이빙 준비