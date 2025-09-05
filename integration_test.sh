#!/bin/bash
set -e

echo "[*] Starting backend for integration test..."
cd backend
source venv/bin/activate
uvicorn main:app --port 8000 --reload &
BACKEND_PID=$!
sleep 3  # give server a moment

echo "[*] Ingesting sample data..."
python tests/test_ingest.py

echo "[*] Running search test..."
python tests/test_search.py

kill $BACKEND_PID
deactivate
cd ..

echo "[*] Integration test complete!"
