const Medication = require("../models/Medication");
const CareCoordinationFacade = require("../facades/CareCoordinationFacade");

const facade = new CareCoordinationFacade();

const createMedication = async (req, res) => {
  try {
    const { patientId, name, dosage, schedule } = req.body;

    if (
      !patientId ||
      !name ||
      !dosage ||
      !Array.isArray(schedule) ||
      schedule.length === 0
    ) {
      return res.status(400).json({
        message:
          "patientId, name, dosage and at least one schedule time are required",
      });
    }

    const medication = await Medication.create({
      patientId,
      name,
      dosage,
      schedule,
    });
    return res.status(201).json(medication);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const listMedications = async (req, res) => {
  try {
    const filter = req.query.patientId
      ? { patientId: req.query.patientId }
      : {};
    const medications = await Medication.find(filter).sort({ createdAt: -1 });
    return res.json(medications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }
    return res.json(medication);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    return res.json(medication);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteMedication = async (req, res) => {
  try {
    const deleted = await Medication.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Medication not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getDailySchedule = async (req, res) => {
  try {
    const { patientId } = req.params;
    const date = req.query.date || new Date().toISOString().split("T")[0];

    const medications = await Medication.find({ patientId });

    const result = medications.map((med) => {
      const todayLog = med.takenLog.find((entry) => entry.date === date);
      return {
        id: med._id,
        patientId: med.patientId,
        name: med.name,
        dosage: med.dosage,
        schedule: med.schedule,
        date,
        taken: todayLog ? todayLog.taken : false,
        takenAt: todayLog ? todayLog.takenAt : null,
      };
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markMedicationTaken = async (req, res) => {
  try {
    const { id } = req.params;
    const date = req.body.date || new Date().toISOString().split("T")[0];
    const takenAt = new Date();

    const medication = await Medication.findById(id);
    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    const logEntry = medication.takenLog.find((entry) => entry.date === date);
    if (logEntry) {
      logEntry.taken = true;
      logEntry.takenAt = takenAt;
    } else {
      medication.takenLog.push({ date, taken: true, takenAt });
    }

    await medication.save();

    await facade.notifyMedicationTaken({
      patientId: medication.patientId,
      medicationId: medication._id,
      medicationName: medication.name,
      dosage: medication.dosage,
      takenAt,
    });

    return res.json({
      message: "Medication marked as taken",
      medication,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMedication,
  listMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
  getDailySchedule,
  markMedicationTaken,
};
