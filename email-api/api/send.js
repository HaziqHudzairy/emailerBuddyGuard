const nodemailer = require("nodemailer");
const cors = require("cors");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  // Enable CORS for all origins
  cors({
    origin: '*', // allows any origin to access the API
  })(req, res, () => {});

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  // Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];  // Token comes after "Bearer"
  
  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  // Verify the token using a secret key
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
    console.log("Token is valid. User data:", decoded); // You can access decoded user info here if needed
  } catch (error) {
    return res.status(401).json({ message: "Invalid access token" });
  }

  // Extract email fields from the request body
  const { to, subject, text } = req.body;

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

    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Send Mail Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
