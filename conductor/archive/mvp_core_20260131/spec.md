# Track Specification: Project MVP

## Overview
이 트랙은 '느티나무 협동조합 나무병원' 홈페이지의 핵심 골격을 구축하는 것을 목표로 합니다. FastAPI(백엔드)와 Next.js(프론트엔드)를 사용하여 현대적이고 확장 가능한 구조를 잡고, 주요 정보 페이지를 구현합니다.

## User Stories
- **방문자:** 홈페이지에 접속하여 깔끔한 상단 메뉴를 통해 '회사소개'와 '주요사업' 페이지를 확인할 수 있어야 합니다.
- **방문자:** 자연 친화적이고 전문적인 디자인(녹색/갈색 톤)을 통해 신뢰감을 느껴야 합니다.
- **관리자:** 향후 게시판 기능을 추가할 수 있도록 안정적인 백엔드 API 구조가 마련되어 있어야 합니다.

## Key Features
1. **Core Infrastructure:**
   - FastAPI 기반의 백엔드 API 서버 (Poetry 관리, Python 3.12).
   - Next.js (App Router) 기반의 프론트엔드 웹 서버 (TypeScript, Tailwind CSS).
   - Docker Compose를 이용한 로컬 개발 환경 구성.
2. **Layout & Navigation:**
   - 공통 상단 네비게이션 탭 (회사소개, 주요사업, 주요실적, 공지사항, 수목진단의뢰, 시공/견적문의).
   - 반응형 레이아웃 구현 (모바일 지원).
3. **Information Pages:**
   - **회사소개:** CEO 인터뷰 및 회사 철학을 담은 정적 페이지.
   - **주요사업:** 사업 분야 소개를 위한 기본 레이아웃 구성.

## Tech Stack (As defined in tech-stack.md)
- **Backend:** Python 3.12, FastAPI, Pydantic v2.
- **Frontend:** TypeScript, React, Next.js, Tailwind CSS.
- **DevOps:** Docker, Docker Compose.

## Acceptance Criteria
- [ ] 백엔드와 프론트엔드 서버가 Docker Compose로 정상 실행됨.
- [ ] 모든 상단 탭 메뉴가 존재하며 클릭 시 해당 경로로 이동함 (컨텐츠는 아직 비어있을 수 있음).
- [ ] '회사소개' 페이지에 `회사소개.md`와 `ceo_interview.md`의 핵심 내용이 반영됨.
- [ ] 모든 신규 코드에 대해 테스트 커버리지가 80% 이상임.
- [ ] 모바일 기기(Safari 등)에서 레이아웃이 깨지지 않음.
