const nodemailer = require("nodemailer");
const cors = require("cors");

module.exports = async (req, res) => {
  cors({ origin: '*' })(req, res, () => {});

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Send Mail Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
