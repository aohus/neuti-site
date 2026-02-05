#!/bin/bash

# 사용자가 이해하기 쉽게 한글 도메인 변수 사용
domains=("느티나무병원.com" "느티나무병원.net")
# 실제 컴퓨터가 사용할 퓨니코드
puny_domains=("xn--o39am4cy8gnsc00kvxe.com" "xn--o39am4cy8gnsc00kvxe.net")

rsa_key_size=4096
data_path="./certbot"
email="info@neuti.co.kr"
staging=0 # 실제 발급 시 0

main_domain="${puny_domains[0]}"

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
fi

echo "### Creating dummy certificate for $main_domain ..."
mkdir -p "$data_path/conf/live/$main_domain"
sudo docker compose -f docker-compose.prod.yml run --rm --entrypoint \
  "openssl req -x509 -nodes -newkey rsa:1024 -days 1\
    -keyout '/etc/letsencrypt/live/$main_domain/privkey.pem' \
    -out '/etc/letsencrypt/live/$main_domain/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "### Starting nginx ..."
sudo docker compose -f docker-compose.prod.yml up --force-recreate -d nginx

echo "### Requesting Let's Encrypt certificate ..."
# 에러 방지를 위해 명령어를 명시적으로 작성
sudo docker compose -f docker-compose.prod.yml run --rm --entrypoint \
  "certbot certonly --webroot -w /var/www/certbot \
    $( [ $staging != "0" ] && echo "--staging" ) \
    --email $email --agree-tos --no-eff-email --force-renewal \
    -d ${puny_domains[0]} -d ${puny_domains[1]}" certbot

echo "### Reloading nginx ..."
sudo docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
