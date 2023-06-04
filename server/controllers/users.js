const User = require("../models/users");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../services/email");
const OTP = require("../models/otp");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");
const PDFDocument = require("pdfkit");
const XLSX = require("xlsx");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, DOB, hobbies, projects, email, password } =
      req.body;
    const Email = email.toLowerCase();
    const isExisting = await User.findOne({
      isEmailVerified: true,
      email: Email,
    });
    const isUnverified = await User.findOne({
      isEmailVerified: false,
      email: Email,
    });

    if (isExisting) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "this email is alredy taken",
      });
    } else if (isUnverified) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "your email not verified please verify",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        firstName,
        lastName,
        DOB,
        hobbies,
        projects,
        email: Email,
        password: hashPassword,
        profilePicture: req.file ? req.file.filename : null,
      });
      await newUser.save();
      const userName = `${firstName} ${lastName}`;
      const otp = Math.floor(1000 + Math.random() * 9000);
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 10);
      const createdOTP = new OTP({
        email: Email,
        otp: otp,
        expiryTime: expiryTime,
      });
      await createdOTP.save();
      await sendEmail(email, userName, otp);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "otp send on email please verify",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: " something went wrong",
      error: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (email) {
      if (otp != "") {
        const timeLimit = 10 * 60 * 1000;
        const otpDocument = await OTP.findOne({
          email: email.toLowerCase(),
          otp: otp,
        });
        if (!otpDocument) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: "Invalid OTP",
          });
        } else {
          const currentTime = new Date().getTime();
          const expiryTime = new Date(otpDocument.expiryTime).getTime();

          if (currentTime - expiryTime > timeLimit) {
            await OTP.deleteMany({ email: email.toLowerCase(), otp: otp });
            return res.status(400).json({
              status: 400,
              success: false,
              message: "OTP has expired",
            });
          } else {
            await User.findOneAndUpdate(
              { email: email.toLowerCase() },
              { isEmailVerified: true },
              { new: true }
            );
            await OTP.deleteOne({ email: email.toLowerCase(), otp: otp });
            return res.status(200).json({
              status: 200,
              success: true,
              message: "your account is successfully verified",
            });
          }
        }
      } else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "please enter valid otp",
        });
      }
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "please provide an email id ",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: " something went wrong",
      error: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email !== undefined && email !== "") {
      const emailId = email.toLowerCase();
      if (!email || !password) {
        return res.status(400).send({
          success: false,
          message: "Please enter both email and password",
        });
      }

      let user = await User.findOne({
        isEmailVerified: true,
        email: emailId,
      });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "user with this email not found",
        });
      }

      const hashPassword = user.password;
      const compare = await bcrypt.compare(password, hashPassword);
      if (!compare) {
        return res.status(401).send({
          status: 401,
          success: false,
          message: "Incorrect password",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: email,
        },
        process.env.JWTSECRETKEY,
        { expiresIn: "7d" }
      );
      user.profilePicture = path.join(__dirname, "upload", user.profilePicture);
      return res.send({
        status: 200,
        success: true,
        message: "user successfully signed in.",
        user,
        token,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Please provide valid email",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

const getUserDataByIdInPdf = async (req, res) => {
  try {
    const user = await User.findById(req["data"]._id);
    const pdf = new PDFDocument({ autoFirstPage: true });
    pdf.text(`firstName: ${user.firstName}`);
    pdf.text(`lastName: ${user.lastName}`);
    pdf.text(`Date of Birth: ${user.DOB}`);
    pdf.text(`hobbies: ${user.hobbies.join()}`);
    pdf.text(`projects: ${user.projects.join()}`);
    pdf.text(`email: ${user.email}`);
    pdf
      .image(`upload/${user.profilePicture}`, 320, 145, {
        width: 200,
        height: 100,
      })
      .text("profile Image", 320, 130);
    const buffers = [];
    pdf.on("data", (buffer) => buffers.push(buffer));
    pdf.on("end", () => {
      const pdfData = Buffer.concat(buffers);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="profile.pdf"`
      );
      res.setHeader("Content-Length", pdfData.length);
      res.send(pdfData);
    });

    pdf.end();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getUserDataByIdInXLSX = async (req, res) => {
  try {
    let user = await User.findById(req["data"]._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
      {
        FirstName: user.firstName,
        lastName: user.lastName,
        Email: user.email,
        DOB: user.DOB,
        hobbies: user.hobbies.join(),
        projects: user.projects.join(),
        profilePicture: user.profilePicture,
      },
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Profile");
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="profile.xlsx"`);
    res.end(excelBuffer, "binary");
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  verifyOTP,
  userLogin,
  getUserDataByIdInPdf,
  getUserDataByIdInXLSX,
};
