class ConsoleNotificationObserver {
  async update(eventPayload) {
    const logLine = `[Notification Event] ${eventPayload.eventType} | patient=${eventPayload.patient.fullName} | medication=${eventPayload.medication.name} | takenAt=${eventPayload.takenAt}`;
    console.log(logLine);
  }
}

module.exports = ConsoleNotificationObserver;
