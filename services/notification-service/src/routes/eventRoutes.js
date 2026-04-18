const express = require("express");
const {
  medicationStatusChanged,
  listNotifications,
} = require("../controllers/eventController");

const router = express.Router();

router.post("/medication-status-changed", medicationStatusChanged);
router.get("/notifications", listNotifications);

module.exports = router;
