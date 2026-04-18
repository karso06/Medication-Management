const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI;
  let uriToUse = mongoUri;
  const isProduction = process.env.NODE_ENV === "production";

  if (!uriToUse) {
    if (isProduction) {
      throw new Error(
        "MONGODB_URI is required in production. Configure it in Render environment variables.",
      );
    }
    memoryServer = await MongoMemoryServer.create();
    uriToUse = memoryServer.getUri();
    console.log("Medication Service running with in-memory MongoDB");
  }

  await mongoose.connect(uriToUse, {
    dbName:
      process.env.MONGODB_DB_NAME ||
      process.env.MONGODB_DB ||
      "medication_service",
  });
  console.log("Medication Service connected to MongoDB");
};

module.exports = { connectDb };
