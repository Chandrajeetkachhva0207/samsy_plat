
const express = require("express");

const {
    createContactMessage,
    getContactMessages,
    updateContactMessage,
    deleteContactMessage,
} = require("../controllers/contactMessageController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const validateRequest = require("../middleware/validationMiddleware");

const { body } = require("express-validator");

const router = express.Router();

/*
=====================================================
PUBLIC - SUBMIT CONTACT FORM
=====================================================
*/

router.post(
    "/",

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name is too long"),

    body("mobile")
        .trim()
        .notEmpty()
        .withMessage("Mobile number is required")
        .matches(/^[0-9]{10}$/)
        .withMessage("Enter a valid 10-digit mobile number"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email address"),

    body("subject")
        .trim()
        .notEmpty()
        .withMessage("Subject is required")
        .isLength({ max: 200 })
        .withMessage("Subject is too long"),

    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ max: 2000 })
        .withMessage("Message is too long"),

    validateRequest,

    createContactMessage
);


/*
=====================================================
ADMIN - GET ALL MESSAGES
=====================================================
*/

router.get(
    "/",
    protect,
    adminOnly,
    getContactMessages
);


/*
=====================================================
ADMIN - UPDATE MESSAGE
=====================================================
*/

router.put(
    "/:id",
    protect,
    adminOnly,
    updateContactMessage
);


/*
=====================================================
ADMIN - DELETE MESSAGE
=====================================================
*/

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteContactMessage
);


module.exports = router;