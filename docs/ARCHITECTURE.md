# Arquitectura del Sistema

## Resumen

Sistema distribuido con 3 microservicios Node.js + Express, frontend React y MongoDB Atlas.

- `user-service`: gestión de pacientes/cuidadores
- `medication-service`: gestión de medicamentos y agenda diaria
- `notification-service`: procesamiento de eventos y notificaciones
- Frontend React: interfaz de operación para el cuidador

## Diagrama de Arquitectura (Mermaid)

```mermaid
flowchart LR
    FE[Frontend React en Vercel] --> US[User Service en Render]
    FE --> MS[Medication Service en Render]
    FE --> NS[Notification Service en Render]

    US --> MDB[(MongoDB Atlas)]
    MS --> MDB
    NS --> MDB

    MS -- Evento MEDICATION_TAKEN --> NS
```

## Diagrama de Clases (Mermaid)

```mermaid
classDiagram
    class UserFactory {
      +createUser(payload)
    }

    class CareCoordinationFacade {
      +getPatient(patientId)
      +emitMedicationTakenEvent(payload)
      +notifyMedicationTaken(data)
    }

    class Subject {
      -observers[]
      +subscribe(observer)
      +unsubscribe(observer)
      +notify(eventPayload)
    }

    class InAppNotificationObserver {
      +update(eventPayload)
    }

    class ConsoleNotificationObserver {
      +update(eventPayload)
    }

    Subject --> InAppNotificationObserver
    Subject --> ConsoleNotificationObserver
```

## Diagrama de Secuencia (Flujo de Notificación)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant MS as Medication Service
    participant US as User Service
    participant FAC as CareCoordinationFacade
    participant NS as Notification Service
    participant OBS as Observer Subject

    FE->>MS: POST /api/medications/{id}/taken
    MS->>FAC: notifyMedicationTaken(...)
    FAC->>US: GET /api/patients/{patientId}
    US-->>FAC: patient data
    FAC->>NS: POST /api/events/medication-status-changed
    NS->>OBS: notify(event)
    OBS->>OBS: InAppNotificationObserver.update()
    OBS->>OBS: ConsoleNotificationObserver.update()
    NS-->>FAC: 202 Accepted
    FAC-->>MS: done
    MS-->>FE: medication marked as taken
```

## Decisiones de Arquitectura

1. **Microservicios**: separan dominios (`usuarios`, `medicación`, `notificaciones`) y simplifican despliegue independiente.
2. **REST + eventos**: REST para CRUD síncrono; evento para reacción desacoplada en notificaciones.
3. **MongoDB Atlas**: bajo costo, esquema flexible y rápido para prototipo.

## Trade-offs

- Mayor complejidad operativa vs monolito.
- Comunicación HTTP entre servicios añade latencia, pero mejora separación de responsabilidades.
- Eventing sin broker es simple y barato, pero no duradero ante caídas.

## Evolución recomendada

- Incorporar broker (RabbitMQ/Kafka/SQS) para entrega garantizada.
- Añadir auth (JWT + API Gateway).
- Trazabilidad distribuida (OpenTelemetry).
