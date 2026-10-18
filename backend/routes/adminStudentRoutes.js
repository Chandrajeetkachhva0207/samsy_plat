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
    deleteStudentFees,
    deleteFeePayment,
    deleteStudent,
} = require("../controllers/adminStudentController");

const router = express.Router();

// All routes require authenticated admin
router.use(protect, adminOnly);

router.get("/", getAllStudents);
router.get("/:id", getStudentDetails);
router.put("/:id/verify", verifyStudent);
router.put("/:id/profile", updateStudentByAdmin);
router.put("/:id/fees", setStudentFees);
router.delete("/:id/fees", deleteStudentFees);
router.post("/:id/payments", recordFeePayment);
router.delete("/:id/payments/:paymentId", deleteFeePayment);
router.delete("/:id", deleteStudent);

module.exports = router;
