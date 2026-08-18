# Docker Setup

This project uses Docker to containerize both the Kanban API (backend) and the Kanban Board (frontend), and Docker Compose to orchestrate them along with a MongoDB database for local development and testing.

## Local Development with Docker

You can spin up the entire application stack without manually installing Node.js dependencies, running local dev servers, or setting up a local MongoDB instance.

### Prerequisites
- Docker Desktop (or Docker Engine + Docker Compose plugin)

### Running the Stack
1. Ensure the Docker daemon is running.
2. In the root directory of this repository, run:
   ```bash
   docker compose up --build -d
   ```
3. The stack will build the frontend and backend images and pull the `mongo` image.
4. Access the applications:
   - **Kanban Board (Frontend):** http://localhost:8080
   - **Kanban API (Backend):** http://localhost:3001
   - **MongoDB Database:** `mongodb://localhost:27017`

### Shutting Down
To stop and remove the containers, run:
```bash
docker compose down
```

To remove the database volumes as well, run:
```bash
docker compose down -v
```

## Production Deployment Mapping

The Docker setup provided maps well to a real-world production deployment strategy:

1. **Images:** The multi-stage `Dockerfile` configurations ensure that final images are as lightweight as possible. The `node:alpine` and `nginx:alpine` images strip out unnecessary build tools (like `node_modules` in the frontend and development dependencies).
2. **Container Registry:** Instead of building locally, CI/CD pipelines (e.g. GitHub Actions) would build these exact images and push them to a Container Registry like Docker Hub, AWS ECR, or GitHub Container Registry (GHCR).
3. **Container Platform:** The built images can be pulled and run on any container orchestration platform:
   - Managed Services: AWS ECS, Google Cloud Run, Azure Container Apps.
   - Kubernetes: The `docker-compose.yml` can be translated to Kubernetes Deployments, Services, and Ingresses.
4. **Environment Variables:** In production, sensitive variables like `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `MONGODB_URI` would be injected via the platform's secret manager instead of hardcoded or placed in a `.env` file.
