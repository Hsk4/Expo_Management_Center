# Expo Management Center

A full-stack Event Expo Management System with automated CI/CD pipeline using GitHub Actions and Docker.

---

## Tech Stack

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + Express.js + MongoDB
- **DevOps:** Docker, Docker Compose, GitHub Actions

---

## CI/CD Pipeline

Every push to `master` automatically:
1. Triggers GitHub Actions
2. Builds backend Docker image
3. Builds frontend Docker image
4. Pushes both images to Docker Hub

![Pipeline](pipeline.jpg)

---

## Docker Images

| Service | Image |
|---|---|
| Backend | `farhan249/expo-backend:latest` |
| Frontend | `farhan249/expo-frontend:latest` |

🐳 [View on Docker Hub](https://hub.docker.com/u/farhan249)

---

## Run Locally

Make sure Docker and Docker Compose are installed.
```bash
docker pull farhan249/expo-backend:latest
docker pull farhan249/expo-frontend:latest
docker compose up
```

App will be live at **http://localhost:80**

---

## Production Readiness & Secrets

- Never commit real `.env` files or credentials.
- Use `Server/.env.example` and `Client/.env.example` as templates.
- Rotate any credential that was ever exposed in logs, screenshots, terminal output, or commits.

### Backend Required Environment Variables

- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `CLIENT_URL`
- `CORS_ORIGINS` (comma-separated allowlist)

Email credentials are optional and only required for transactional emails:

- `EMAIL_USER`
- `CLIENT_ID`
- `CLIENT_SECRET`
- `REFRESH_TOKEN`

### Frontend Environment Variable

- `VITE_API_URL` (example: `https://api.yourdomain.com/api` or `/api` behind reverse proxy)

### Quick Setup

```bash
cp Server/.env.example Server/.env
cp Client/.env.example Client/.env
```

---

## Project Structure
```
├── Client/          # React frontend
├── Server/          # Node.js backend
├── Dockerfile       # Backend container
├── Client/Dockerfile # Frontend container
├── docker-compose.yml
└── .github/workflows/deploy.yaml
```
