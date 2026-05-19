import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4, // ← Force IPv4 socket — this is what actually prevents the ENETUNREACH

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log("Mail Config Error:", error);
  } else {
    console.log("Mail server ready");
  }
});

export default transporter;