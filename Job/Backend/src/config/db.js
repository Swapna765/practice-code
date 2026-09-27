const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

async function connectToDB() {

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);   
  }
}

module.exports = connectToDB;