# Docker Compose Project Setup

This project uses **Docker Compose** to run a full-stack application with separate backend and frontend services. Environment variables are managed with `.env` files for global and service-specific configurations.

---

## Project Structure

```text
project-root/
│
├── .env                     # Global env file for Docker Compose + databases
├── docker-compose.yml       # Main docker-compose config
│
├── backend/
│   ├── Dockerfile
│   └── .env.production      # Backend-specific env vars
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── .env.production      # Frontend-specific env vars


Validate and Run Locally

# Validate Docker Compose configuration
docker-compose config

# Build and start containers in detached mode
docker-compose up -d --build

# Explicitly specify a custom env file
docker-compose --env-file .env up -d --build

# Stop containers
docker-compose down


Pull and Run Pre-Built Docker Images
If you are using images from a Docker registry instead of building locally:

# Pull backend and frontend images
docker pull node-backend:latest
docker pull react-frontend:latest

# Run backend container using env file
docker run -d --name backend \
  --env-file ./backend/.env.production \
  -p 5000:5000 \
  node-backend:latest

# Run frontend container using env file
docker run -d --name frontend \
  --env-file ./frontend/.env.production \
  -p 80:80 \
  react-frontend:latest


Using Docker Compose with Pulled Images
Update your docker-compose.yml to use the pulled images:

services:
  backend:
    image: node-backend:latest
    env_file:
      - ./backend/.env.production
    ports:
      - "5000:5000"

  frontend:
    image: react-frontend:latest
    env_file:
      - ./frontend/.env.production
    ports:
      - "80:80"


docker-compose logs -f

