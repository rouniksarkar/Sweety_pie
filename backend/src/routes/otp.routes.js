import express from "express"
const router = express.Router();

// In-memory store for dummy OTPs
const otpStore = {}; // { phoneNumber: otp }

// Send OTP
router.post("/send-otp", (req, res) => {
  const { phone } = req.body;

  // Generate a dummy OTP
  const otp = "123456"; // fixed OTP for testing
  otpStore[phone] = otp;



  res.json({ status: "success", message: "OTP sent (dummy)" });
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] && otpStore[phone] === otp) {
    delete otpStore[phone]; // remove OTP after verification
    res.json({ status: "success", message: "OTP verified" });
  } else {
    res.json({ status: "failed", message: "Invalid OTP" });
  }
});

export default router;
