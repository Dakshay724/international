const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    DOB: Date,
    hobbies: [],
    projects: [],
    email: { type: String, unique: true, required: true },
    password: String,
    profilePicture: String,
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
