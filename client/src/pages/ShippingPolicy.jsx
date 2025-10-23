import React from "react";

const ShippingPolicy = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-6 text-[#8b7355]">Shipping Policy</h1>
    <p className="mb-4">We strive to deliver your orders quickly and efficiently. Please review our shipping policy below:</p>
    <ul className="list-disc ml-6 mb-4">
      <li>Orders are processed within 1-2 business days after payment confirmation.</li>
      <li>Standard delivery time is 3-7 business days depending on your location.</li>
      <li>Shipping charges are calculated at checkout and may vary based on order value and destination.</li>
      <li>We currently ship across India. For international shipping, please contact our support team.</li>
    </ul>
    <p className="mb-2">You will receive a tracking number via email once your order has shipped.</p>
    <p>For any shipping-related queries, contact us at <a href="mailto:care@ciyatake.com" className="text-[#8b7355] underline">care@ciyatake.com</a>.</p>
  </div>
);

export default ShippingPolicy;
