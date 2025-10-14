import { client } from "./client";

// Payment API endpoints
export const paymentAPI = {
  // Create Razorpay order
  createOrder: async (orderData) => {
    try {
      const response = await client.post("/payments/create-order", orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify payment and create order
  verifyPayment: async (paymentData) => {
    try {
      const response = await client.post("/payments/verify-payment", paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await client.get(`/payments/status/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Handle payment failure
  reportPaymentFailure: async (failureData) => {
    try {
      const response = await client.post("/payments/failure", failureData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Request refund (admin functionality)
  requestRefund: async (refundData) => {
    try {
      const response = await client.post("/payments/refund", refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Helper function to initialize Razorpay checkout
export const initializeRazorpayCheckout = (options) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay SDK not loaded"));
      return;
    }

    const rzp = new window.Razorpay({
      ...options,
      handler: (response) => {
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment cancelled by user"));
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      reject(response.error);
    });

    rzp.open();
  });
};

// Complete payment flow helper
export const processPayment = async ({
  amount,
  currency = "INR",
  shippingAddressId,
  paymentMethodId,
  couponCode,
  customerNotes,
  customerDetails,
  onSuccess,
  onFailure,
}) => {
  try {
    // Step 1: Create Razorpay order
    const orderResponse = await paymentAPI.createOrder({
      amount,
      currency,
      notes: {
        shippingAddressId,
        paymentMethodId,
        couponCode,
      },
    });

    if (!orderResponse.success) {
      throw new Error(orderResponse.message || "Failed to create order");
    }

    const { orderId, key } = orderResponse.data;

    // Step 2: Initialize Razorpay checkout
    const paymentResponse = await initializeRazorpayCheckout({
      key,
      amount: amount * 100, // Convert to paise
      currency,
      name: "Ciyatake",
      description: "Order Payment",
      order_id: orderId,
      prefill: {
        name: customerDetails.name,
        email: customerDetails.email,
        contact: customerDetails.phone,
      },
      theme: {
        color: "#000000", // Your brand color
      },
      notes: {
        address: "Ciyatake Corporate Office",
      },
    });

    // Step 3: Verify payment on backend
    const verificationResponse = await paymentAPI.verifyPayment({
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
      shippingAddressId,
      paymentMethodId,
      couponCode,
      customerNotes,
    });

    if (verificationResponse.success) {
      onSuccess && onSuccess(verificationResponse.data);
      return verificationResponse.data;
    } else {
      throw new Error(verificationResponse.message || "Payment verification failed");
    }
  } catch (error) {
    // Report payment failure
    if (error.error && error.error.metadata) {
      try {
        await paymentAPI.reportPaymentFailure({
          razorpay_order_id: error.error.metadata.order_id,
          razorpay_payment_id: error.error.metadata.payment_id,
          error_description: error.error.description,
        });
      } catch (reportError) {
        console.error("Failed to report payment failure:", reportError);
      }
    }

    onFailure && onFailure(error);
    throw error;
  }
};

// Format amount for display
export const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Validate payment form data
export const validatePaymentForm = (data) => {
  const errors = {};

  if (!data.shippingAddressId) {
    errors.shippingAddress = "Please select a shipping address";
  }

  if (!data.amount || data.amount < 1) {
    errors.amount = "Invalid payment amount";
  }

  if (data.customerNotes && data.customerNotes.length > 500) {
    errors.customerNotes = "Customer notes should be less than 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};