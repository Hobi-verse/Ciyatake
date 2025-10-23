 
import { Package, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, Info, Calendar, Shield, ArrowLeft, Truck, CreditCard, FileText, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
  const lastUpdated = "October 19, 2025";
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const returnReasons = [
    {
      icon: Package,
      title: "Wrong Item Received",
      description: "Received a different product than ordered"
    },
    {
      icon: AlertCircle,
      title: "Defective/Damaged",
      description: "Product arrived damaged or with defects"
    },
    {
      icon: CheckCircle,
      title: "Size/Fit Issues",
      description: "Item doesn't fit as expected"
    },
    {
      icon: XCircle,
      title: "Quality Concerns",
      description: "Product quality doesn't meet expectations"
    }
  ];

  const returnSteps = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Contact us within 7 days of delivery via email or phone",
      icon: Mail
    },
    {
      step: 2,
      title: "Get Approval",
      description: "Receive return authorization and shipping instructions",
      icon: CheckCircle
    },
    {
      step: 3,
      title: "Pack & Ship",
      description: "Securely pack the item with original tags and invoice",
      icon: Package
    },
    {
      step: 4,
      title: "Quality Check",
      description: "We inspect the returned item within 3-5 business days",
      icon: Shield
    },
    {
      step: 5,
      title: "Refund Processed",
      description: "Refund initiated to original payment method",
      icon: CreditCard
    }
  ];

  const eligibilityCriteria = [
    {
      icon: CheckCircle,
      text: "Item must be unused, unworn, and unwashed",
      allowed: true
    },
    {
      icon: CheckCircle,
      text: "Original tags and labels must be attached",
      allowed: true
    },
    {
      icon: CheckCircle,
      text: "Item must be in original packaging",
      allowed: true
    },
    {
      icon: CheckCircle,
      text: "Return initiated within 7 days of delivery",
      allowed: true
    },
    {
      icon: CheckCircle,
      text: "Original invoice/receipt must be included",
      allowed: true
    }
  ];

  const nonReturnableItems = [
    {
      icon: XCircle,
      text: "Intimate wear, lingerie, and swimwear",
      reason: "For hygiene reasons"
    },
    {
      icon: XCircle,
      text: "Personalized or customized items",
      reason: "Made specifically for you"
    },
    {
      icon: XCircle,
      text: "Items marked as 'Final Sale'",
      reason: "Clearance products"
    },
    {
      icon: XCircle,
      text: "Gift cards and vouchers",
      reason: "Non-returnable by nature"
    },
    {
      icon: XCircle,
      text: "Items without original tags",
      reason: "Cannot verify authenticity"
    },
    {
      icon: XCircle,
      text: "Sale items purchased at 50% off or more",
      reason: "Final sale clearance"
    }
  ];

  const faqs = [
    {
      question: "How long do I have to return an item?",
      answer: "You have 7 days from the date of delivery to initiate a return. Please ensure you contact us within this timeframe to be eligible for a return."
    },
    {
      question: "Do I need to pay for return shipping?",
      answer: "Return shipping costs depend on the reason for return. If the item is defective or we sent the wrong item, we'll cover the shipping. For other returns like size/fit issues, customers are responsible for return shipping costs."
    },
    {
      question: "How long does the refund process take?",
      answer: "Once we receive your returned item, we'll inspect it within 3-5 business days. After approval, refunds are processed to your original payment method within 7-10 business days. Bank processing times may vary."
    },
    {
      question: "Can I exchange an item instead of returning it?",
      answer: "Yes! If you'd like a different size or color, please mention this when initiating your return. We'll process an exchange once we receive and approve your returned item. Subject to availability."
    },
    {
      question: "What if I received a damaged or defective item?",
      answer: "We sincerely apologize! Please contact us immediately with photos of the damaged item and packaging. We'll arrange a free pickup and send you a replacement or process a full refund including shipping costs."
    },
    {
      question: "Can I return items purchased during a sale?",
      answer: "Items purchased at a discount of less than 50% are eligible for return following our standard policy. However, items marked as 'Final Sale' or purchased at 50% off or more cannot be returned."
    },
    {
      question: "What if I've lost my invoice?",
      answer: "Don't worry! Contact our customer service team with your order number or the email address used for purchase. We can provide a copy of your invoice for the return process."
    },
    {
      question: "Can I return items to a physical store?",
      answer: "Currently, all returns must be shipped back to our warehouse. We do not accept in-store returns at this time. Please follow our online return process for all purchases."
    },
    {
      question: "What happens if my return is not approved?",
      answer: "If a return doesn't meet our eligibility criteria, we'll contact you with details and photos. You can choose to have the item shipped back to you (shipping costs apply) or donate it on your behalf."
    },
    {
      question: "How will I know when my refund is processed?",
      answer: "You'll receive an email notification once your return is received, inspected, and approved. Another email will be sent when the refund is processed. You can also check your order status in your account."
    }
  ];

  const refundTimeline = [
    {
      method: "Credit/Debit Card",
      timeline: "7-10 business days",
      icon: CreditCard
    },
    {
      method: "Net Banking",
      timeline: "7-10 business days",
      icon: CreditCard
    },
    {
      method: "UPI",
      timeline: "5-7 business days",
      icon: CreditCard
    },
    {
      method: "Wallet",
      timeline: "3-5 business days",
      icon: CreditCard
    },
    {
      method: "Cash on Delivery",
      timeline: "10-14 business days (Bank Transfer)",
      icon: CreditCard
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <RefreshCw className="w-16 h-16" />
          </div>
          <h1 className="mb-4 text-5xl font-bold">Return Policy</h1>
          <p className="mb-4 text-xl opacity-90">
            We want you to love your Ciyatake purchase. If you're not completely satisfied, we're here to help with easy returns and refunds.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm opacity-80">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Quick Summary Cards */}
      <section className="px-4 py-12 -mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <Clock className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">7 Days Return</h3>
              <p className="text-[#8b7355]">Easy returns within 7 days of delivery</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <Shield className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Quality Guaranteed</h3>
              <p className="text-[#8b7355]">100% refund for defective items</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <CreditCard className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Fast Refunds</h3>
              <p className="text-[#8b7355]">Refunds processed within 7-10 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Return Reasons */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">Valid Reasons for Return</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {returnReasons.map((reason, index) => (
              <div key={index} className="bg-[#f5f1ed] p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <reason.icon className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#6b5847] mb-2">{reason.title}</h3>
                <p className="text-sm text-[#8b7355]">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       How to Return - Step by Step 
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">How to Return Your Order</h2>
          <div className="space-y-6">
            {returnSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-6 p-6 bg-white rounded-lg shadow-sm">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-[#8b7355] text-white flex items-center justify-center text-2xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="w-6 h-6 text-[#8b7355]" />
                    <h3 className="text-xl font-semibold text-[#6b5847]">{step.title}</h3>
                  </div>
                  <p className="text-[#8b7355]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-4">Return Eligibility Criteria</h2>
          <p className="text-center text-[#8b7355] mb-12">
            To be eligible for a return, your item must meet the following conditions:
          </p>
          <div className="bg-[#f5f1ed] p-8 rounded-lg">
            <div className="space-y-4">
              {eligibilityCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start gap-4">
                  <criteria.icon className="flex-shrink-0 w-6 h-6 mt-1 text-green-600" />
                  <p className="text-[#6b5847] text-lg">{criteria.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Non-Returnable Items */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-4">Non-Returnable Items</h2>
          <p className="text-center text-[#8b7355] mb-12">
            For hygiene, safety, and quality reasons, the following items cannot be returned:
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {nonReturnableItems.map((item, index) => (
              <div key={index} className="p-6 bg-white border-l-4 border-red-500 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <item.icon className="flex-shrink-0 w-6 h-6 mt-1 text-red-500" />
                  <div>
                    <p className="text-[#6b5847] font-semibold mb-1">{item.text}</p>
                    <p className="text-sm text-[#8b7355]">{item.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Timeline */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-4">Refund Timeline</h2>
          <p className="text-center text-[#8b7355] mb-12">
            Refund processing times vary based on your payment method:
          </p>
          <div className="space-y-4">
            {refundTimeline.map((refund, index) => (
              <div key={index} className="bg-[#f5f1ed] p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <refund.icon className="w-8 h-8 text-[#8b7355]" />
                  <span className="text-lg font-semibold text-[#6b5847]">{refund.method}</span>
                </div>
                <span className="text-[#8b7355] font-medium">{refund.timeline}</span>
              </div>
            ))}
          </div>
          <div className="p-6 mt-8 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-start gap-4">
              <Info className="flex-shrink-0 w-6 h-6 mt-1 text-blue-600" />
              <div>
                <p className="text-[#6b5847] font-semibold mb-2">Important Note:</p>
                <p className="text-[#8b7355]">
                  The timeline mentioned is from when we process your refund. Your bank or payment provider may take additional time to credit the amount to your account. Please check with them if you don't see the refund after the mentioned timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exchanges */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <div className="flex items-start gap-6">
              <div className="bg-[#f5f1ed] p-4 rounded-lg">
                <RefreshCw className="w-12 h-12 text-[#8b7355]" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#6b5847] mb-4">Exchanges</h2>
                <p className="text-[#8b7355] mb-4">
                  We're happy to exchange items for a different size or color! Here's how it works:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
                    <span className="text-[#6b5847]">Mention "Exchange" when initiating your return request</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
                    <span className="text-[#6b5847]">Specify the size/color you'd like instead</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
                    <span className="text-[#6b5847]">Ship the original item back to us</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
                    <span className="text-[#6b5847]">Once approved, we'll ship the replacement item (subject to availability)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
                    <span className="text-[#6b5847]">No additional shipping charges if exchanging same-priced item</span>
                  </li>
                </ul>
                <div className="mt-6 bg-[#f5f1ed] p-4 rounded-lg">
                  <p className="text-[#6b5847] text-sm">
                    <span className="font-semibold">Note:</span> If the item you want to exchange for is out of stock, we'll issue a full refund or you can choose a different item of equal or lesser value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Damaged or Defective Items */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 border-2 border-red-200 rounded-lg bg-gradient-to-br from-red-50 to-orange-50">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white rounded-lg">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#6b5847] mb-4">Damaged or Defective Items</h2>
                <p className="text-[#8b7355] mb-6">
                  We sincerely apologize if you received a damaged or defective item. We take full responsibility and will make it right immediately.
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg">
                    <h3 className="font-semibold text-[#6b5847] mb-2">What to do:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-[#8b7355]">
                      <li>Contact us within 48 hours of delivery</li>
                      <li>Provide clear photos of the damaged/defective item and packaging</li>
                      <li>Include your order number in the message</li>
                    </ol>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <h3 className="font-semibold text-[#6b5847] mb-2">What we'll do:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                        <span className="text-[#8b7355]">Arrange free pickup from your location</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                        <span className="text-[#8b7355]">Send a replacement immediately (if available)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                        <span className="text-[#8b7355]">Process full refund including shipping charges</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                        <span className="text-[#8b7355]">Provide compensation for the inconvenience</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Shipping */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">Return Shipping Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-8 h-8 text-[#8b7355]" />
                <h3 className="text-xl font-semibold text-[#6b5847]">Free Return Pickup</h3>
              </div>
              <p className="text-[#8b7355] mb-4">Available when:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#8b7355] font-bold">•</span>
                  <span className="text-[#8b7355]">Item is defective or damaged</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8b7355] font-bold">•</span>
                  <span className="text-[#8b7355]">Wrong item was delivered</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8b7355] font-bold">•</span>
                  <span className="text-[#8b7355]">Item doesn't match description</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-8 h-8 text-[#8b7355]" />
                <h3 className="text-xl font-semibold text-[#6b5847]">Customer Paid Shipping</h3>
              </div>
              <p className="text-[#8b7355] mb-4">Applies when:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#8b7355] font-bold">•</span>
                  <span className="text-[#8b7355]">Size or fit doesn't work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8b7355] font-bold">•</span>
                  <span className="text-[#8b7355]">Change of mind</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8b7355] font-bold">•</span>
                  <span className="text-[#8b7355]">Color preference changed</span>
                </li>
              </ul>
              <p className="text-sm text-[#8b7355] mt-4">
                Estimated cost: ₹50-150 depending on location
              </p>
            </div>
          </div>
          <div className="mt-8 bg-[#f5f1ed] p-6 rounded-lg">
            <h3 className="font-semibold text-[#6b5847] mb-3">Packing Instructions:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
                <span className="text-[#8b7355]">Use original packaging when possible</span>
              </li>
              <li className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
                <span className="text-[#8b7355]">Ensure all tags are still attached</span>
              </li>
              <li className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
                <span className="text-[#8b7355]">Include the original invoice</span>
              </li>
              <li className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-1" />
                <span className="text-[#8b7355]">Seal the package securely to prevent damage during transit</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#f5f1ed] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#ebe5dd] transition-colors"
                >
                  <span className="font-semibold text-[#6b5847] pr-4">{faq.question}</span>
                  <span className="text-[#8b7355] text-2xl flex-shrink-0">
                    {expandedFaq === index ? '−' : '+'}
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-[#8b7355] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white p-8 rounded-lg">
            <h2 className="mb-4 text-3xl font-bold text-center">Need Help with a Return?</h2>
            <p className="mb-8 text-center opacity-90">
              Our customer service team is here to assist you with any questions about returns and refunds.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2 font-semibold">Email Us</h3>
                <a href="mailto:care@ciyatake.com" className="text-sm opacity-90 hover:opacity-100">
                  care@ciyatake.com
                </a>
              </div>
              <div className="p-6 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2 font-semibold">Call Us</h3>
                <a href="tel:+919876543210" className="text-sm opacity-90 hover:opacity-100">
                  +91 98765 43210
                </a>
              </div>
              <div className="p-6 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Clock className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2 font-semibold">Business Hours</h3>
                <p className="text-sm opacity-90">Mon-Sat, 9 AM - 6 PM IST</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/track-order"
                className="inline-flex items-center gap-2 bg-white text-[#6b5847] px-8 py-3 rounded-lg hover:bg-[#f5f1ed] transition-colors font-semibold"
              >
                <FileText className="w-5 h-5" />
                Track Your Return
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 border-2 border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-start gap-4">
              <Info className="flex-shrink-0 w-8 h-8 mt-1 text-yellow-600" />
              <div>
                <h3 className="text-xl font-bold text-[#6b5847] mb-4">Important Notes</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      Return requests must be initiated within 7 days of delivery. Requests after this period will not be accepted.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      All returns are subject to quality inspection. Items that don't meet eligibility criteria will be returned to the customer.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      Shipping charges are non-refundable unless the return is due to our error (wrong item, defective, etc.).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      For COD orders, please provide your bank account details for refund processing.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      Gift cards and promotional discounts used in the original purchase will be refunded as store credit.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="px-4 py-8 bg-[#f5f1ed]">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#8b7355] hover:text-[#6b5847] transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </section>

      {/* Footer Note */}
      <section className="px-4 py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8b7355] text-sm mb-2">
            This Return & Refund Policy is subject to change. We will notify you of any significant changes.
          </p>
          <p className="text-[#8b7355] text-xs">
            © {new Date().getFullYear()} Ciyatake. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ReturnPolicy;
