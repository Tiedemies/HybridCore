#!/bin/bash
set -e

PORT=8000

echo "[*] Checking for existing uvicorn on port $PORT..."
PID=$(lsof -ti tcp:$PORT || true)
if [ -n "$PID" ]; then
  echo "[*] Killing existing uvicorn process: $PID"
  kill -9 $PID
  sleep 1
fi

echo "[*] Starting backend on port $PORT..."
cd backend
source venv/bin/activate
uvicorn main:app --port $PORT --reload &
BACKEND_PID=$!
sleep 3  # give server a moment

echo "[*] Ingesting sample data..."
python tests/test_ingest.py || echo "[!] Ingest test failed"

echo "[*] Running search test..."
python tests/test_search.py || echo "[!] Search test failed"

echo "[*] Cleaning up..."
kill $BACKEND_PID
deactivate
cd ..

echo "[*] Integration test complete!"
