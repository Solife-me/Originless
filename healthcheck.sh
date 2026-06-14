#!/bin/sh
if curl -fsS http://127.0.0.1:3232/status >/dev/null 2>&1; then
  echo '{"result":null}'
else
  echo '{"error":"Originless API is unreachable"}'
  exit 1
fi
