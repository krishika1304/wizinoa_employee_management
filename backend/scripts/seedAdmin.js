require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists:", email);
    } else {
      const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@12345", 12);
      await User.create({
        name: process.env.ADMIN_NAME || "System Admin",
        email, password, role: "admin"
      });
      console.log("Admin created:", email);
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
