const Patient = require("../models/Patient");
const UserFactory = require("../factories/UserFactory");

const ensurePatientCollection = async () => {
  const collectionName = Patient.collection.collectionName;
  const collectionsCursor = Patient.db.listCollections({
    name: collectionName,
  });
  const collections =
    typeof collectionsCursor.toArray === "function"
      ? await collectionsCursor.toArray()
      : [];
  const collectionExists = collections.length > 0;

  if (!collectionExists) {
    try {
      await Patient.createCollection();
    } catch (error) {
      if (error?.codeName !== "NamespaceExists") {
        throw error;
      }
    }
  }
};

const createPatient = async (req, res) => {
  try {
    await ensurePatientCollection();
    const userData = UserFactory.createUser(req.body);
    const patient = await Patient.create(userData);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listPatients = async (_req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.json(patient);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.json(patient);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
