const express = require("express");

const {
    getDashboard,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    adminOnly,
    getDashboard
);

router.get(
    "/dashboard-stats",
    protect,
    adminOnly,
    getDashboard
);

module.exports = router;