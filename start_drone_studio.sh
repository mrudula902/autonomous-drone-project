#!/bin/bash

PROJECT="$HOME/autonomous-drone-project"

echo ""
echo "=============================================="
echo "   AUTONOMOUS DRONE MISSION STUDIO"
echo "=============================================="
echo ""

cd "$PROJECT" || exit 1

echo "[1/3] Starting Drone API..."

python3 backend/drone_status_api.py > /tmp/drone_api.log 2>&1 &
API_PID=$!

sleep 2

echo "[2/3] Starting Telemetry Server..."

python3 backend/telemetry_server.py > /tmp/telemetry.log 2>&1 &
TELEMETRY_PID=$!

sleep 2

echo "[3/3] Starting Frontend..."

cd "$PROJECT/frontend" || exit 1

echo ""
echo "=============================================="
echo "   FRONTEND STARTING"
echo "   http://127.0.0.1:5173"
echo "=============================================="
echo ""

npm run dev -- --host 127.0.0.1 --open
