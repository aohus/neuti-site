# Product Definition

## 1. Initial Concept

1. '느티나무 협동조합 나무병원'을 소개하고 **공사 계약 수주를 위한 매력적인 홈페이지 제작**
   - 홍보브로슈어, ceo(권정미) 인터뷰 참고해서 회사 철학과 방향 정리
     - 홍보브로슈어: `./assets/브로슈어/`
     - 인터뷰: `./assets/content_text/ceo_interview.md`
   - 회사 철학과 방향을 토대로 홈페이지 전체 디자인 전략 정리
2. 주요사업 페이지의 컨텐츠 생성 및 홈페이지에 등록
3. 주요실적 페이지의 컨텐츠 생성 및 홈페이지에 등록

## 2. Target Users

- **개인 정원 소유자:** 수목 진단 및 치료가 필요한 개인.
- **아파트 관리사무소/기업:** 조경 공사 및 체계적인 수목 관리가 필요한 단체.
- **공공기관 담당자:** 가로수, 공원 등 공공 조경 및 수목 관리 담당자.

## 3. Goals

- **수주 확대:** 매력적인 포트폴리오 전시를 통해 공사 계약 수주 유도.
- **문의 채널 구축:** 수목 진단 의뢰 및 시공/견적 문의를 위한 효율적인 창구 마련.
- **브랜드 홍보:** '나무는 삶의 동반자'라는 철학과 전문성을 알려 신뢰도 제고.
- **기록 및 전시:** 주요 사업 영역과 실적을 체계적으로 아카이빙하고 시각적으로 제시.

## 4. Design Strategy

- **Concept:** "생명을 살리는 전문가 & 따뜻한 마을 공동체".
- **Tone & Manner:** 진정성 있는, 전문적인, 따뜻한, 신뢰할 수 있는.
- **UI Reference:** https://www.namoohealthcoop.or.kr/s01/s01.php (기존 레퍼런스 스타일 계승 및 발전)

## 5. Site Structure (Navigation)

상단 탭은 클릭 시 페이지를 이동하며, 탭 메뉴는 항상 유지됩니다.

- 회사소개
- 주요사업
- 주요실적
- 공지사항
- 수목진단의뢰
- 시공/견적문의

## 6. Page Guidelines & Content

각 페이지별 상세 가이드 및 참조 파일입니다.

### 1) 회사소개

- **Content Source:** `./assets/content_text/회사소개.md`
- **Description:** CEO 인터뷰 및 홍보 브로슈어의 내용을 바탕으로 회사 철학과 방향을 소개.

### 2) 주요사업

- **Content Source:** `./assets/content_text/공사실적.md`, 홍보브로슈어
- **Display Style:**
  - 브랜드 브로슈어 스타일의 스토리텔링형 레이아웃 (나무병원 사업, 조경식재 사업 섹션).
  - 대형 이미지와 구조화된 타이포그래피를 활용한 시각적 전문성 강조.
  - 백엔드 데이터베이스와 연동하여 카테고리별 관련 시공 사례(Performance) 자동 노출.
- **References:**
  - https://m.blog.naver.com/PostView.naver?blogId=treestar132&logNo=224126163960&navType=by
  - https://m.blog.naver.com/PostView.naver?blogId=treestar132&logNo=223996189390&navType=by

### 3) 주요실적

- **Content Source:** `./assets/content_text/공사실적.md`
- **Description:** 다른 회사 레퍼런스를 참고하여 페이지 및 내용 생성.
- **Reference Image:** `./assets/page_reference/주요실적.png`

### 4) 수목진단의뢰

- **Description:** 다른 회사 레퍼런스를 참고하여 페이지 및 내용 생성.
- **Reference Image:** `./assets/page_reference/진단의뢰.png`
- **File Download:** `./assets/의뢰서/수목진단의뢰.hwp` 제공.

### 5) 공지사항

- **Type:** 게시판 (CRUD)

- **Permission:** 로그인한 관리자만 작성/수정/삭제 가능. 일반 사용자는 읽기 가능.

- **Features:** 페이징, 키워드 검색, 조회수 기능.



### 6) 시공/견적문의

- **Type:** 게시판 (CRUD)

- **Permission:** 누구나 작성 가능. 관리자만 답변 작성 가능.

- **Features:** 비밀글 기능(비밀번호 보호), 답변완료 상태 표시, 페이징, 키워드 검색.
