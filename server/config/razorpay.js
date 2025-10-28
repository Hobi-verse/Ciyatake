const Razorpay = require('razorpay');

// Validate required environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials are required. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.');
}

// Initialize Razorpay instance with production configuration
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Test connection on startup
razorpayInstance.orders.all({ count: 1 })
  .then(() => {
    console.log('✅ Razorpay connection established successfully');
  })
  .catch((error) => {
    console.error('❌ Razorpay connection failed:', error.message);
  });

module.exports = razorpayInstance;