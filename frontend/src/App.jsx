import React, { useEffect, useMemo, useState } from "react";
import { carePlatformFacade } from "./apiFacade";

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [scheduleDate, setScheduleDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [schedule, setSchedule] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const [patientForm, setPatientForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "patient",
  });

  const [medForm, setMedForm] = useState({
    patientId: "",
    name: "",
    dosage: "",
    schedule: "08:00,20:00",
  });

  const safePatients = Array.isArray(patients) ? patients : [];
  const safeSchedule = Array.isArray(schedule) ? schedule : [];
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const selectedPatient = useMemo(
    () => safePatients.find((p) => p._id === selectedPatientId),
    [safePatients, selectedPatientId],
  );

  const loadPatients = async () => {
    const data = await carePlatformFacade.listPatients();
    if (!Array.isArray(data)) {
      setPatients([]);
      setError("User service did not return a valid patients list.");
      return;
    }

    setPatients(data);
    if (!selectedPatientId && data.length > 0) {
      setSelectedPatientId(data[0]._id);
      setMedForm((prev) => ({ ...prev, patientId: data[0]._id }));
    }
  };

  const loadSchedule = async () => {
    if (!selectedPatientId) {
      setSchedule([]);
      return;
    }
    const data = await carePlatformFacade.getDailySchedule(
      selectedPatientId,
      scheduleDate,
    );
    setSchedule(Array.isArray(data) ? data : []);
  };

  const loadNotifications = async () => {
    if (!selectedPatientId) {
      setNotifications([]);
      return;
    }
    const data = await carePlatformFacade.getNotifications(selectedPatientId);
    setNotifications(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    (async () => {
      try {
        await loadPatients();
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await loadSchedule();
        await loadNotifications();
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [selectedPatientId, scheduleDate]);

  const handleAddPatient = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await carePlatformFacade.addPatient(patientForm);
      setPatientForm({ fullName: "", email: "", phone: "", role: "patient" });
      await loadPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMedication = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        ...medForm,
        schedule: medForm.schedule
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      };
      await carePlatformFacade.addMedication(payload);
      setMedForm((prev) => ({
        ...prev,
        name: "",
        dosage: "",
        schedule: "08:00,20:00",
      }));
      await loadSchedule();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkTaken = async (medicationId) => {
    setError("");
    try {
      await carePlatformFacade.markMedicationTaken(medicationId, scheduleDate);
      await loadSchedule();
      await loadNotifications();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <header className="hero">
        <h1>Medication Management for Caregivers</h1>
        <p className="subtitle">
          Organiza pacientes, medicamentos y seguimiento diario en una sola
          vista.
        </p>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="card">
        <h2>1) Add Patient</h2>
        <form onSubmit={handleAddPatient}>
          <div className="grid">
            <input
              required
              placeholder="Full name"
              value={patientForm.fullName}
              onChange={(e) =>
                setPatientForm((p) => ({ ...p, fullName: e.target.value }))
              }
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={patientForm.email}
              onChange={(e) =>
                setPatientForm((p) => ({ ...p, email: e.target.value }))
              }
            />
            <input
              placeholder="Phone"
              value={patientForm.phone}
              onChange={(e) =>
                setPatientForm((p) => ({ ...p, phone: e.target.value }))
              }
            />
            <select
              value={patientForm.role}
              onChange={(e) =>
                setPatientForm((p) => ({ ...p, role: e.target.value }))
              }
            >
              <option value="patient">Patient</option>
              <option value="caregiver">Caregiver</option>
            </select>
          </div>
          <button type="submit">Create patient</button>
        </form>
      </section>

      <section className="card">
        <h2>2) Add Medication</h2>
        <form onSubmit={handleAddMedication}>
          <div className="grid">
            <select
              required
              value={medForm.patientId}
              onChange={(e) => {
                setMedForm((p) => ({ ...p, patientId: e.target.value }));
                setSelectedPatientId(e.target.value);
              }}
            >
              <option value="">Select patient</option>
              {safePatients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.fullName}
                </option>
              ))}
            </select>
            <input
              required
              placeholder="Medication name"
              value={medForm.name}
              onChange={(e) =>
                setMedForm((p) => ({ ...p, name: e.target.value }))
              }
            />
            <input
              required
              placeholder="Dosage (e.g. 1 pill)"
              value={medForm.dosage}
              onChange={(e) =>
                setMedForm((p) => ({ ...p, dosage: e.target.value }))
              }
            />
            <input
              required
              placeholder="Schedule (comma-separated HH:mm)"
              value={medForm.schedule}
              onChange={(e) =>
                setMedForm((p) => ({ ...p, schedule: e.target.value }))
              }
            />
          </div>
          <button type="submit">Create medication</button>
        </form>
      </section>

      <section className="card">
        <h2>3) Daily Schedule</h2>
        <div className="toolbar">
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              setMedForm((prev) => ({ ...prev, patientId: e.target.value }));
            }}
          >
            <option value="">Select patient</option>
            {safePatients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.fullName}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
          {selectedPatient ? <strong>{selectedPatient.fullName}</strong> : null}
        </div>

        {safeSchedule.length === 0 ? (
          <p>No medications for this patient/date.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Dosage</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {safeSchedule.map((med) => (
                <tr key={med.id}>
                  <td>{med?.name || "N/A"}</td>
                  <td>{med?.dosage || "N/A"}</td>
                  <td>
                    {Array.isArray(med?.schedule)
                      ? med.schedule.join(", ")
                      : "No schedule"}
                  </td>
                  <td>
                    <span
                      className={`status-pill ${med.taken ? "taken" : "pending"}`}
                    >
                      {med.taken ? "Taken" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <button
                      disabled={med.taken}
                      onClick={() => med?.id && handleMarkTaken(med.id)}
                    >
                      Mark as taken
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <h2>4) Notification Stream (Observer)</h2>
        {safeNotifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <ul className="notification-list">
            {safeNotifications.map((item) => (
              <li key={item._id}>
                {item.message} — {new Date(item.takenAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
