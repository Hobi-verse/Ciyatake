import {
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
  Mail,
  Phone,
  Clock,
  AlertCircle,
} from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Header */}
      <header className="bg-[#8b7355] text-white py-6 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Returns & Refund Policy</h1>
          <p className="text-[#f5f1ed] mt-2">
            Clear, simple, and customer-friendly
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl px-4 py-12 mx-auto">
        {/* Introduction */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8 border-l-4 border-[#8b7355]">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-[#8b7355] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold text-[#4a4a4a] mb-4">
                Our Commitment to You
              </h2>
              <p className="text-[#6b6b6b] leading-relaxed">
                At Ciyatake, your satisfaction is our priority. We understand
                that sometimes products may not meet your expectations, and
                we're here to make returns and refunds as smooth as possible.
                This policy outlines everything you need to know about returning
                items and getting your money back.
              </p>
            </div>
          </div>
        </section>

        {/* Eligibility for Returns */}
        <section className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <Package className="w-8 h-8 text-[#8b7355] flex-shrink-0" />
            <h2 className="text-2xl font-semibold text-[#4a4a4a]">
              Eligibility for Returns
            </h2>
          </div>
          <p className="text-[#6b6b6b] mb-4">
            We accept returns within <strong>10 days</strong> of delivery. To be
            eligible for a return, items must meet the following conditions:
          </p>
          <ul className="space-y-3 text-[#6b6b6b] ml-6">
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] font-bold mt-1">•</span>
              <span>
                Item must be <strong>unused and unworn</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] font-bold mt-1">•</span>
              <span>
                All original tags, labels, and packaging must be intact
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] font-bold mt-1">•</span>
              <span>
                Product should be in its original condition with no signs of
                wear or damage
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] font-bold mt-1">•</span>
              <span>
                Proof of purchase (order number or invoice) is required
              </span>
            </li>
          </ul>
        </section>

        {/* Non-returnable Items */}
        <section className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="w-8 h-8 text-[#c17a5b] flex-shrink-0" />
            <h2 className="text-2xl font-semibold text-[#4a4a4a]">
              Non-Returnable Items
            </h2>
          </div>
          <p className="text-[#6b6b6b] mb-4">
            For hygiene and quality reasons, the following items cannot be
            returned:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[#faf8f6] p-4 rounded-lg border border-[#e8e2db]">
              <h3 className="font-semibold text-[#4a4a4a] mb-2">
                Hygiene Products
              </h3>
              <p className="text-sm text-[#6b6b6b]">
                Undergarments, swimwear, beauty products, and personal care
                items
              </p>
            </div>
            <div className="bg-[#faf8f6] p-4 rounded-lg border border-[#e8e2db]">
              <h3 className="font-semibold text-[#4a4a4a] mb-2">
                Customized Items
              </h3>
              <p className="text-sm text-[#6b6b6b]">
                Personalized or made-to-order products
              </p>
            </div>
            <div className="bg-[#faf8f6] p-4 rounded-lg border border-[#e8e2db]">
              <h3 className="font-semibold text-[#4a4a4a] mb-2">
                Digital Products
              </h3>
              <p className="text-sm text-[#6b6b6b]">
                Gift cards, downloadable content, or digital subscriptions
              </p>
            </div>
            <div className="bg-[#faf8f6] p-4 rounded-lg border border-[#e8e2db]">
              <h3 className="font-semibold text-[#4a4a4a] mb-2">
                Final Sale Items
              </h3>
              <p className="text-sm text-[#6b6b6b]">
                Products marked as clearance or final sale
              </p>
            </div>
          </div>
        </section>

        {/* Refund Process */}
        <section className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <RefreshCw className="w-8 h-8 text-[#8b7355] flex-shrink-0" />
            <h2 className="text-2xl font-semibold text-[#4a4a4a]">
              How Refunds Work
            </h2>
          </div>
          <p className="text-[#6b6b6b] mb-6">
            Once we receive and inspect your returned item, we'll process your
            refund. Here's what to expect:
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#8b7355] text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-[#4a4a4a] mb-2">
                  Initiate Return Request
                </h3>
                <p className="text-[#6b6b6b]">
                  Contact our support team with your order number and reason for
                  return
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#8b7355] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-[#4a4a4a] mb-2">
                  Ship the Item Back
                </h3>
                <p className="text-[#6b6b6b]">
                  Pack the item securely and send it to our returns address
                  (we'll provide pickup or shipping details)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#8b7355] text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-[#4a4a4a] mb-2">
                  Inspection & Approval
                </h3>
                <p className="text-[#6b6b6b]">
                  We'll inspect the item within 2-3 business days of receiving
                  it
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#8b7355] text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-[#4a4a4a] mb-2">
                  Refund Processed
                </h3>
                <p className="text-[#6b6b6b]">
                  Your refund will be processed within{" "}
                  <strong>5-7 business days</strong> to your original payment
                  method
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#faf8f6] p-4 rounded-lg border border-[#e8e2db]">
            <p className="text-sm text-[#6b6b6b]">
              <strong>Note:</strong> Depending on your bank or card issuer, it
              may take an additional 2-5 business days for the refund to appear
              in your account.
            </p>
          </div>
        </section>

        {/* Exchange Policy */}
        <section className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <RefreshCw className="w-8 h-8 text-[#8b7355] flex-shrink-0" />
            <h2 className="text-2xl font-semibold text-[#4a4a4a]">
              Exchange Policy
            </h2>
          </div>
          <p className="text-[#6b6b6b] mb-4">
            We're happy to exchange items in the following situations:
          </p>
          <ul className="space-y-3 text-[#6b6b6b] ml-6 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] font-bold mt-1">•</span>
              <span>
                <strong>Defective or damaged items:</strong> We'll replace them
                at no extra cost
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] font-bold mt-1">•</span>
              <span>
                <strong>Wrong size or color:</strong> Exchange for the correct
                variant (subject to availability)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] font-bold mt-1">•</span>
              <span>
                <strong>Incorrect item shipped:</strong> We'll send the right
                product immediately
              </span>
            </li>
          </ul>
          <p className="text-[#6b6b6b]">
            Exchanges follow the same timeline as returns. If the replacement
            item is unavailable, we'll process a full refund instead.
          </p>
        </section>

        {/* Return Pickup & Shipping */}
        <section className="p-8 mb-8 bg-white rounded-lg shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <Truck className="w-8 h-8 text-[#8b7355] flex-shrink-0" />
            <h2 className="text-2xl font-semibold text-[#4a4a4a]">
              Return Pickup & Shipping
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-[#e8f5e9] border-l-4 border-[#66bb6a] p-4 rounded-r-lg">
              <h3 className="font-semibold text-[#2e7d32] mb-2">
                Free Reverse Pickup
              </h3>
              <p className="text-[#6b6b6b]">
                For most locations, we offer{" "}
                <strong>free reverse pickup</strong> for returns. Our courier
                partner will collect the package from your address at a
                scheduled time.
              </p>
            </div>

            <div className="bg-[#fff8e1] border-l-4 border-[#ffa726] p-4 rounded-r-lg">
              <h3 className="font-semibold text-[#e65100] mb-2">
                Self-Ship Option
              </h3>
              <p className="text-[#6b6b6b]">
                If pickup service is unavailable in your area, you can ship the
                item back to us. In this case, shipping charges may apply unless
                the return is due to a defect or error on our part.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="mb-6 text-2xl font-semibold">
            Need Help with Your Return?
          </h2>
          <p className="mb-6 text-[#f5f1ed]">
            Our customer support team is here to assist you. Reach out to us
            through any of the following channels:
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Mail className="flex-shrink-0 w-6 h-6 mt-1" />
              <div>
                <h3 className="mb-1 font-semibold">Email</h3>
                <p className="text-[#f5f1ed] text-sm">care@ciyatake.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="flex-shrink-0 w-6 h-6 mt-1" />
              <div>
                <h3 className="mb-1 font-semibold">Phone</h3>
                <p className="text-[#f5f1ed] text-sm">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="flex-shrink-0 w-6 h-6 mt-1" />
              <div>
                <h3 className="mb-1 font-semibold">Working Hours</h3>
                <p className="text-[#f5f1ed] text-sm">
                  Mon-Sat: 9:00 AM - 6:00 PM IST
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Update Note */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-[#e8e2db]">
          <p className="text-sm text-[#6b6b6b] text-center">
            <strong>Policy Updates:</strong> We reserve the right to update this
            Returns & Refund Policy at any time. Changes will be effective
            immediately upon posting on our website. Last updated: October 2025.
          </p>
        </section>

        {/* CTA Button */}
        <div className="text-center">
          <button className="bg-[#8b7355] hover:bg-[#6b5847] text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
            Start a Return Request
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#4a4a4a] text-[#d4cec7] py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
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

export default RefundPolicy;
