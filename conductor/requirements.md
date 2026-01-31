# 목표

1. '느티나무 협동조합 나무병원'을 소개하고 **공사 계약 수주를 위한 매력적인 홈페이지 제작**
   - 홍보브로슈어, ceo(권정미) 인터뷰 참고해서 회사 철학과 방향 정리
     - 홍보브로슈어: ./assets/브로슈어/
     - 인터뷰: ./assets/content_text/ceo_interview.md
   - 회사 철학과 방향을 토대로 홈페이지 전체 디자인 전략 정리
     - UI reference: https://www.namoohealthcoop.or.kr/s01/s01.php
2. 주요사업 페이지의 컨텐츠 생성 및 홈페이지에 등록
3. 주요실적 페이지의 컨텐츠 생성 및 홈페이지에 등록

# 홈페이지 기본 구성

아래 기본 구성 요소를 토대로 하고, 기업 홍보 및 마케팅 전략에 맞게 추가 구성 추천해주세요.
콘텐츠 내용은 `content` 에 링크된 파일 참고하고, 레퍼런스의 형식을 참고하세요.

---

## 상단탭(: 클릭해서 page 보여주고, tab 은 유지)

- 회사소개
- 주요사업
- 주요실적
- 공지사항
- 수목진단의뢰
- 시공/견적문의

## 페이지별 가이드

### 회사소개

- content: ./assets/content_text/회사소개.md

### 주요사업

홍보브로슈어에 나온 사업 분야 소개와 이미지가 잘 드러나도록 구성.

- content: ./assets/content_text/공사실적.md
- 1개의 공사가 1개의 블로그 글이 되도록하고 페이지에는 사진+제목이 갤러리처럼 노출되도록(사진은 비워도 됨)
  - 레퍼런스 블로그: https://m.blog.naver.com/PostView.naver?blogId=treestar132&logNo=224126163960&navType=by
  - 레퍼런스 블로그: https://m.blog.naver.com/PostView.naver?blogId=treestar132&logNo=223996189390&navType=by

### 주요실적

- content: ./assets/content_text/공사실적.md
- 다른 회사 레퍼런스 참고해서 페이지/내용 생성
  - 레퍼런스 이미지: ./assets/page_reference/주요실적.png

### 수목진단의뢰

- 다른 회사 레퍼런스 참고해서 페이지/내용 생성
  - 레퍼런스 이미지: ./assets/page_reference/진단의뢰.png
- 의뢰서 파일: ./assets/의뢰서/수목진단위뢰.hwp

### 공지사항

- 게시판(CRUD)
- 관리자만 작성 가능

### 시공/견적문의

- 게시판(CRUD)
- 관리자가 게시물에 답변 달 수 있도록

---
