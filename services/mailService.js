const nodemailer = require("nodemailer"); //company email services

//dispatch email to use
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"My Book Store" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}`, error);
  }
};

const sendWelcomeBackEmail = async (email) => {
  try {
    await sendEmail({
      to: email,
      subject: "Welcome Back",
      html: `<h1> Welcome Back </h1>`,
    });
    console.log(`email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}`, error);
  }
};

module.exports = { sendEmail, sendWelcomeBackEmail, transporter };
