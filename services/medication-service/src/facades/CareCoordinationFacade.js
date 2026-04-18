const axios = require("axios");

class CareCoordinationFacade {
  constructor() {
    this.userServiceUrl = process.env.USER_SERVICE_URL;
    this.notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL;
  }

  async getPatient(patientId) {
    if (!this.userServiceUrl) {
      throw new Error("USER_SERVICE_URL is not configured");
    }

    const response = await axios.get(
      `${this.userServiceUrl}/api/patients/${patientId}`,
    );
    return response.data;
  }

  async emitMedicationTakenEvent(payload) {
    if (!this.notificationServiceUrl) {
      throw new Error("NOTIFICATION_SERVICE_URL is not configured");
    }

    await axios.post(
      `${this.notificationServiceUrl}/api/events/medication-status-changed`,
      payload,
    );
  }

  async notifyMedicationTaken({
    patientId,
    medicationId,
    medicationName,
    dosage,
    takenAt,
  }) {
    const patient = await this.getPatient(patientId);

    await this.emitMedicationTakenEvent({
      eventType: "MEDICATION_TAKEN",
      patient: {
        id: patient._id,
        fullName: patient.fullName,
        email: patient.email,
      },
      medication: {
        id: medicationId,
        name: medicationName,
        dosage,
      },
      takenAt,
    });
  }
}

module.exports = CareCoordinationFacade;
