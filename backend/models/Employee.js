const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  joiningDate: { type: Date, required: true },
  salary: { type: Number, required: true, min: 0 },
  address: { type: String, default: "", trim: true },
  photo: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
