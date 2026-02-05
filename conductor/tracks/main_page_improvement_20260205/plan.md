# Implementation Plan: 메인 페이지 UI 개선 (홍보 전략 강화)

## Phase 1: 데이터 분석 및 백엔드 기반 마련
- [x] Task: 공사 실적 통계 API 개발
    - [x] `공사실적.md` 데이터를 기반으로 총 공사 건수, 공공기관 계약 수, 주요 작업 분야별 통계 산출 로직 구현
    - [x] `GET /api/v1/performance/stats` 엔드포인트 추가
- [x] Task: 통계 기능 단위 테스트
    - [x] `backend/tests/test_performance.py`에 통계 산출 정확도 검증 테스트 작성 및 통과
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: 프론트엔드 데이터 시각화 및 컴포넌트 구현
- [x] Task: 데이터 대시보드(Counter) 컴포넌트 구현
    - [x] 숫자가 올라가는 애니메이션이 포함된 `StatisticsDashboard` 컴포넌트 작성
    - [x] `StatisticsDashboard.test.tsx` 작성 및 검증
- [x] Task: 타겟 고객별 진입로(TargetCard) 컴포넌트 구현
    - [x] 아파트/기업/공공기관별 맞춤형 UI 카드 작성
    - [x] 각 카드별 이동 경로(Query Parameter 등) 연동
- [x] Task: 전문가 프로세스 시각화(ProcessFlow) 컴포넌트 구현
    - [x] [진단-처방-방제-결과] 단계별 수직/수평 타임라인 UI 구현
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: 메인 페이지 레이아웃 재구성 및 연동
- [x] Task: `frontend/src/app/page.tsx` 리팩토링
    - [x] 신규 컴포넌트들을 전략적 흐름(Narrative Flow)에 맞춰 배치
    - [x] 기존 히어로 섹션 카피를 "전문가 및 데이터 중심"으로 업데이트
- [x] Task: 메인 페이지 통합 테스트 및 반응형 점검
    - [x] `index.test.tsx` 업데이트 및 모바일 환경 레이아웃 깨짐 확인
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: 마무리 및 문서화
- [x] Task: 최종 QA 및 성능 최적화
    - [x] 고해상도 작업 사진(B&A) 최적화 적용 및 Lighthouse 점수 확인
- [x] Task: 트랙 결과 보고서 작성
    - [x] `conductor/docs/main_page_improvement_20260205/report.md` 작성
- [x] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
