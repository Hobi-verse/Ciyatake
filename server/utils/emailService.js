const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL since Render times out on STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
    tls: {
      // Gmail requires a valid certificate; keep explicit false removal so defaults apply
      rejectUnauthorized: true
    },
    // Add timeout settings for production
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000, // 60 seconds
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    // Test the connection first
    await transporter.verify();

    const senderEmail = process.env.EMAIL_USER || 'noreply@ciyatake.com';

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'CiyaTake'}" <${senderEmail}>`,
      to: email,
      subject: 'Your OTP for Account Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #b8985b; font-size: 28px; margin: 0;">${process.env.APP_NAME || 'CiyaTake'}</h1>
            </div>
            
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Verify Your Account</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
              Hello! We received a request to verify your account. Please use the following OTP to complete your verification:
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h1 style="color: #b8985b; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              <strong>Important:</strong>
            </p>
            <ul style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
              <li>This OTP is valid for 10 minutes only</li>
              <li>Don't share this OTP with anyone</li>
              <li>If you didn't request this OTP, please ignore this email</li>
            </ul>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                This is an automated email. Please do not reply to this email.
              </p>
              <p style="color: #999; font-size: 12px; text-align: center; margin: 5px 0 0 0;">
                © ${new Date().getFullYear()} ${process.env.APP_NAME || 'CiyaTake'}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `Your OTP for ${process.env.APP_NAME || 'CiyaTake'} account verification is: ${otp}. This OTP is valid for 10 minutes. Don't share this with anyone.`
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log success for monitoring purposes
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ OTP email sent successfully:', info.messageId);
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Always log errors for debugging
    console.error('❌ Error sending OTP email:', error.message);
    
    // Log detailed error info only in non-production
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ Error details:', {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      });
    }

    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check email credentials.');
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('Email service not available. Please try again later.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Email service timeout. Please try again later.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Cannot connect to email service. Please try again later.');
    } else {
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }
};

module.exports = {
  sendOTPEmail,
};