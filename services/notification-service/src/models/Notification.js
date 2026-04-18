const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true },
    patientId: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    medicationId: { type: String, required: true },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    message: { type: String, required: true },
    takenAt: { type: Date, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
