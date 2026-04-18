# Medication Management Web Application (Microservices)

Aplicación web para cuidadores, orientada a la gestión de medicación diaria de pacientes.

## Funcionalidades

- Alta de pacientes
- Alta de medicamentos (nombre, dosis, horario)
- Vista de agenda diaria por paciente
- Simulación de notificaciones basada en eventos
- Marcado de medicamento como tomado

## Arquitectura

- Frontend: React + Vite
- Backend: Node.js + Express (3 microservicios)
  - `user-service`
  - `medication-service`
  - `notification-service`
- Base de datos: MongoDB Atlas (free tier)
- Comunicación:
  - REST para CRUD
  - Event-driven por HTTP para `MEDICATION_TAKEN`

Más detalle en:

- `docs/ARCHITECTURE.md`
- `docs/PATTERNS.md`

## URLs públicas de despliegue (objetivo)

> Si Render/Vercel cambia el slug, actualiza estas URLs en este README.

- Frontend (Vercel): `https://medication-management-care.vercel.app`
- User Service: `https://medication-user-service.onrender.com`
- Medication Service: `https://medication-medication-service.onrender.com`
- Notification Service: `https://medication-notification-service.onrender.com`

Endpoints de salud:

- `GET https://medication-user-service.onrender.com/health`
- `GET https://medication-medication-service.onrender.com/health`
- `GET https://medication-notification-service.onrender.com/health`

## Estructura del repositorio

```text
project/
├── README.md
├── docs/
│   ├── PATTERNS.md
│   ├── ARCHITECTURE.md
│   ├── PRESENTATION.md
│   └── DEMO_SCRIPT.md
├── services/
│   ├── user-service/
│   ├── medication-service/
│   └── notification-service/
├── frontend/
└── deployment/
```

## Patrones implementados

1. **Factory (Creational)**
   - `services/user-service/src/factories/UserFactory.js`
2. **Facade (Structural)**
   - `services/medication-service/src/facades/CareCoordinationFacade.js`
3. **Observer (Behavioral)**
   - `services/notification-service/src/observer/*`

## Ejecución local

### Prerrequisitos

- Node.js 20+
- Cuenta MongoDB Atlas (cluster free)

### 1) Variables de entorno

Copia `.env.example` a `.env` en cada servicio y en frontend.

Servicios:

- `services/user-service/.env`
- `services/medication-service/.env`
- `services/notification-service/.env`

Frontend:

- `frontend/.env`

### 2) Instalar dependencias

En cada carpeta:

- `services/user-service`
- `services/medication-service`
- `services/notification-service`
- `frontend`

Ejecuta `npm install`.

### 3) Levantar servicios

Inicia cada uno:

- User Service: `npm run dev` (puerto 4001)
- Medication Service: `npm run dev` (puerto 4002)
- Notification Service: `npm run dev` (puerto 4003)
- Frontend: `npm run dev` (puerto 5173)

## Despliegue en producción (sin localhost)

## A. Backend en Render

1. Subir repositorio a GitHub.
2. En Render: **New +** → **Blueprint**.
3. Seleccionar repo y usar `deployment/render.yaml`.
4. Configurar variables secretas:
   - `MONGODB_URI` (en los 3 servicios)
   - `USER_SERVICE_URL` en medication-service (URL pública del user-service)
   - `NOTIFICATION_SERVICE_URL` en medication-service (URL pública del notification-service)
5. Deploy y verificar:
   - `/health` de cada servicio en URL pública.

## B. Frontend en Vercel

1. Importar el repo en Vercel.
2. Root directory: `frontend`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Configurar variables:
   - `VITE_USER_SERVICE_URL`
   - `VITE_MEDICATION_SERVICE_URL`
   - `VITE_NOTIFICATION_SERVICE_URL`
     (todas apuntando a URLs públicas de Render)
6. Deploy y validar flujo completo desde URL pública.

## Pruebas funcionales mínimas

1. Crear paciente en UI.
2. Crear medicamento asociado.
3. Consultar agenda diaria.
4. Marcar como tomado.
5. Verificar notificación en stream.

## Justificación arquitectónica y trade-offs

- Separación por dominio reduce acoplamiento y mejora escalabilidad.
- Uso de eventos desacopla escritura de medicación y manejo de notificaciones.
- Trade-off: más complejidad operativa (3 servicios + frontend).
- Alternativa rechazada: monolito, por menor claridad para demostrar patrones y responsabilidades.

## Costos (estimación mensual)

- MongoDB Atlas M0: **$0**
- Render (3 servicios Free): **$0**
- Vercel Hobby: **$0**
- **Total estimado:** **$0/mes** (muy por debajo del límite de $75/mes)

## Seguridad y producción (siguiente iteración)

- Agregar autenticación JWT + control de acceso por rol.
- Validación de payloads con `zod`/`joi`.
- Observabilidad (logs estructurados + tracing).
- Cola durable para eventos (RabbitMQ/Kafka/SQS).
