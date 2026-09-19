#!/usr/bin/env bash
set -euo pipefail

command -v docker >/dev/null 2>&1 || { echo "Docker is required."; exit 1; }
docker compose up -d
echo
echo "NEXUS labs are starting:"
echo "  Juice Shop : http://127.0.0.1:3000"
echo "  WebGoat     : http://127.0.0.1:8081/WebGoat/"
echo "  WebWolf     : http://127.0.0.1:9091/WebWolf/"
echo "  DVWA        : http://127.0.0.1:4280"
