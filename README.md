# Full Stack Multi-Service Project

This is a **full-stack project** with multiple services:

- **Backend:** Node.js + TypeScript
- **Frontend:** React + Vite
- **Redis**: In-memory cache
- **PostgreSQL**: Relational database

It uses **Docker and Docker Compose** for both **development** and **production** setups.

---

## Project Structure

```text
project-root/
│
├── docker-compose.yml
│
├── databse/
│   ├── docker-compose.yml
│   └── .env      # databse-specific env vars
│
├── backend/
│   ├── Dockerfile
│   └── .env.production      # Backend-specific env vars
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── .env.production      # Frontend-specific env vars


# Pull images
docker pull node-backend:latest
docker pull react-frontend:latest

# Run backend
docker run -d --name backend \
  --env-file ./backend/.env.production \
  -p 5000:5000 \
  node-backend:latest

# Run frontend
docker run -d --name frontend \
  --env-file ./frontend/.env.production \
  -p 80:80 \
  react-frontend:latest
```

# Manual Docker Compose Commands

# Validate configuration

docker-compose config

# Start Database

# Create OR Delete shared external network

docker network rm app-network
docker network create app-network
docker-compose --env-file .env up -d --build

# Stop containers

docker-compose down
