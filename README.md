# 🚀 Flujo Genérico de Aprobaciones — Banco de Bogotá
 
Aplicación **Fullstack** que implementa un flujo genérico de aprobaciones internas.  
Desarrollada con **React + Tailwind** en el frontend, **Node.js + Express** en el backend y **PostgreSQL** como base de datos.  
La arquitectura del backend sigue el patrón **Hexagonal (Ports & Adapters)** para garantizar mantenibilidad, escalabilidad y separación de responsabilidades.
 
---
 
## 📐 Arquitectura
 
### Backend (Hexagonal)
backend/src
├── config/ # Variables de entorno y configuración
├── domain/ # Entidades y puertos (interfaces)
├── application/ # Casos de uso (reglas de negocio)
├── infrastructure/ # Adaptadores (DB Postgres, Email, HTTP Express)
└── server.js # Composición e inicio

### Frontend (React + Tailwind)
frontend/src
├── assets/ # Logo e imágenes
├── lib/ # Cliente API (fetch)
├── styles/ # Tailwind y estilos globales
├── views/ # Vistas principales (App.jsx)
└── widgets/ # Componentes reutilizables (Inbox, CreateRequest, etc.)
 
---
 
## ⚙️ Funcionalidades
 
- ✅ Creación de solicitudes con título, descripción, solicitante, aprobador y tipo.  
- ✅ Notificación al aprobador (bandeja in-app).  
- ✅ Paneles separados: **Bandeja del aprobador**, **Mis solicitudes**, **Detalle**.  
- ✅ Histórico con trazabilidad (acciones, comentarios, usuario, fecha).  
- ✅ IDs únicos con UUID.  
- ✅ Docker Compose para orquestar base de datos, backend y frontend.  
 
---
 
## 🛠️ Tecnologías
- **Frontend**: React 18, Vite, TailwindCSS  
- **Backend**: Node.js 18, Express, Nodemailer, UUID  
- **Base de Datos**: PostgreSQL  
- **Infraestructura**: Docker Compose
   
---
 
## 🚀 Instalación y Ejecución
 
### Con Docker (recomendado)
```bash
docker compose up --build
Frontend: http://localhost:5173
 
Backend: http://localhost:4000
