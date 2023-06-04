const nodemailer = require("nodemailer");
const { mailSettings } = require("../config/email");

async function sendEmail(email, userName, otp) {
  try {
    const subject = "email verification for user registration";
    const body = `<div style="max-width: 90%; margin: auto; padding-top: 20px">
                    <h2>Welcome</h2>
                    <p>Hello ${userName},<br>
                    Your OTP for email verification is ${otp}.</p>
                  </div>`;
    const transporter = nodemailer.createTransport(mailSettings);

    const mailOptions = {
      from: mailSettings.auth.user,
      to: email,
      subject: subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log({ error: error.message });
    return false;
  }
}

module.exports = { sendEmail };
