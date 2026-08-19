import React, { useState } from "react";
import axios from "axios";

const OTPTest = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    const res = await axios.post("/api/v1/otp/send-otp", { phone });
    setMessage(res.data.message);
  };

  const verifyOtp = async () => {
    const res = await axios.post("/api/v1/otp/verify-otp", { phone, otp });
    setMessage(res.data.message);
  };

  return (
    <div>
      <h2>OTP Test</h2>
      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendOtp}>Send OTP</button>

      <br />
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify OTP</button>

      <p>{message}</p>
    </div>
  );
};

export default OTPTest;
