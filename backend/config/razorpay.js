const Razorpay = require("razorpay");

let razorpayInstance = null;

const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret || key_id.includes("placeholder")) {
        console.warn(
            "Razorpay credentials are not configured or using placeholders. Payments will operate in simulated test/mock mode if keys are invalid."
        );
    }

    if (!razorpayInstance && key_id && key_secret) {
        try {
            razorpayInstance = new Razorpay({
                key_id: key_id,
                key_secret: key_secret,
            });
        } catch (err) {
            console.error("Error initializing Razorpay SDK:", err.message);
        }
    }

    return razorpayInstance;
};

module.exports = { getRazorpayInstance };
