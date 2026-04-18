const express = require("express");
const {
  createMedication,
  listMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
  getDailySchedule,
  markMedicationTaken,
} = require("../controllers/medicationController");

const router = express.Router();

router.post("/", createMedication);
router.get("/", listMedications);
router.get("/schedule/:patientId", getDailySchedule);
router.get("/:id", getMedicationById);
router.put("/:id", updateMedication);
router.delete("/:id", deleteMedication);
router.post("/:id/taken", markMedicationTaken);

module.exports = router;
