import transporter from "../config/mail.js";

export const sendOtpMail = async (req, res) => {
  try {
    const {
      email,
      subject = "OTP Verification",
      html,
    } = req.body;

    console.log("Received mail data:", { email, subject, html });

    console.log("User:", process.env.EMAIL_USER);
    console.log("Pass length:", process.env.EMAIL_PASS?.length);

    // ❌ validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 🔥 generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 📩 default HTML template
    const defaultHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#2563eb; letter-spacing:5px;">
          ${otp}
        </h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `;

    // final fallback HTML
    const finalHtml = html || defaultHtml;

    // 📧 send mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: finalHtml,
    });

    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
      otp,
    });

  } catch (error) {
    console.error("Send Mail Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send mail",
    });
  }
};