require("dotenv").config();
const app = require("./app");
const { connectDb } = require("./config/db");

const port = process.env.PORT || 4001;

const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`User Service listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start user service:", error.message);
    process.exit(1);
  }
};

start();
