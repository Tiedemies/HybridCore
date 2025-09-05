#!/bin/bash
set -e

# Run backend
echo "[*] Starting backend..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
deactivate
cd ..

# Run frontend
echo "[*] Starting frontend..."
cd frontend
npm run dev -- --port 5173 &
FRONTEND_PID=$!
cd ..

# Trap exits
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo "[*] Backend running at http://127.0.0.1:8000"
echo "[*] Frontend running at http://127.0.0.1:5173"

# Keep alive
wait
