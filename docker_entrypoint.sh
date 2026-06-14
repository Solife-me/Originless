#!/bin/sh
set -eu

DATA_DIR="/data"
START9_DIR="$DATA_DIR/start9"
CONFIG_YAML="$START9_DIR/config.yaml"
ENV_FILE="$START9_DIR/originless.env"
PIN_MANAGER_JSON="$START9_DIR/pin-manager.json"
STATS_YAML="$START9_DIR/stats.yaml"

mkdir -p "$START9_DIR" /tmp/originless

STORAGE_MAX_DEFAULT="200GB"
FILE_LIMIT_DEFAULT="5GB"
REMOTE_FILE_LIMIT_DEFAULT="2GB"

ENV_STORAGE_MAX="${STORAGE_MAX:-}"
ENV_FILE_LIMIT="${FILE_LIMIT:-}"
ENV_REMOTE_FILE_LIMIT="${REMOTE_FILE_LIMIT:-}"
ENV_ALLOWED_USERS="${ALLOWED_USERS:-}"
ENV_ADDITIONAL_ALLOWED_USERS="${ADDITIONAL_ALLOWED_USERS:-}"

if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  . "$ENV_FILE"
fi

[ -n "$ENV_STORAGE_MAX" ] && STORAGE_MAX="$ENV_STORAGE_MAX"
[ -n "$ENV_FILE_LIMIT" ] && FILE_LIMIT="$ENV_FILE_LIMIT"
[ -n "$ENV_REMOTE_FILE_LIMIT" ] && REMOTE_FILE_LIMIT="$ENV_REMOTE_FILE_LIMIT"
[ -n "$ENV_ALLOWED_USERS" ] && ALLOWED_USERS="$ENV_ALLOWED_USERS"
[ -n "$ENV_ADDITIONAL_ALLOWED_USERS" ] && ADDITIONAL_ALLOWED_USERS="$ENV_ADDITIONAL_ALLOWED_USERS"

: "${STORAGE_MAX:=$STORAGE_MAX_DEFAULT}"
: "${FILE_LIMIT:=$FILE_LIMIT_DEFAULT}"
: "${REMOTE_FILE_LIMIT:=$REMOTE_FILE_LIMIT_DEFAULT}"
: "${ALLOWED_USERS:=}"
: "${ADDITIONAL_ALLOWED_USERS:=}"

PIN_MANAGER_PUBLIC_KEY=""
PIN_MANAGER_PRIVATE_KEY=""

if [ -z "$ALLOWED_USERS" ]; then
  if [ ! -f "$PIN_MANAGER_JSON" ]; then
    node -e 'const fs=require("fs"); const {generateKeyPair}=require("daku"); fs.writeFileSync(process.argv[1], JSON.stringify(generateKeyPair(), null, 2));' "$PIN_MANAGER_JSON"
  fi

  PIN_MANAGER_PUBLIC_KEY="$(node -e 'const fs=require("fs"); const data=JSON.parse(fs.readFileSync(process.argv[1], "utf8")); process.stdout.write(data.publicKey || "");' "$PIN_MANAGER_JSON")"
  PIN_MANAGER_PRIVATE_KEY="$(node -e 'const fs=require("fs"); const data=JSON.parse(fs.readFileSync(process.argv[1], "utf8")); process.stdout.write(data.privateKey || "");' "$PIN_MANAGER_JSON")"
  ALLOWED_USERS="$PIN_MANAGER_PUBLIC_KEY"
else
  PIN_MANAGER_PUBLIC_KEY="$(node -e '
const first = (process.argv[1] || "").split(",").map((v) => v.trim()).filter(Boolean)[0] || "";
process.stdout.write(first);
' "$ALLOWED_USERS")"
fi

ALLOWED_USERS="$(node -e '
const base = process.argv[1] || "";
const extra = process.argv[2] || "";
const values = [...base.split(","), ...extra.split(",")].map((v) => v.trim()).filter(Boolean);
process.stdout.write([...new Set(values)].join(","));
' "$ALLOWED_USERS" "$ADDITIONAL_ALLOWED_USERS")"

cat > "$STATS_YAML" <<EOF
version: 2
data:
  "Storage Limit":
    type: string
    value: "$STORAGE_MAX"
    copyable: false
    qr: false
    masked: false
    description: "Maximum size of the embedded IPFS repository."
  "Upload Limit":
    type: string
    value: "$FILE_LIMIT"
    copyable: false
    qr: false
    masked: false
    description: "Maximum size accepted by the /upload endpoint."
  "Remote Upload Limit":
    type: string
    value: "$REMOTE_FILE_LIMIT"
    copyable: false
    qr: false
    masked: false
    description: "Maximum size accepted by the /remoteupload endpoint."
  "Pin Management Public Key":
    type: string
    value: "$PIN_MANAGER_PUBLIC_KEY"
    copyable: true
    qr: false
    masked: false
    description: "Use this Daku public key to authorize pin-management clients."
  "Pin Management Private Key":
    type: string
    value: "$PIN_MANAGER_PRIVATE_KEY"
    copyable: true
    qr: false
    masked: true
    description: "Use this Daku private key to sign pin-management requests."
EOF

export STORAGE_MAX
export FILE_LIMIT
export REMOTE_FILE_LIMIT
export ALLOWED_USERS
export IPFS_PATH="$DATA_DIR"
export NODE_ENV="production"

if [ ! -f "$IPFS_PATH/config" ]; then
  ipfs init --profile=lowpower
fi

ipfs config Datastore.StorageMax "$STORAGE_MAX"
ipfs config --json Routing.Type '"dhtclient"'
ipfs config --json Provide.DHT.Interval '"24h"'

ipfs daemon --enable-gc --routing=dhtclient &
IPFS_PID=$!

cleanup() {
  kill "$IPFS_PID" 2>/dev/null || true
}

trap cleanup INT TERM

until curl -fsS -X POST http://127.0.0.1:5001/api/v0/id >/dev/null 2>&1; do
  echo "Waiting for IPFS daemon..."
  sleep 3
done

exec node app.js
