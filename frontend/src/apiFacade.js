const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || "";
const MEDICATION_SERVICE_URL =
  import.meta.env.VITE_MEDICATION_SERVICE_URL || "";
const NOTIFICATION_SERVICE_URL =
  import.meta.env.VITE_NOTIFICATION_SERVICE_URL || "";

class CarePlatformFacade {
  async parseJsonSafe(response) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  async request(url, options = {}, defaultErrorMessage = "Request failed") {
    const response = await fetch(url, options);
    const data = await this.parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(data.message || defaultErrorMessage);
    }

    return data;
  }

  async listPatients() {
    return this.request(
      `${USER_SERVICE_URL}/api/patients`,
      {},
      "Failed to load patients",
    );
  }

  async addPatient(payload) {
    return this.request(
      `${USER_SERVICE_URL}/api/patients`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      "Failed to create patient",
    );
  }

  async addMedication(payload) {
    return this.request(
      `${MEDICATION_SERVICE_URL}/api/medications`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      "Failed to create medication",
    );
  }

  async getDailySchedule(patientId, date) {
    return this.request(
      `${MEDICATION_SERVICE_URL}/api/medications/schedule/${patientId}?date=${date}`,
      {},
      "Failed to load daily schedule",
    );
  }

  async markMedicationTaken(medicationId, date) {
    return this.request(
      `${MEDICATION_SERVICE_URL}/api/medications/${medicationId}/taken`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      },
      "Failed to mark medication as taken",
    );
  }

  async getNotifications(patientId) {
    return this.request(
      `${NOTIFICATION_SERVICE_URL}/api/events/notifications?patientId=${patientId}`,
      {},
      "Failed to load notifications",
    );
  }
}

export const carePlatformFacade = new CarePlatformFacade();
