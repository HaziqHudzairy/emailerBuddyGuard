const nodemailer = require("nodemailer");
const cors = require("cors");

module.exports = async (req, res) => {
  // Enable CORS for all origins
  cors({
    origin: '*', // allows any origin to access the API
  })(req, res, () => {});

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  // Extract email fields from the request body
  const { to, subject, text } = req.body;

  // Ensure all required fields are present
  if (!to || !subject || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Configure transporter using Gmail or any SMTP provider
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your SMTP provider
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
    });

    // Return success with messageId
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Send Mail Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
