const express = require("express");
const cors = require("cors");
const medicationRoutes = require("./routes/medicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "medication-service" });
});

app.use("/api/medications", medicationRoutes);

module.exports = app;
