# Flujo de Aprobaciones — Arquitectura Hexagonal
**Stack:** React (Vite + Tailwind) · Node.js (Express) · PostgreSQL · Docker Compose

## Arquitectura (Backend)
```
backend/src
├─ config/            # Env, configuración
├─ domain/            # Entidades y puertos (interfaces)
├─ application/       # Casos de uso (reglas de negocio)
├─ infrastructure/    # Adaptadores: DB (Postgres), HTTP (Express), Email (Nodemailer)
└─ server.js          # Composición e inicio
```

## Arquitectura (Frontend)
- SPA con Tailwind, layout limpio, componentes reutilizables (cards, badges, tablas, formularios).
- Páginas: Bandeja del aprobador, Mis solicitudes, Crear, Detalle.

## Puesta en marcha con Docker
```bash
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:4000
- DB:       localhost:5432 (user `appuser`, pass `apppass`, db `approvaldb`)

## Local sin Docker
1) PostgreSQL: crear `approvaldb` y ejecutar `db/schema.sql` y `db/seed.sql`.
2) Backend:
```bash
cd backend
cp .env.example .env
npm install
npm start
```
3) Frontend:
```bash
cd frontend
npm install
npm run dev
```

## SMTP opcional (backend/.env)
```
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Aprobaciones <no-reply@demo.local>"
```

## Postman
Importa `postman/FlujoAprobacion.postman_collection.json`.
