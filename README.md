project-root/
│
│── .env # Global env file for Docker Compose + databases
│── docker-compose.yml # Main docker-compose config
│
├── backend/
│ ├── Dockerfile
│ └── .env.production # Backend-specific env vars
│
└── frontend/
├── Dockerfile
├── nginx.conf
└── .env.production # Frontend-specific env vars

Test if Docker Compose sees the variable
docker-compose config
docker-compose up -d --build
docker-compose --env-file .env up -d --build
