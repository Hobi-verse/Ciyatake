import { ApiError, apiRequest } from "./client";

let razorpayScriptPromise = null;

const loadRazorpayScript = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Razorpay SDK can only load in the browser"));
  }

  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null;
      script.remove();
      reject(new Error("Failed to load Razorpay SDK"));
    };
    document.head.appendChild(script);
  });

  return razorpayScriptPromise;
};

// Payment API endpoints
export const paymentAPI = {
  // Create Razorpay order (Step 1 - Secure amount locking)
  createOrder: (orderData) =>
    apiRequest("/payments/create-order", {
      method: "POST",
      body: orderData,
    }),

  // Verify payment and create order (Step 2 - Secure verification)
  verifyPayment: (paymentData) =>
    apiRequest("/payments/verify-payment", {
      method: "POST",
      body: paymentData,
    }),

  // Get payment status
  getPaymentStatus: (paymentId) => apiRequest(`/payments/status/${paymentId}`),

  // Handle payment failure
  reportPaymentFailure: (failureData) =>
    apiRequest("/payments/failure", {
      method: "POST",
      body: failureData,
    }),

  // Request refund (admin functionality)
  requestRefund: (refundData) =>
    apiRequest("/payments/refund", {
      method: "POST",
      body: refundData,
    }),
};

// Helper function to initialize Razorpay checkout
export const initializeRazorpayCheckout = async (options) => {
  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay SDK not loaded"));
      return;
    }

    const { modal: modalOptions, ...restOptions } = options ?? {};

    const rzp = new window.Razorpay({
      ...restOptions,
      handler: (response) => {
        resolve(response);
      },
      modal: {
        ...(modalOptions ?? {}),
        ondismiss: () => {
          if (typeof modalOptions?.ondismiss === "function") {
            modalOptions.ondismiss();
          }
          reject(new Error("Payment cancelled by user"));
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      const failure = response?.error ?? new Error("Payment failed");
      reject(failure);
    });

    rzp.open();
  });
};

// Complete payment flow helper - SECURE LIKE FLIPKART/AMAZON
export const processPayment = async ({
  shippingAddressId,
  couponCode,
  customerNotes,
  customerDetails,
  onSuccess,
  onFailure,
}) => {
  try {
    // Validate required fields
    if (!shippingAddressId) {
      throw new Error("Shipping address is required for payment");
    }

    console.log('🔐 Starting secure payment process...');

    // Step 1: Create Razorpay order with server-side validation and locked pricing
    const orderResponse = await paymentAPI.createOrder({
      shippingAddressId,
      couponCode,
      customerNotes,
    });

    const { success, data, message } = orderResponse ?? {};

    if (!success || !data?.orderId || !data?.key) {
      throw new Error(message || "Failed to create payment order");
    }

    const { orderId, key, amount, pricing, items, shippingAddress } = data;

    console.log('✅ Payment order created:', orderId, 'Amount locked:', amount);

    // Step 2: Initialize Razorpay checkout with LOCKED amount
    const paymentResponse = await initializeRazorpayCheckout({
      key,
      amount: amount * 100, // Convert to paise (AMOUNT IS LOCKED)
      currency: "INR",
      name: "Ciyatake",
      description: `Order Payment - ${items.length} item(s)`,
      order_id: orderId,
      prefill: {
        name: customerDetails?.name ?? "",
        email: customerDetails?.email ?? "",
        contact: customerDetails?.phone ?? "",
      },
      theme: {
        color: "#b8985b", // Your brand color
      },
      notes: {
        address: "Ciyatake Corporate Office",
        itemCount: items.length,
      },
      // Disable editing of amount (SECURITY FEATURE)
      readonly: {
        email: true,
        contact: true,
      },
    });

    console.log('💳 Payment completed via Razorpay');

    // Step 3: Verify payment on backend with signature validation
    const verificationResponse = await paymentAPI.verifyPayment({
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
      customerNotes,
    });

    if (verificationResponse?.success) {
      console.log('✅ Payment verified and order created successfully');
      onSuccess && onSuccess(verificationResponse.data);
      return verificationResponse.data;
    }

    throw new Error(
      verificationResponse?.message || "Payment verification failed"
    );
  } catch (error) {
    console.error('❌ Payment process failed:', error);

    // Report payment failure to backend
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

    if (error instanceof ApiError) {
      throw error.payload ?? error;
    }

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