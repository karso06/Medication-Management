# Guion de Demo en Vivo (8-10 min)

1. **Abrir frontend en URL pública**
   - Mostrar dashboard y secciones.

2. **Crear paciente**
   - Completar formulario Add Patient.
   - Ver nuevo paciente en selector.

3. **Crear medicamento**
   - Seleccionar paciente.
   - Ingresar nombre, dosis y horario.
   - Confirmar que aparece en agenda.

4. **Mostrar agenda diaria**
   - Cambiar fecha y paciente.
   - Ver estado `Pending`.

5. **Marcar medicamento como tomado**
   - Click en `Mark as taken`.
   - Ver cambio a estado `Taken`.

6. **Mostrar Observer en acción**
   - Ir al bloque de Notification Stream.
   - Ver nuevo mensaje generado por evento.

7. **Mostrar APIs en producción (rápido)**
   - `GET /health` en cada microservicio.
   - `GET /api/events/notifications?patientId=...`

8. **Cierre técnico**
   - Señalar patrones implementados.
   - Señalar trade-offs y siguiente evolución.
