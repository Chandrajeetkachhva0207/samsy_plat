const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    getAllStudents,
    getStudentDetails,
    verifyStudent,
    updateStudentByAdmin,
    setStudentFees,
    recordFeePayment,
} = require("../controllers/adminStudentController");

const router = express.Router();

// All routes require authenticated admin
router.use(protect, adminOnly);

router.get("/", getAllStudents);
router.get("/:id", getStudentDetails);
router.put("/:id/verify", verifyStudent);
router.put("/:id/profile", updateStudentByAdmin);
router.put("/:id/fees", setStudentFees);
router.post("/:id/payments", recordFeePayment);

module.exports = router;
