# Specification: Main Page UX Improvement & Client Banner

## 1. Overview
메인 페이지(Home)의 사용자 경험을 개선하기 위해 Hero 섹션의 레이아웃 겹침 문제를 해결하고, 신뢰도를 높이기 위해 발주처(고객사) CI가 흐르는 롤링 배너 섹션을 추가합니다.

## 2. Functional Requirements

### 2.1 Hero Section Layout Fix
- **Issue:** 현재 Hero 섹션의 텍스트 영역이 상단 내비게이션 바(GNB)에 가려지거나 너무 위쪽으로 치우쳐 보이는 현상이 있음.
- **Requirement:**
  - Hero 섹션의 콘텐츠(텍스트 등)가 GNB에 가리지 않고, 화면 중앙 또는 시각적으로 균형 잡힌 위치에 오도록 상단 여백(padding-top) 또는 컨테이너 레이아웃을 조정합니다.
  - GNB가 고정(Sticky) 상태일 때도 콘텐츠를 침범하지 않아야 합니다.

### 2.2 Client CI Rolling Banner
- **Location:** Hero 섹션 바로 하단.
- **Content Source:** `./assets/발주처CI/` 디렉토리 내의 이미지 파일들.
  - 경기도, 공수처, 성남도시개발공사 등.
- **Behavior:**
  - 한 줄로 배치된 로고들이 끊김 없이 무한으로 흐르는 애니메이션(Infinite Scrolling Marquee) 적용.
  - 사용자 인터랙션 없이 자동으로 부드럽게 흘러가야 함.
- **Reference:** 제공된 Wishket 레퍼런스 이미지 (로고들이 회색조 또는 깔끔하게 정렬되어 흐르는 형태).

## 3. Non-Functional Requirements
- **Performance:** 롤링 애니메이션은 CSS Animation 또는 가벼운 라이브러리를 사용하여 성능 저하 없이 부드럽게(60fps) 동작해야 함.
- **Responsive:** 모바일 및 데스크탑 환경 모두에서 로고의 크기와 개수가 적절히 조절되어야 함.
- **Design:** 전체적인 사이트 톤앤매너("전문적인", "신뢰할 수 있는")에 맞춰 배경색과 로고 스타일을 조화롭게 배치.

## 4. Out of Scope
- 내비게이션 바(GNB) 자체의 디자인 변경.
- Hero 섹션의 배경 이미지나 문구 내용 자체의 변경 (레이아웃 위치만 수정).
