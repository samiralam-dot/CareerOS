import nodemailer from "nodemailer";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// Prefer IPv4 over IPv6
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },

  // SMTP connection configuration
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false
  }
});

transporter.verify((error) => {
  if (error) {
    console.log("Mail Config Error:", error);
  } else {
    console.log("Mail server ready");
  }
});

export default transporter;