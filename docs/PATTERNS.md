# Design Patterns Implementados

## 1) Factory (Creational)

- **Categoría:** Creacional
- **Ubicación:** `services/user-service/src/factories/UserFactory.js`
- **Qué hace:** Crea usuarios en función de `role` (`patient` o `caregiver`) y centraliza la validación del tipo.
- **Por qué se usó:** Evita lógica de creación dispersa en controladores y facilita agregar nuevos tipos de usuario sin romper rutas existentes.

## 2) Facade (Structural)

- **Categoría:** Estructural
- **Ubicación:** `services/medication-service/src/facades/CareCoordinationFacade.js`
- **Qué hace:** Oculta la complejidad de orquestar llamadas a `user-service` y `notification-service` desde `medication-service`.
- **Por qué se usó:** El controlador de medicación solo llama a una API simple (`notifyMedicationTaken`) y no conoce detalles de URLs, payloads ni secuencia de integración.

## 3) Observer (Behavioral)

- **Categoría:** Comportamiento
- **Ubicación:**
  - `services/notification-service/src/observer/Subject.js`
  - `services/notification-service/src/observer/InAppNotificationObserver.js`
  - `services/notification-service/src/observer/ConsoleNotificationObserver.js`
- **Qué hace:** Cuando llega el evento `MEDICATION_TAKEN`, el `Subject` notifica a múltiples observadores.
- **Por qué se usó:** Permite agregar nuevos canales de notificación (email, SMS, push) sin modificar el flujo central de eventos.

## Justificación académica y técnica

- **Problema real resuelto por Factory:** reglas de creación consistentes y extensión de tipos.
- **Problema real resuelto por Facade:** acoplamiento alto entre servicios y controladores.
- **Problema real resuelto por Observer:** escalabilidad de notificaciones multicanal y bajo acoplamiento.

## Trade-offs

- Factory agrega una capa extra (ligera) pero mejora mantenibilidad.
- Facade puede ocultar demasiado si crece sin límites; se mitiga separando métodos por caso de uso.
- Observer en memoria no garantiza entrega duradera; se acepta para prototipo académico y se documenta migración futura a broker.

## Alternativas evaluadas

- **Sin Factory:** creación directa en controller (rechazada por duplicación).
- **Sin Facade:** llamadas HTTP directas en cada endpoint (rechazada por alto acoplamiento).
- **Sin Observer:** lógica if/else por canal de notificación (rechazada por dificultad de escalar).
