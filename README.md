# Sublytic

Subscription-spend analytics for small teams. The repository is intentionally split into two applications:

- `frontend/`: the existing React/TanStack interface.
- `backend/`: the Spring Boot API and Flyway migrations.

## Run the database

```powershell
docker compose up -d postgres
docker compose ps
```

The local database is available at `localhost:5432`, database/user/password: `sublytic`.

## Run the backend

```powershell
cd backend
mvn spring-boot:run
```

Flyway applies `src/main/resources/db/migration/V1__initial_schema.sql` on startup. Hibernate only validates the schema; it never creates or changes production tables.

## Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

Keep `VITE_API_BASE_URL` unset until the first REST endpoints are implemented; the current UI then continues to use its built-in mock data. Copy `.env.example` to `.env.local` when it is time to use the API.
