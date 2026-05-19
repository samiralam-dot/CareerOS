const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,        // ← 465 se 587 karo
  secure: false,    // ← true se false karo (587 STARTTLS use karta hai)
  family: 4,

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