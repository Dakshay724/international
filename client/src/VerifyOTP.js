import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const { email } = useParams();

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        "http://localhost:9000/api/verifyOTP",
        {
          email,
          otp,
        }
      );

      if (response.status === 200) {
        navigate("/");
        console.log("OTP verified successfully");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="OtpSubmission">
      <h2>Enter OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={4}
          minLength={4}
          pattern="[0-9]{4}"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default VerifyOTP;
