const nodemailer = require("nodemailer");

const mailSender = async (to, subject, text) => {
  try {
    // Debug: Check if env variables are loaded
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS is set:", !!process.env.EMAIL_PASS);

    // Production-optimized Gmail transporter config for Render
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Render-specific optimizations
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 15000, // 15 seconds
      socketTimeout: 30000, // 30 seconds
      pool: false, // Disable pooling for Render's stateless environment
      maxConnections: 1, // Single connection for Render
      secure: true,
      requireTLS: true,
      tls: {
        rejectUnauthorized: false // Allow for hosting environments
      }
    });

    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    // Set timeout for the entire send operation
    const emailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email timeout after 20 seconds')), 20000);
    });

    const info = await Promise.race([emailPromise, timeoutPromise]);
    
    console.log("✅ Mail sent successfully:", info.response);
    
    // Close the transporter immediately after sending
    transporter.close();
    
    return info;
  } catch (error) {
    console.error("❌ Error in mailSender:", error.message);
    
    // Provide more specific error messages for production debugging
    if (error.code === 'EAUTH') {
      console.error("❌ Email authentication failed - check EMAIL_USER and EMAIL_PASS");
    } else if (error.code === 'ENOTFOUND') {
      console.error("❌ Gmail SMTP server not found - network issue");
    } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      console.error("❌ Email timeout - Render hosting limitation");
    }
    
    throw error;
  }
};

module.exports = mailSender;