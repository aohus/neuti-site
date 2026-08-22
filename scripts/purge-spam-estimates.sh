#!/usr/bin/env bash
#
# 견적 요청(estimaterequest) 스팸 일괄 삭제.
#
# 2026-02-16 ~ 2026-08-22 사이 접수된 62건은 전부 봇 스팸이었고 정상 문의는 없었다.
# 이 스크립트는 "지정한 시각 이전"에 접수된 행만 지우므로, 실행 도중 들어온 새 요청은
# 건드리지 않는다.
#
# 홈서버에서 실행할 것:
#   cd ~/workspace/neuti-site
#   bash scripts/purge-spam-estimates.sh            # 미리보기 (아무것도 지우지 않음)
#   bash scripts/purge-spam-estimates.sh --delete   # 실제 삭제
#
# 되돌릴 수 없다. --delete 전에 반드시 미리보기로 건수와 내용을 확인할 것.

set -euo pipefail

# 이 시각 이전에 접수된 행만 삭제 대상이다. 확인된 마지막 스팸의 시각.
CUTOFF="${CUTOFF:-2026-08-22 00:04:00}"
CONTAINER="${CONTAINER:-neuti-db}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

if [ ! -f .env ]; then
  echo "ERROR: .env 를 찾을 수 없습니다. ~/workspace/neuti-site 에서 실행하세요." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; . ./.env; set +a

psql_run() {
  docker compose -f "$COMPOSE_FILE" exec -T "$CONTAINER" \
    psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 "$@"
}

echo "기준 시각: $CUTOFF 이전 접수분"
echo

echo "--- 삭제 대상 건수 ---"
psql_run -c "SELECT count(*) AS 삭제대상 FROM estimaterequest WHERE created_at < TIMESTAMPTZ '$CUTOFF';"

echo "--- 남게 될 건수 ---"
psql_run -c "SELECT count(*) AS 유지 FROM estimaterequest WHERE created_at >= TIMESTAMPTZ '$CUTOFF';"

echo "--- 삭제 대상 미리보기 (최근 10건) ---"
psql_run -c "SELECT id, org_name, contact_name, contact_phone, created_at
             FROM estimaterequest
             WHERE created_at < TIMESTAMPTZ '$CUTOFF'
             ORDER BY created_at DESC LIMIT 10;"

if [ "${1:-}" != "--delete" ]; then
  echo
  echo "미리보기만 실행했습니다. 실제로 지우려면: bash $0 --delete"
  exit 0
fi

echo
echo "삭제를 진행합니다..."
psql_run -c "DELETE FROM estimaterequest WHERE created_at < TIMESTAMPTZ '$CUTOFF';"

echo "--- 삭제 후 남은 건수 ---"
psql_run -c "SELECT count(*) AS 남은건수 FROM estimaterequest;"
echo "완료."
