# Specification: 홈서버 배포 및 도메인 연동

## 1. 개요 (Overview)
- **목적:** 현재 로컬 환경에서 개발 중인 서비스를 홈서버(Ubuntu/Linux)에 배포하고, 보유 중인 도메인(`느티나무병원.com`, `느티나무병원.net`)과 연동하여 안정적인 외부 접속 환경 구축.
- **핵심 목표:** Docker Compose 기반의 무중단 배포 환경 마련 및 HTTPS 보안 접속 적용.

## 2. 주요 기능 및 요구사항 (Functional Requirements)

### A. 운영 환경 최적화 (Production Setup)
- Ubuntu/Linux 환경에서 Docker 및 Docker Compose를 사용한 컨테이너 기반 운영.
- 개발 환경(Development)과 분리된 운영 환경(Production)용 `docker-compose.prod.yml` 및 환경 변수(`.env`) 설정.

### B. Nginx 리버스 프록시 및 도메인 연동
- Nginx 컨테이너를 도입하여 백엔드(FastAPI) 및 프론트엔드(Next.js) 서비스 연결.
- **주 도메인:** `느티나무병원.com` (Punycode: `xn--o39am4cy8gnsc00kvxe.com`)
- **보조 도메인:** `느티나무병원.net` 접속 시 `느티나무병원.com`으로 301 영구 리다이렉트 처리.

### C. SSL(HTTPS) 보안 적용
- Let's Encrypt (Certbot)을 사용하여 두 도메인에 대한 SSL 인증서 발급.
- 인증서 만료 전 자동 갱신 로직 포함 (Certbot Container 활용).
- 모든 HTTP(80) 요청을 HTTPS(443)로 강제 리다이렉트.

### D. 서비스 구성
- **Frontend:** Next.js (Standalone 빌드 최적화)
- **Backend:** FastAPI (Uvicorn 생산 환경 설정)
- **DB:** PostgreSQL (볼륨 마운트를 통한 데이터 영속성 확보)
- **Watcher:** 마크다운 동기화 스크립트 백그라운드 상시 가동.

## 3. 비기능 요구사항 (Non-functional Requirements)
- **데이터 보안:** DB 컨테이너 포트를 외부에 직접 노출하지 않고 컨테이너 내부 네트워크에서만 통신.
- **안정성:** 서버 재부팅 시 Docker 서비스 자동 실행 설정(`restart: always`).

## 4. 수락 기준 (Acceptance Criteria)
- `느티나무병원.com` 접속 시 HTTPS가 정상 적용된 메인 화면이 보이는가?
- `느티나무병원.net` 접속 시 `느티나무병원.com`으로 리다이렉트 되는가?
- 외부에서 수목진단 의뢰 및 게시판 등 API 통신이 정상적으로 작동하는가?
- DB 데이터가 서버 재시작 후에도 유실되지 않고 보존되는가?
