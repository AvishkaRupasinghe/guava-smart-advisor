#!/usr/bin/env bash
echo "Starting Guava Smart Advisor on Railway..."

uvicorn backend.app.main:app \
  --host 0.0.0.0 \
  --port ${PORT:-8000}
