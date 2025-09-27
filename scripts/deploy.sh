#!/bin/bash
set -e

# ==============================
# COLORS
# ==============================
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
BLUE="\033[1;34m"
RESET="\033[0m"

echo "🔨 Building and starting all services..."
docker-compose up -d --build

# Wait a few seconds for health checks (optional)
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "✅ All services are up!"
echo ""
echo "🌐 SERVICE ACCESS INFORMATION:"
echo "🔴 Redis:            redis:6379"
echo "🔍 Redis Insight:    http://localhost:5540"
echo "🟢 Backend API:      http://localhost:5000"
echo "🌐 Web Frontend:     http://localhost"

echo -e "${BLUE}🛠️ MANAGEMENT COMMANDS:${RESET}"
echo "📝 View logs: docker-compose logs -f"
echo "📝 View single service log: docker-compose logs -f [service]"
echo "🛑 Stop services: docker-compose down [service]"
echo "🔄 Restart service: docker-compose restart [service]"

# ==============================
# REBUILD/RESTART BACKEND COMMAND
# ==============================
echo ""
echo -e "${YELLOW}⚡ Rebuild & restart service without cache:${RESET}"
echo "docker-compose build --no-cache [service]"
echo "docker-compose up -d [service]"
echo ""

