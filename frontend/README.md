# Sublytic Frontend

Sublytic is a subscription-spend analytics application for individuals and small teams. This directory contains the React/TanStack frontend for the product.

## Technology

- React
- TypeScript
- TanStack Start and TanStack Router
- Tailwind CSS
- TanStack Query
- Recharts

## Local development

From this directory, install dependencies and start the development server:

```powershell
npm install
npm run dev
```

The UI currently falls back to local mock data when `VITE_API_BASE_URL` is not set. To use the Spring Boot API, copy `.env.example` to `.env.local` and set:

```text
VITE_API_BASE_URL=http://localhost:8080
```

The REST calls are kept in `src/lib/api.ts`. This keeps the pages and components independent from the API transport and makes the mock-to-backend transition explicit.

## Available scripts

```powershell
npm run dev       # Start the development server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm test          # Run the test suite
```
