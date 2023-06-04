require("dotenv").config();

module.exports = {
  mailSettings: {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    // service: 'gmail',
    auth: {
      user: process.env.MAILEMAIL,
      pass: process.env.MAILPASSWORD,
    },
  },
};
