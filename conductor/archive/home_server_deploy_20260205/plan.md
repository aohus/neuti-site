# Implementation Plan: 홈서버 배포 및 도메인 연동

## Phase 1: 운영 환경 설정 파일 구축
- [x] Task: 운영용 Docker Compose 설정 작성
    - [x] `docker-compose.prod.yml` 생성 (Nginx, Certbot 서비스 추가 및 운영 환경 최적화)
    - [x] 리스타트 정책(`restart: always`) 및 네트워크 보안 설정
- [x] Task: Nginx 설정 및 Punycode 적용
    - [x] 한글 도메인 Punycode 변환 (`xn--o39am4cy8gnsc00kvxe.com` 등)
    - [x] HTTP -> HTTPS 리다이렉트 및 `.net` -> `.com` 리다이렉트 로직 구현
    - [x] `nginx/conf.d/default.conf` 작성
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: SSL 인증서 및 보안 설정
- [x] Task: Certbot 초기 발급 스크립트 준비
    - [x] 최초 배포 시 SSL 인증서를 발급받기 위한 챌린지 설정 로직 준비
    - [x] 인증서 자동 갱신을 위한 설정 확인
- [x] Task: 환경 변수 템플릿(`.env.prod`) 구성
    - [x] DB 비밀번호, JWT 시크릿 등 운영용 시크릿 관리 템플릿 작성
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: 배포 가이드 및 최종 점검
- [x] Task: 홈서버 실행 매뉴얼 작성
    - [x] `README.deploy.md` 생성 (사용자가 서버에서 실행할 순서 명시: `git pull` -> `.env` 설정 -> `docker compose up`)
- [x] Task: 로컬 시뮬레이션 및 빌드 테스트
    - [x] 로컬에서 `docker-compose.prod.yml` 기반의 이미지 빌드 오류 여부 최종 확인
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: 마무리 및 문서화
- [x] Task: 트랙 결과 보고서 작성
    - [x] `conductor/docs/home_server_deploy_20260205/report.md` 작성
- [x] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
