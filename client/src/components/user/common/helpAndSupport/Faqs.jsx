import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  CreditCard,
  Truck,
  Package,
  RotateCcw,
  User,
  Tag,
  HeadphonesIcon,
  Shield,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { useEffect } from "react";

const FAQSection = ({ title, icon, faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#8b7355]">
        <div className="text-[#8b7355]">{icon}</div>
        <h2 className="text-2xl font-semibold text-[#4a4a4a]">{title}</h2>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-[#e8e2db] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#faf8f6] transition-colors duration-200"
            >
              <span className="font-medium text-[#4a4a4a] pr-4">
                {faq.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-[#8b7355] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#8b7355] flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 pt-2 bg-[#faf8f6] border-t border-[#e8e2db]">
                <p className="text-[#6b6b6b] leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Faqs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ordersPaymentsFAQs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse products, add items to your cart, proceed to checkout, enter your delivery details, choose payment method, and confirm your order. You'll receive an order confirmation via email and SMS.",
    },
    {
      question: "Can I modify or cancel my order?",
      answer:
        "Yes, you can cancel or modify your order within 1 hour of placing it. Contact our support team immediately at care@ciyatake.com or call +91 98765 43210. Once the order is dispatched, modifications are not possible.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept UPI, credit/debit cards (Visa, Mastercard, Amex), net banking, digital wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery (COD) for eligible orders.",
    },
    {
      question: "I didn't receive an order confirmation. What should I do?",
      answer:
        "Check your spam/junk folder first. If you still can't find it, contact our support team with your registered email or phone number, and we'll resend the confirmation.",
    },
    {
      question: "Is Cash on Delivery (COD) available for all orders?",
      answer:
        "COD is available for most orders below ₹50,000. Some remote locations may not have COD service. This will be indicated at checkout.",
    },
  ];

  const shippingDeliveryFAQs = [
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 5-7 business days for most locations. Metro cities receive orders within 3-5 days. Remote areas may take 7-10 days. You'll see an estimated delivery date at checkout.",
    },
    {
      question: "Do you offer free shipping?",
      answer:
        "Yes! We offer free shipping on orders above ₹999. Orders below this amount have a flat shipping fee of ₹99.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order by logging into your account and visiting the 'My Orders' section.",
    },
    {
      question: "Do you deliver to my location?",
      answer:
        "We deliver across India to most PIN codes. Enter your PIN code on the product page to check delivery availability. For international shipping, please contact our support team.",
    },
    {
      question: "What if I'm not available to receive my delivery?",
      answer:
        "Our delivery partner will attempt delivery 2-3 times. You can also reschedule delivery or provide alternate delivery instructions through the tracking link.",
    },
  ];

  const returnsRefundsFAQs = [
    {
      question: "How do I return or exchange a product?",
      answer:
        "Contact our support team within 10 days of delivery with your order number and reason for return. We'll arrange a free pickup or provide return instructions. Items must be unused with original tags and packaging.",
    },
    {
      question: "How long does refund processing take?",
      answer:
        "Once we receive and inspect your returned item (2-3 days), refunds are processed within 5-7 business days to your original payment method. Bank processing may take an additional 2-5 days.",
    },
    {
      question: "Which products cannot be returned?",
      answer:
        "Undergarments, swimwear, beauty products, personal care items, customized products, gift cards, and items marked as final sale cannot be returned for hygiene and quality reasons.",
    },
    {
      question: "Is return pickup free?",
      answer:
        "Yes, we offer free reverse pickup for most locations. If pickup service is unavailable in your area, we'll guide you on self-shipping options.",
    },
    {
      question: "Can I exchange for a different size or color?",
      answer:
        "Yes, exchanges are available subject to stock availability. Contact our support team to initiate an exchange. If the variant is unavailable, we'll process a full refund.",
    },
  ];

  const productStockFAQs = [
    {
      question: "Are all products genuine and authentic?",
      answer:
        "Absolutely! We source all products directly from authorized brands and manufacturers. Every item comes with authenticity guarantee and brand warranty where applicable.",
    },
    {
      question: "How do I know if a product is in stock?",
      answer:
        "Product availability is shown on the product page. If an item is out of stock, you'll see a 'Notify Me' button to receive alerts when it's back in stock.",
    },
    {
      question: "What if I receive a damaged or wrong product?",
      answer:
        "We sincerely apologize for the inconvenience. Contact us immediately with photos of the product. We'll arrange a free pickup and send a replacement or process a full refund within 48 hours.",
    },
    {
      question: "Can I request a product that's currently unavailable?",
      answer:
        "Yes! Use the 'Notify Me' feature on the product page, or contact our team with your request. We'll inform you as soon as the product is restocked.",
    },
  ];

  const accountFAQs = [
    {
      question: "Do I need to create an account to place an order?",
      answer:
        "No, you can checkout as a guest. However, creating an account helps you track orders easily, save addresses, access exclusive offers, and enjoy faster checkout.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page, enter your registered email, and we'll send you a password reset link. Follow the instructions to create a new password.",
    },
    {
      question: "Can I update my personal details or address?",
      answer:
        "Yes, log into your account, go to 'My Profile' or 'Saved Addresses' to update your information anytime.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "To delete your account, contact our support team at care@ciyatake.com. We'll process your request within 7 business days and delete all your personal information as per our privacy policy.",
    },
  ];

  const offersCouponsFAQs = [
    {
      question: "How do I apply a coupon code?",
      answer:
        "At checkout, you'll see a 'Coupon Code' field. Enter your code and click 'Apply'. The discount will be reflected in your order total. Only one coupon can be used per order.",
    },
    {
      question: "Can I use multiple offers together?",
      answer:
        "Generally, only one coupon or promotional offer can be applied per order. However, some site-wide sales may be combined with payment offers. Details will be mentioned in the offer terms.",
    },
    {
      question: "How do I use a gift card?",
      answer:
        "Select 'Gift Card' as payment method at checkout and enter your gift card code. The gift card balance will be applied to your order. You can combine gift cards with other payment methods.",
    },
    {
      question: "Why isn't my coupon working?",
      answer:
        "Check the coupon's expiry date, minimum order value, and applicable categories. Some coupons are valid only for specific products or first-time users. Contact support if you need help.",
    },
  ];

  const supportFAQs = [
    {
      question: "How can I contact Ciyatake support?",
      answer:
        "You can reach us via email at care@ciyatake.com, call us at +91 98765 43210, or use the contact form on our website. We're here to help!",
    },
    {
      question: "What are your support hours?",
      answer:
        "Our customer support team is available Monday to Saturday, 9:00 AM to 6:00 PM IST. We respond to emails within 24 hours on business days.",
    },
    {
      question: "How long does it take to get a response?",
      answer:
        "We aim to respond to all queries within 24 hours on business days. During sale periods, response time may extend to 48 hours. We appreciate your patience!",
    },
  ];

  const privacySecurityFAQs = [
    {
      question: "Is my personal information safe with Ciyatake?",
      answer:
        "Absolutely! We use industry-standard encryption and security measures to protect your data. We never share your information with third parties without consent. Read our Privacy Policy for details.",
    },
    {
      question: "How is my payment data protected?",
      answer:
        "All payment transactions are processed through secure, PCI-DSS compliant payment gateways. We don't store your card details on our servers. Your financial information is completely safe.",
    },
    {
      question: "Do you share my information with third parties?",
      answer:
        "We only share necessary information with delivery partners and payment processors to fulfill your orders. We never sell or rent your personal data to any third party for marketing purposes.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Header */}
      <header className="bg-[#8b7355] text-white py-8 px-4 shadow-md">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 font-semibold transition-all duration-200 border-2 border-white rounded-lg shadow-md sm:mb-8 hover:text-black hover:shadow-xl hover:scale-105 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </a>
        <div className="max-w-5xl mx-auto text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4" />
          <h1 className="mb-3 text-4xl font-bold">
            Frequently Asked Questions
          </h1>
          <p className="text-[#f5f1ed] text-lg">
            Quick answers to help you shop with confidence
          </p>
        </div>
      </header>

      {/* Introduction */}
      <div className="max-w-5xl px-4 py-8 mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border-l-4 border-[#8b7355]">
          <p className="text-[#6b6b6b] leading-relaxed">
            Welcome to Ciyatake's FAQ page! We've compiled answers to the most
            common questions our customers ask. Whether you're curious about
            orders, shipping, returns, or anything else, you'll find helpful
            information below. Can't find what you're looking for? Our support
            team is always ready to help!
          </p>
        </div>

        {/* FAQ Sections */}
        <FAQSection
          title="Orders & Payments"
          icon={<ShoppingCart className="w-7 h-7" />}
          faqs={ordersPaymentsFAQs}
        />

        <FAQSection
          title="Shipping & Delivery"
          icon={<Truck className="w-7 h-7" />}
          faqs={shippingDeliveryFAQs}
        />

        <FAQSection
          title="Returns, Refunds & Exchanges"
          icon={<RotateCcw className="w-7 h-7" />}
          faqs={returnsRefundsFAQs}
        />

        <FAQSection
          title="Product & Stock Information"
          icon={<Package className="w-7 h-7" />}
          faqs={productStockFAQs}
        />

        <FAQSection
          title="My Account"
          icon={<User className="w-7 h-7" />}
          faqs={accountFAQs}
        />

        <FAQSection
          title="Offers, Coupons & Gift Cards"
          icon={<Tag className="w-7 h-7" />}
          faqs={offersCouponsFAQs}
        />

        <FAQSection
          title="Customer Support"
          icon={<HeadphonesIcon className="w-7 h-7" />}
          faqs={supportFAQs}
        />

        <FAQSection
          title="Privacy & Security"
          icon={<Shield className="w-7 h-7" />}
          faqs={privacySecurityFAQs}
        />

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white rounded-lg shadow-lg p-8 text-center">
          <HeadphonesIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="mb-3 text-2xl font-semibold">
            Didn't Find Your Answer?
          </h2>
          <p className="text-[#f5f1ed] mb-6">
            Our friendly support team is here to help you. Reach out anytime!
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:care@ciyatake.com"
              className="bg-white text-[#8b7355] px-6 py-3 rounded-lg font-semibold hover:bg-[#f5f1ed] transition-colors duration-200"
            >
              Email: care@ciyatake.com
            </a>
            <a
              href="tel:+919876543210"
              className="bg-white text-[#8b7355] px-6 py-3 rounded-lg font-semibold hover:bg-[#f5f1ed] transition-colors duration-200"
            >
              Call: +91 98765 43210
            </a>
          </div>
          <p className="text-[#f5f1ed] text-sm mt-4">
            Monday to Saturday, 9:00 AM - 6:00 PM IST
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#4a4a4a] text-[#d4cec7] py-8 px-4 mt-12">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm">© 2025 Ciyatake. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Thoughtfully curated fashion and lifestyle essentials to help you
            celebrate everyday moments in style.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Faqs;
