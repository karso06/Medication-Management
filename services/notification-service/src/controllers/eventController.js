const Notification = require("../models/Notification");
const NotificationEventService = require("../services/NotificationEventService");

const notificationEventService = new NotificationEventService();

const medicationStatusChanged = async (req, res) => {
  try {
    const payload = req.body;

    if (
      !payload?.eventType ||
      !payload?.patient?.id ||
      !payload?.medication?.id
    ) {
      return res.status(400).json({
        message: "Invalid event payload",
      });
    }

    await notificationEventService.processMedicationStatusChanged(payload);

    return res.status(202).json({
      message: "Event accepted",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const listNotifications = async (req, res) => {
  try {
    const filter = req.query.patientId
      ? { patientId: req.query.patientId }
      : {};
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  medicationStatusChanged,
  listNotifications,
};
