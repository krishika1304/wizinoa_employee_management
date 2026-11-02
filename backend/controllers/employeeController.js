const Employee = require("../models/Employee");

const publicEmployee = (employee) => ({
  ...employee.toObject(),
  photoUrl: employee.photo ? `${process.env.API_BASE_URL || "http://localhost:5000"}/uploads/${employee.photo}` : ""
});

exports.listEmployees = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 50);
    const search = String(req.query.search || "").trim();
    const filter = search ? {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    } : {};

    const [employees, total] = await Promise.all([
      Employee.find(filter).populate("createdBy", "name email")
        .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Employee.countDocuments(filter)
    ]);

    res.json({
      employees: employees.map(publicEmployee),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) { next(error); }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("createdBy", "name email");
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ employee: publicEmployee(employee) });
  } catch (error) { next(error); }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const { employeeId, fullName, email, phone, department, designation, joiningDate, salary, address } = req.body;
    const required = { employeeId, fullName, email, phone, department, designation, joiningDate, salary };
    const missing = Object.entries(required).filter(([, value]) => value === undefined || value === "").map(([key]) => key);
    if (missing.length) return res.status(400).json({ message: `Required fields missing: ${missing.join(", ")}` });

    const employee = await Employee.create({
      employeeId, fullName, email, phone, department, designation,
      joiningDate, salary: Number(salary), address,
      photo: req.file?.filename || "",
      createdBy: req.user._id
    });
    res.status(201).json({ message: "Employee created successfully", employee: publicEmployee(employee) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Employee ID already exists" });
    next(error);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const allowed = ["employeeId", "fullName", "email", "phone", "department", "designation", "joiningDate", "salary", "address"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = key === "salary" ? Number(req.body[key]) : req.body[key];
    });
    if (req.file) updates.photo = req.file.filename;

    const employee = await Employee.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true
    }).populate("createdBy", "name email");

    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee updated successfully", employee: publicEmployee(employee) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Employee ID already exists" });
    next(error);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) { next(error); }
};
