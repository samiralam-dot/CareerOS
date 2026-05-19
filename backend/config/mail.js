import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // force IPv4

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Mail Config Error:", error);
  } else {
    console.log("Mail server ready");
  }
});

export default transporter;