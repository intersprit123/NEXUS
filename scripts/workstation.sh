#!/usr/bin/env bash
set -euo pipefail

docker compose --profile workstation build nexus-workstation
docker compose --profile workstation up -d nexus-workstation

echo
echo "NEXUS workstation is ready."
echo
echo "Enter it with:"
echo "  docker compose --profile workstation exec nexus-workstation bash"
echo
echo "Lab targets:"
echo "  Juice Shop: http://juice-shop:3000"
echo "  WebGoat:    http://webgoat:8080"
echo "  WebWolf:    http://webgoat:9090"
echo "  DVWA:       http://dvwa"
