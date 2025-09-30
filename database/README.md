# Database Setup

Local development database setup using Docker Compose with PostgreSQL and Redis.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

1. **Copy environment template:**

   ```bash
   cp .env
   ```

2. **Update credentials** in `.env` (use strong passwords for production)

3. **Create or Delete the network:**

   ```bash
   docker network rm app-network
   docker network create app-network
   ```

4. **Start services:**

   ```bash
   docker-compose up -d
   docker-compose --env-file .env up -d --build
   ```

5. **Verify services are running:**
   ```bash
   docker-compose ps
   docker-compose logs
   ```

## 🗄️ Services

### PostgreSQL

- **Version:** 15-alpine
- **Port:** 5432 (configurable via `DB_PORT`)
- **Database:** `auth_db` (configurable via `DB_NAME`)
- **Extensions:** uuid-ossp, pgcrypto, btree_gist

### Redis

- **Version:** 7-alpine
- **Port:** 6379 (configurable via `REDIS_PORT`)
- **Persistence:** AOF enabled
- **Memory Policy:** allkeys-lru with 256MB limit

## 🔧 Common Operations

### Start services

```bash
docker-compose up -d
```

### Stop services

```bash
docker-compose down
```

### Stop and remove volumes (⚠️ deletes all data)

```bash
docker-compose down -v
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Connect to PostgreSQL

```bash
# Using docker exec
docker exec -it postgres-dev psql -U devuser -d auth_db

# Using psql client (if installed locally)
psql -h localhost -p 5432 -U devuser -d auth_db
```

### Connect to Redis

```bash
# Using docker exec
docker exec -it redis-dev redis-cli -a redis123

# Using redis-cli (if installed locally)
redis-cli -h localhost -p 6379 -a redis123
```

### Restart services

```bash
docker-compose restart postgres
docker-compose restart redis
```

## 📊 Database Management

### Backup PostgreSQL Database

```bash
# Create backup directory
mkdir -p scripts/backup

# Backup database
docker exec postgres-dev pg_dump -U devuser auth_db > scripts/backup/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore PostgreSQL Database

```bash
# Copy backup to container
docker cp scripts/backup/backup.sql postgres-dev:/tmp/

# Restore
docker exec postgres-dev psql -U devuser -d auth_db -f /tmp/backup.sql
```

### Reset Database

```bash
# Stop and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## 🔍 Health Checks

Both services include health checks:

```bash
# Check health status
docker inspect postgres-dev --format='{{.State.Health.Status}}'
docker inspect redis-dev --format='{{.State.Health.Status}}'
```

## 🐛 Troubleshooting

### Services won't start

**Check if network exists:**

```bash
docker network ls | grep app-network
```

**Create network if missing:**

```bash
docker network create app-network
```

### Permission denied on init script

**Make script executable:**

```bash
chmod +x scripts/init-dev-db.sh
```

### Port already in use

**Change ports in `.env`:**

```bash
DB_PORT=5433
REDIS_PORT=6380
```

### View detailed logs

```bash
docker-compose logs --tail=100 postgres
```

### Connection refused

**Verify services are healthy:**

```bash
docker-compose ps
```

**Wait for initialization:**
The init script takes 5-10 seconds to complete.

## 📁 Project Structure

```
database/
├── scripts/
│   ├── init-dev-db.sh      # Database initialization script
│   └── backup/             # Backup directory (gitignored)
├── .dockerignore           # Docker ignore rules
├── .env                    # Environment variables (gitignored)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # This file
```

## 🔐 Security Notes

- **Never commit `.env` file** - it's gitignored
- **Use strong passwords** for production environments
- **Change default credentials** from `.env.example`
- **Limit network exposure** in production (remove port mappings)
- **Enable SSL/TLS** for production PostgreSQL connections

## 🧪 Development Tips

### Execute SQL from file

```bash
docker exec -i postgres-dev psql -U devuser -d auth_db < schema.sql
```

### Monitor Redis

```bash
docker exec -it redis-dev redis-cli -a redis123 MONITOR
```

### View PostgreSQL logs

```bash
docker exec postgres-dev cat /var/lib/postgresql/data/pgdata/pg_log/postgresql-*.log
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/15/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

1. Make changes to configuration files
2. Test with `docker-compose up`
3. Update documentation if needed
4. Submit pull request

## 📄 License

[Your License Here]
