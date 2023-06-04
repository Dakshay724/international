const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiryTime: String,
});

const OTP = mongoose.model("otp", otpSchema);
module.exports = OTP;
