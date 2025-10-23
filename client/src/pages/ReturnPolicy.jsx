import React from "react";

const ReturnPolicy = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-6 text-[#8b7355]">Return Policy</h1>
    <p className="mb-4">If you are not satisfied with your purchase, you may return eligible items under the following conditions:</p>
    <ul className="list-disc ml-6 mb-4">
      <li>Returns must be initiated within 7 days of delivery.</li>
      <li>Items must be unused, unwashed, and in original packaging with all tags attached.</li>
      <li>Some items (such as innerwear, beauty products, and customized items) are not eligible for return.</li>
      <li>Return shipping costs are the responsibility of the customer unless the item is defective or incorrect.</li>
    </ul>
    <p className="mb-2">To initiate a return, please email <a href="mailto:care@ciyatake.com" className="text-[#8b7355] underline">care@ciyatake.com</a> with your order number and reason for return.</p>
    <p>Once your return is received and inspected, we will notify you regarding the approval or rejection of your return.</p>
  </div>
);

export default ReturnPolicy;
