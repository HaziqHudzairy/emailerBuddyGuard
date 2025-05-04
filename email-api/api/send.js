const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // Ensure only POST requests are allowed
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  // Destructure the required fields from the request body
  const { to, subject, text } = req.body;

  // Check if required fields are present
  if (!to || !subject || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Log the incoming request data for debugging (remove in production)
  console.log(`Sending email to: ${to} with subject: ${subject}`);

  // Configure Nodemailer transporter using environment variables
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can replace it with another service like SMTP
    auth: {
      user: process.env.EMAIL_USER,  // Your email address from env
      pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
    },
  });

  try {
    // Send the email using transporter
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,  // Sender address
      to,                            // Recipient address
      subject,                       // Subject line
      text,                          // Plain text body
    });

    // Log the email sending result for debugging
    console.log("Message sent: %s", info.messageId);

    // Send a success response
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    // Log any error that occurs during sending the email
    console.error("Send Mail Error:", error);

    // Send a failure response
    res.status(500).json({ success: false, error: error.message });
  }
};
