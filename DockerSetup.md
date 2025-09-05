# Docker Setup Guide

## Simple Todo (Frontend Only)

### Build and Run
1. Build the Docker image:
   ```bash
   docker build -t simple-todo-app ./simple-todo
   ```
2. Run the container:
   ```bash
   docker run -p 5173:5173 simple-todo-app
   ```
3. Access the app at [http://localhost:5173](http://localhost:5173)

### Development Mode
- The container runs Vite in dev mode and listens on port 5173.

---

## Full Stack Todo (React + Express + Postgres)

### Structure
- `client/` - React Vite frontend
- `server/` - Express backend
- `docker-compose.yml` - Orchestrates frontend, backend, and database

### Build and Run All Services
1. From the `todo-fullstack` directory, run:
   ```bash
   docker-compose up --build
   ```
2. Access the frontend at [http://localhost:5173](http://localhost:5173)
3. The backend API is available at [http://localhost:4000/api/todos](http://localhost:4000/api/todos)
4. Postgres runs on port 5432 (internal use)

### Features
- Frontend and backend communicate via REST API
- Todos are stored in Postgres
- Table is auto-created on backend startup
- You can add and delete todos from the UI

---

### Full Stack Todo (docker-compose volume mapping)

You can mount your local `client` and `server` source code for live development using the `volumes` key in `docker-compose.yml`:

```yaml
services:
  client:
    build: ./client
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - server
    environment:
      - VITE_API_URL=http://localhost:4000/api

  server:
    build: ./server
    ports:
      - "4000:4000"
    volumes:
      - ./server:/app
      - /app/node_modules
    environment:
      - PGHOST=postgres
      - PGUSER=postgres
      - PGPASSWORD=postgres
      - PGDATABASE=todo
      - PGPORT=5432
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: todo
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

This setup allows you to edit code in your local `client/src` and `server` folders and see changes reflected in the running containers.

---

**Note:**
- For local development, you can run each service separately if needed.
- Environment variables for database and API URLs are set in `docker-compose.yml`.

---
