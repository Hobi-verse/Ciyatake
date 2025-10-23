import React from "react";

const RefundPolicy = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-6 text-[#8b7355]">Refund Policy</h1>
    <p className="mb-4">We want you to be completely satisfied with your purchase. If you are not satisfied, you may be eligible for a refund under the following conditions:</p>
    <ul className="list-disc ml-6 mb-4">
      <li>Refund requests must be made within 7 days of receiving your order.</li>
      <li>Items must be unused, in original packaging, and in resalable condition.</li>
      <li>Refunds will be credited to your original payment method within 7-10 business days after approval.</li>
      <li>Shipping charges are non-refundable unless the product is defective or incorrect.</li>
    </ul>
    <p className="mb-2">To request a refund, please contact our support team at <a href="mailto:care@ciyatake.com" className="text-[#8b7355] underline">care@ciyatake.com</a> with your order details.</p>
    <p>If your refund is approved, you will receive a confirmation email with further instructions.</p>
  </div>
);

export default RefundPolicy;
