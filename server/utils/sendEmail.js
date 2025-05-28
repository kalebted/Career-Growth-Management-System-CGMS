import "../config/env.js";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("📨 EMAIL_USER:", process.env.EMAIL_USER);
console.log("📨 EMAIL_PASS:", process.env.EMAIL_PASS ? "✓ Loaded" : "❌ Not Loaded");

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"CGMS Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

export default sendEmail;
