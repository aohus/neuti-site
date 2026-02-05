# 느티나무병원 홈페이지 배포 가이드 (홈서버용)

이 가이드는 Ubuntu/Linux 환경의 홈서버에서 Docker Compose를 사용하여 서비스를 배포하는 방법을 설명합니다.

## 1. 사전 준비 사항
- 서버에 **Docker** 및 **Docker Compose**가 설치되어 있어야 합니다.
- 도메인(`느티나무병원.com`, `느티나무병원.net`)의 DNS 설정이 홈서버의 외부 IP를 가리키고 있어야 합니다.
- **포트 안내:** 이미 다른 서버가 80, 443 포트를 사용 중이므로, 이 프로젝트는 **8080** 및 **8443** 포트를 사용하도록 설정되었습니다.
- **기존 서버 설정:** 80, 443을 점유 중인 메인 리버스 프록시(Nginx 등)에서 다음과 같이 `proxy_pass` 설정을 추가해야 합니다.
  ```nginx
  # 기존 서버의 설정 예시
  server {
      listen 80;
      server_name xn--o39am4cy8gnsc00kvxe.com;
      location / {
          proxy_pass http://localhost:8080;
      }
  }
  ```

## 2. 소스 코드 가져오기 및 설정
```bash
# 최신 소스 가져오기
git pull origin main

# 운영용 환경 변수 설정
cp .env.prod .env
# .env 파일을 열어 비밀번호 및 시크릿 키를 실제 값으로 수정하세요.
nano .env
```

## 3. SSL 인증서 발급 (최초 1회)
**주의:** 80포트를 이미 다른 서버가 사용 중이므로, 해당 서버 설정에서 `/.well-known/acme-challenge/` 요청을 `http://localhost:8080`으로 전달하도록 설정해야 인증서 발급이 가능합니다.

```bash
# 실행 권한 부여
chmod +x init-letsencrypt.sh

# 스크립트 실행
sudo ./init-letsencrypt.sh
```
*주의: 스크립트 실행 중 Nginx가 잠시 구동되며, 인증서 발급 성공 후 자동으로 리로드됩니다.*

## 4. 서비스 실행
인증서 발급이 완료되었다면 전체 서비스를 생산 모드로 실행합니다.
```bash
# 전체 서비스 빌드 및 백그라운드 실행
sudo docker compose -f docker-compose.prod.yml up --build -d
```

## 5. 유지 보수 및 업데이트
새로운 코드가 반영되었을 때:
```bash
git pull origin main
sudo docker compose -f docker-compose.prod.yml up --build -d
```

로그 확인:
```bash
sudo docker compose -f docker-compose.prod.yml logs -f
```

## 6. 도메인 정보 (참고)
- 주 도메인: `느티나무병원.com` (`xn--o39am4cy8gnsc00kvxe.com`)
- 보조 도메인: `느티나무병원.net` (`xn--o39am4cy8gnsc00kvxe.net`) -> `.com`으로 자동 리다이렉트
