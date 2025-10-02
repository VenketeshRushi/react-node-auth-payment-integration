````markdown
## Commands

1. **Create or Delete the network:**

```bash
docker network rm app-network || true
docker network create app-network
```
````

2. **Start services:**

```bash
docker-compose --env-file .env up -d --build
```

3. **Verify services are running:**

```bash
docker-compose ps
docker-compose logs -f
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f bullmq-board
```

4. **Restart services:**

```bash
docker-compose restart postgres
docker-compose restart redis
docker-compose restart bullmq-board
```

5. **Stop services:**

```bash
docker-compose down
```

6. **Stop and remove volumes (⚠️ deletes all data):**

```bash
docker-compose down -v
```

7. **Stop individual services (optional):**

```bash
docker-compose stop postgres
docker-compose stop redis
docker-compose stop bullmq-board
```

8. **Access BullMQ Board:**

Open in browser: [http://localhost:3001](http://localhost:3001)

9. **Check BullMQ queue metrics:**

```bash
curl http://localhost:3000/api/monitoring/queue/metrics
```
