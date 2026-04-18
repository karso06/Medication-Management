const Notification = require("../models/Notification");

class InAppNotificationObserver {
  async update(eventPayload) {
    const message = `Medication ${eventPayload.medication.name} (${eventPayload.medication.dosage}) marked as taken by ${eventPayload.patient.fullName}`;

    await Notification.create({
      eventType: eventPayload.eventType,
      patientId: eventPayload.patient.id,
      patientName: eventPayload.patient.fullName,
      medicationId: eventPayload.medication.id,
      medicationName: eventPayload.medication.name,
      dosage: eventPayload.medication.dosage,
      message,
      takenAt: eventPayload.takenAt,
    });
  }
}

module.exports = InAppNotificationObserver;
