require("dotenv").config();
const app = require("./app");
const { connectDb } = require("./config/db");

const port = process.env.PORT || 4002;

const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Medication Service listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start medication service:", error.message);
    process.exit(1);
  }
};

start();
