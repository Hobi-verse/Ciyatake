const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const PaymentMethod = require('../models/PaymentMethod');

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Calculate pricing securely on server-side
 */
const calculateSecurePricing = (cartItems, appliedCoupon = null) => {
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity);
  }, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = Math.min(appliedCoupon.discountValue, subtotal);
    }
    
    if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
      discount = appliedCoupon.maxDiscount;
    }
  }

  const total = subtotal - discount;

  return {
    subtotal: Math.round(subtotal),
    shipping: 0,
    tax: 0,
    discount: Math.round(discount),
    total: Math.round(total)
  };
};

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddressId, couponCode, customerNotes } = req.body;

    console.log('🔐 Creating payment order for user:', userId);
    console.log('📦 Request body:', { shippingAddressId, couponCode, customerNotes });

    // 1. Validate shipping address
    if (!shippingAddressId) {
      console.log('❌ Missing shipping address ID');
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    const shippingAddress = await Address.findOne({ 
      _id: shippingAddressId, 
      userId 
    });

    console.log('📍 Shipping address found:', !!shippingAddress);

    if (!shippingAddress) {
      console.log('❌ Shipping address not found for user:', userId, 'addressId:', shippingAddressId);
      return res.status(400).json({
        success: false,
        message: 'Invalid shipping address'
      });
    }

    // 2. Get and validate cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    
    console.log('🛒 Cart found:', !!cart);
    console.log('🛒 Cart items count:', cart?.items?.length || 0);
    
    if (!cart || !cart.items || cart.items.length === 0) {
      console.log('❌ Cart is empty or not found');
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // Filter out saved for later items
    const activeItems = cart.items.filter(item => !item.savedForLater);
    console.log('🛒 Active cart items:', activeItems.length);
    
    if (activeItems.length === 0) {
      console.log('❌ No active items in cart');
      return res.status(400).json({
        success: false,
        message: 'Your cart has no active items'
      });
    }

    // 3. Validate cart items and check stock
    const validatedItems = [];
    for (const item of activeItems) {

      const product = item.productId;
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.title}" is no longer available`
        });
      }

      // Find the specific variant by SKU
      let variant = null;
      if (product.variants && product.variants.length > 0) {
        variant = product.variants.find(v => v.sku === item.variantSku);
      }

      // Check stock availability
      const availableStock = variant ? (variant.stock || 999) : (product.stock || 999);
      
      if (availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} items available for "${product.title}" in size "${item.size}"`
        });
      }

      // Use price from cart item (already validated when added to cart)
      const unitPrice = item.price;
      const subtotal = unitPrice * item.quantity;

      validatedItems.push({
        productId: product._id,
        title: item.title,
        size: item.size,
        color: item.color || 'Default',
        quantity: item.quantity,
        unitPrice: unitPrice,
        subtotal: subtotal,
        images: product.images,
        variantSku: item.variantSku || `${product._id}_default`,
        stock: availableStock
      });
    }

    if (validatedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid items found in cart'
      });
    }

    // 4. Validate and apply coupon if provided
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired coupon code'
        });
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: 'Coupon usage limit exceeded'
        });
      }

      appliedCoupon = coupon;
    }

    // 5. Calculate secure pricing
    const pricing = calculateSecurePricing(validatedItems, appliedCoupon);

    if (pricing.total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total amount'
      });
    }

    // 6. Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: pricing.total * 100, // Convert to paise
      currency: 'INR',
      receipt: `ord_${Date.now()}`,
      payment_capture: 1,
      notes: {
        userId: userId.toString(),
        shippingAddressId: shippingAddressId.toString(),
        couponCode: couponCode || '',
        itemCount: validatedItems.length.toString(),
        customerNotes: customerNotes || ''
      }
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id, 'Amount locked:', pricing.total);
    console.log('📦 Validated items for storage:', validatedItems);

    // 7. Store order details for verification
    global.pendingOrders = global.pendingOrders || {};
    global.pendingOrders[razorpayOrder.id] = {
      userId,
      items: validatedItems,
      pricing,
      shippingAddress: {
        addressId: shippingAddress._id,
        recipient: shippingAddress.recipient,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        instructions: shippingAddress.deliveryInstructions
      },
      appliedCoupon: appliedCoupon ? {
        couponId: appliedCoupon._id,
        code: appliedCoupon.code,
        discountType: appliedCoupon.discountType,
        discountValue: appliedCoupon.discountValue,
        discountApplied: pricing.discount
      } : null,
      customerNotes,
      createdAt: new Date()
    };

    res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: pricing.total,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID,
        items: validatedItems.map(item => ({
          title: item.title,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal
        })),
        pricing: {
          subtotal: pricing.subtotal,
          shipping: pricing.shipping,
          tax: pricing.tax,
          discount: pricing.discount,
          total: pricing.total
        },
        shippingAddress: {
          recipient: shippingAddress.recipient,
          formattedAddress: shippingAddress.getFormattedAddress()
        }
      }
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

/**
 * @desc    Verify payment and create order
 * @route   POST /api/payments/verify-payment
 * @access  Private
 */
const verifyPaymentAndCreateOrder = async (req, res) => {
  let razorpay_order_id;
  try {
    const userId = req.user._id;
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id,
      razorpay_signature,
      customerNotes
    } = req.body;
    
    razorpay_order_id = orderId;

    // 1. Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature'
      });
    }

    // 2. Get stored order details
    let pendingOrder = global.pendingOrders?.[razorpay_order_id];
    
    if (!pendingOrder) {
      return res.status(400).json({
        success: false,
        message: 'Order details not found or expired. Please try placing the order again.'
      });
    }

    // 3. Verify user authorization
    if (pendingOrder.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized payment attempt'
      });
    }

    // 4. Verify payment status with Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return res.status(400).json({
        success: false,
        message: `Payment not successful. Status: ${payment.status}`
      });
    }

    // 5. Verify amount matches
    const expectedAmount = Math.round(pendingOrder.pricing.total * 100);
    if (payment.amount !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount verification failed'
      });
    }

    // 6. Final stock check
    for (const item of pendingOrder.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.title}`
        });
      }
      
      // Find variant by SKU
      let variant = null;
      if (product.variants && product.variants.length > 0) {
        variant = product.variants.find(v => v.sku === item.variantSku);
      }
      
      const availableStock = variant ? (variant.stock || 999) : (product.stock || 999);
      if (availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.title} - ${item.size}`
        });
      }
    }

    // 7. Generate unique order number
    const orderNumber = `CYA${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // 8. Create the order in database
    console.log('📦 Creating order with items:', pendingOrder.items.map(item => ({
      productId: item.productId,
      variantSku: item.variantSku,
      title: item.title,
      size: item.size,
      color: item.color,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.subtotal
    })));

    const orderData = {
      orderNumber,
      userId: pendingOrder.userId,
      items: pendingOrder.items.map(item => ({
        productId: item.productId,
        variantSku: item.variantSku || `${item.productId}_default`,
        title: item.title,
        size: item.size,
        color: item.color || 'Default',
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
        imageUrl: item.images?.[0]?.url || item.images?.[0] || '/default-image.jpg'
      })),
      pricing: {
        subtotal: pendingOrder.pricing.subtotal,
        shipping: pendingOrder.pricing.shipping,
        tax: pendingOrder.pricing.tax,
        discount: pendingOrder.pricing.discount,
        grandTotal: pendingOrder.pricing.total
      },
      shipping: {
        recipient: pendingOrder.shippingAddress.recipient,
        phone: pendingOrder.shippingAddress.phone,
        addressLine1: pendingOrder.shippingAddress.addressLine1,
        addressLine2: pendingOrder.shippingAddress.addressLine2,
        city: pendingOrder.shippingAddress.city,
        state: pendingOrder.shippingAddress.state,
        postalCode: pendingOrder.shippingAddress.postalCode,
        country: pendingOrder.shippingAddress.country,
        instructions: pendingOrder.shippingAddress.instructions,
        addressId: pendingOrder.shippingAddress.addressId
      },
      payment: {
        method: 'razorpay',
        status: 'completed',
        transactionId: razorpay_payment_id,
        paidAt: new Date()
      },
      coupon: pendingOrder.appliedCoupon ? {
        couponId: pendingOrder.appliedCoupon.couponId,
        code: pendingOrder.appliedCoupon.code,
        discountType: pendingOrder.appliedCoupon.discountType,
        discountValue: pendingOrder.appliedCoupon.discountValue,
        discountApplied: pendingOrder.appliedCoupon.discountApplied
      } : undefined,
      customer: {
        name: pendingOrder.shippingAddress.recipient,
        email: req.user.email,
        phone: pendingOrder.shippingAddress.phone
      },
      notes: {
        customerNotes: pendingOrder.customerNotes
      },
      status: 'confirmed',
      placedAt: new Date(),
      confirmedAt: new Date(),
      timeline: [
        {
          title: 'Order received',
          description: 'We\'ve received your order and are processing it.',
          status: 'complete',
          timestamp: new Date()
        },
        {
          title: 'Payment confirmed',
          description: 'Payment received and order confirmed.',
          status: 'complete',
          timestamp: new Date()
        },
        {
          title: 'Processing order',
          description: 'Our team is preparing your items.',
          status: 'current',
          timestamp: new Date()
        }
      ]
    };

    console.log('📦 Order data to create:', JSON.stringify(orderData, null, 2));

    let order;
    try {
      order = await Order.create(orderData);
      console.log('✅ Order created successfully:', order.orderNumber, order._id);
    } catch (orderError) {
      console.error('❌ Order creation failed:', orderError);
      throw orderError;
    }

    // 9. Update stock levels
    for (const item of pendingOrder.items) {
      if (item.variantSku) {
        // Update variant stock
        await Product.findOneAndUpdate(
          { _id: item.productId, 'variants.sku': item.variantSku },
          { $inc: { 'variants.$.stock': -item.quantity } }
        );
      } else {
        // Update product stock
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    // 10. Update coupon usage
    if (pendingOrder.appliedCoupon) {
      await Coupon.findByIdAndUpdate(pendingOrder.appliedCoupon.couponId, {
        $inc: { usedCount: 1 }
      });
    }

    // 11. Clear user's cart
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    // 12. Clean up pending order
    delete global.pendingOrders[razorpay_order_id];

    // 13. Save payment method
    try {
      await PaymentMethod.create({
        userId: userId,
        type: payment.method === 'card' ? 'card' : payment.method === 'upi' ? 'upi' : 'card',
        brand: payment.method === 'upi' ? 'UPI' : payment.card?.network || 'Razorpay',
        last4: payment.card?.last4,
        paymentToken: razorpay_payment_id,
        isDefault: false,
        isActive: true,
        nickname: `Payment for Order ${orderNumber}`
      });
    } catch (paymentMethodError) {
      console.error('Failed to save payment method:', paymentMethodError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order created successfully',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.pricing.grandTotal,
          items: order.items.map(item => ({
            title: item.title,
            size: item.size,
            quantity: item.quantity,
            price: item.unitPrice
          })),
          payment: {
            transactionId: order.payment.transactionId,
            method: order.payment.method,
            status: order.payment.status,
            paidAt: order.payment.paidAt
          },
          placedAt: order.placedAt
        },
        orderId: order._id,
        orderNumber: order.orderNumber
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
    if (razorpay_order_id && global.pendingOrders?.[razorpay_order_id]) {
      delete global.pendingOrders[razorpay_order_id];
    }
    
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

/**
 * @desc    Get payment status
 * @route   GET /api/payments/status/:paymentId
 * @access  Private
 */
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.status(200).json({
      success: true,
      data: {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount / 100,
        currency: payment.currency,
        method: payment.method,
        createdAt: new Date(payment.created_at * 1000),
      },
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.message,
    });
  }
};

/**
 * @desc    Handle payment failure
 * @route   POST /api/payments/failure
 * @access  Private
 */
const reportPaymentFailure = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, error_description } = req.body;
    
    console.log('Payment failure reported:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      error: error_description
    });

    if (razorpay_order_id && global.pendingOrders?.[razorpay_order_id]) {
      delete global.pendingOrders[razorpay_order_id];
    }

    res.status(200).json({
      success: true,
      message: 'Payment failure reported',
    });
  } catch (error) {
    console.error('Report payment failure error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report payment failure',
      error: error.message,
    });
  }
};

/**
 * @desc    Request refund
 * @route   POST /api/payments/refund
 * @access  Private (Admin)
 */
const requestRefund = async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required',
      });
    }

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined,
      notes: {
        reason: reason || 'Customer request',
        refundedBy: req.user.email,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      },
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message,
    });
  }
};

/**
 * @desc    Webhook handler for Razorpay events
 * @route   POST /api/payments/webhook
 * @access  Public (Webhook)
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const event = req.body;
    console.log('Webhook received:', event.event);

    switch (event.event) {
      case 'payment.captured':
        console.log('Payment captured:', event.payload.payment.entity.id);
        break;
      case 'payment.failed':
        console.log('Payment failed:', event.payload.payment.entity.id);
        break;
      case 'order.paid':
        console.log('Order paid:', event.payload.order.entity.id);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
};

module.exports = {
  createOrder,
  verifyPaymentAndCreateOrder,
  getPaymentStatus,
  reportPaymentFailure,
  requestRefund,
  handleWebhook,
};