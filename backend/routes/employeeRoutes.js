const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee
} = require("../controllers/employeeController");

router.use(protect);
router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", adminOnly, upload.single("photo"), createEmployee);
router.put("/:id", upload.single("photo"), updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
