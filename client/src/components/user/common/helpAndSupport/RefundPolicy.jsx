 
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Info, Calendar, Shield, ArrowLeft, DollarSign, TrendingUp, FileText, Mail, Phone, Wallet, Building, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  const lastUpdated = "October 19, 2025";
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const refundEligibility = [
    {
      icon: CheckCircle,
      title: "Return Approved",
      description: "Item passed quality inspection",
      color: "green"
    },
    {
      icon: CheckCircle,
      title: "Within Timeframe",
      description: "Return initiated within 7 days",
      color: "green"
    },
    {
      icon: CheckCircle,
      title: "Original Condition",
      description: "Item unused with tags attached",
      color: "green"
    },
    {
      icon: CheckCircle,
      title: "Valid Documentation",
      description: "Original invoice provided",
      color: "green"
    }
  ];

  const refundTimeline = [
    {
      step: 1,
      title: "Return Received",
      description: "We receive your returned item at our warehouse",
      duration: "Day 0",
      icon: FileText
    },
    {
      step: 2,
      title: "Quality Inspection",
      description: "Our team inspects the item for eligibility",
      duration: "Day 1-3",
      icon: Shield
    },
    {
      step: 3,
      title: "Refund Approval",
      description: "Return approved and refund initiated",
      duration: "Day 4-5",
      icon: CheckCircle
    },
    {
      step: 4,
      title: "Processing",
      description: "Refund processed to your payment method",
      duration: "Day 5-7",
      icon: CreditCard
    },
    {
      step: 5,
      title: "Credit Received",
      description: "Amount credited to your account",
      duration: "Day 7-10",
      icon: TrendingUp
    }
  ];

  const paymentMethodTimeline = [
    {
      method: "Credit Card",
      timeline: "7-10 business days",
      details: "Refund appears on your card statement",
      icon: CreditCard
    },
    {
      method: "Debit Card",
      timeline: "7-10 business days",
      details: "Amount credited to your bank account",
      icon: CreditCard
    },
    {
      method: "Net Banking",
      timeline: "7-10 business days",
      details: "Direct credit to your bank account",
      icon: Building
    },
    {
      method: "UPI",
      timeline: "5-7 business days",
      details: "Credited to linked UPI account",
      icon: Smartphone
    },
    {
      method: "Digital Wallet",
      timeline: "3-5 business days",
      details: "Fastest refund method available",
      icon: Wallet
    },
    {
      method: "Cash on Delivery",
      timeline: "10-14 business days",
      details: "Bank transfer (account details required)",
      icon: DollarSign
    }
  ];

  const refundScenarios = [
    {
      scenario: "Full Refund",
      description: "You receive 100% of the product price",
      conditions: [
        "Defective or damaged item",
        "Wrong item delivered",
        "Item not as described",
        "Size/color mismatch (our error)"
      ],
      icon: CheckCircle,
      color: "green"
    },
    {
      scenario: "Partial Refund",
      description: "Refund minus return shipping cost",
      conditions: [
        "Change of mind",
        "Size/fit issues (customer preference)",
        "Color preference changed",
        "Item no longer needed"
      ],
      icon: AlertCircle,
      color: "yellow"
    },
    {
      scenario: "No Refund",
      description: "Return not eligible for refund",
      conditions: [
        "Item returned after 7 days",
        "Item used, worn, or washed",
        "Tags removed or damaged",
        "Non-returnable category (lingerie, sale items)"
      ],
      icon: XCircle,
      color: "red"
    }
  ];

  const refundExclusions = [
    {
      item: "Shipping Charges",
      description: "Original shipping fee is non-refundable (unless our error)",
      icon: XCircle
    },
    {
      item: "Return Shipping",
      description: "Customer pays return shipping for change of mind returns",
      icon: XCircle
    },
    {
      item: "Gift Wrapping",
      description: "Gift wrapping charges are non-refundable",
      icon: XCircle
    },
    {
      item: "COD Charges",
      description: "Cash on delivery convenience fee is non-refundable",
      icon: XCircle
    }
  ];

  const partialRefundCalculation = [
    {
      description: "Product Price",
      amount: "₹2,000",
      color: "text-green-600"
    },
    {
      description: "Return Shipping (if applicable)",
      amount: "- ₹100",
      color: "text-red-600"
    },
    {
      description: "Refund Amount",
      amount: "₹1,900",
      color: "text-[#8b7355] font-bold"
    }
  ];

  const faqs = [
    {
      question: "When will I receive my refund?",
      answer: "Once your return is approved, refunds are processed within 7-10 business days depending on your payment method..."
    },
    {
      question: "Will I get a full refund?",
      answer: "Full refunds are issued for defective items, wrong deliveries, or errors on our part..."
    },
    {
      question: "How will I receive my refund for Cash on Delivery orders?",
      answer: "For COD orders, we process refunds via bank transfer. You’ll need to provide your bank details..."
    },
    {
      question: "Can I get store credit instead of a refund?",
      answer: "Yes! If you prefer store credit instead of a refund, please mention this when initiating your return."
    },
    {
      question: "What if my refund is taking longer than expected?",
      answer: "Refund timelines start from when we process the refund, not when you ship the item."
    },
    {
      question: "Are original shipping charges refundable?",
      answer: "Original shipping charges are only refunded if the return is due to our error."
    },
    {
      question: "What happens if my refund amount seems incorrect?",
      answer: "If you believe there's an error, contact us — we’ll provide a detailed refund breakdown."
    },
    {
      question: "Can I get a refund if I used a discount code?",
      answer: "Yes, refunds are based on the discounted price paid. Discount codes cannot be reused."
    },
    {
      question: "What if I paid using multiple payment methods?",
      answer: "Refunds are split proportionally across payment methods."
    },
    {
      question: "Do you offer instant refunds?",
      answer: "Not currently — refunds are processed after item inspection."
    },
    {
      question: "What happens to my gift card or promo balance?",
      answer: "Gift card portions are refunded as store credit; other amounts go back to original method."
    },
    {
      question: "Can I cancel my return and keep the refund?",
      answer: "No, once processed, refunds cannot be reversed."
    }
  ];

  const refundStatuses = [
    { status: "Return Initiated", description: "You've requested a return and received authorization", color: "bg-blue-100 text-blue-800" },
    { status: "Item Shipped Back", description: "Item is in transit to our warehouse", color: "bg-purple-100 text-purple-800" },
    { status: "Return Received", description: "We've received your return at our warehouse", color: "bg-orange-100 text-orange-800" },
    { status: "Under Inspection", description: "Our team is inspecting the returned item", color: "bg-yellow-100 text-yellow-800" },
    { status: "Return Approved", description: "Item passed inspection, refund being processed", color: "bg-green-100 text-green-800" },
    { status: "Refund Processed", description: "Refund has been sent to your payment method", color: "bg-teal-100 text-teal-800" },
    { status: "Refund Completed", description: "Amount credited to your account", color: "bg-green-100 text-green-800" }
  ];

  return (
     <div className="min-h-screen bg-[#f5f1ed]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CreditCard className="w-16 h-16" />
          </div>
          <h1 className="mb-4 text-5xl font-bold">Refund Policy</h1>
          <p className="mb-4 text-xl opacity-90">
            Clear, transparent, and hassle-free refunds. Your satisfaction is our priority at Ciyatake.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm opacity-80">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 py-12 -mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <Clock className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">7-10 Days</h3>
              <p className="text-[#8b7355]">Average refund processing time</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <Shield className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">100% Secure</h3>
              <p className="text-[#8b7355]">Safe and encrypted transactions</p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <CheckCircle className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Fair Process</h3>
              <p className="text-[#8b7355]">Transparent refund calculations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Eligibility */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-4">Refund Eligibility</h2>
          <p className="text-center text-[#8b7355] mb-12">
            Your return must meet these criteria to qualify for a refund:
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {refundEligibility.map((item, index) => (
              <div key={index} className="bg-[#f5f1ed] p-6 rounded-lg text-center">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold text-[#6b5847] mb-2">{item.title}</h3>
                <p className="text-sm text-[#8b7355]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Timeline */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">Refund Process Timeline</h2>
          <div className="space-y-6">
            {refundTimeline.map((step, index) => (
              <div key={index} className="relative flex items-start gap-6 p-6 bg-white rounded-lg shadow-sm">
                {index < refundTimeline.length - 1 && (
                  <div className="absolute left-11 top-20 w-0.5 h-12 bg-[#8b7355] opacity-30"></div>
                )}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-[#8b7355] text-white flex items-center justify-center">
                    <step.icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-[#6b5847]">{step.title}</h3>
                    <span className="text-sm font-semibold text-[#8b7355] bg-[#f5f1ed] px-3 py-1 rounded-full">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-[#8b7355]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Method Timeline */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-4">Refund Timeline by Payment Method</h2>
          <p className="text-center text-[#8b7355] mb-12">
            Processing times vary based on how you paid for your order:
          </p>
          <div className="space-y-4">
            {paymentMethodTimeline.map((payment, index) => (
              <div key={index} className="bg-[#f5f1ed] p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center flex-1 gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <payment.icon className="w-8 h-8 text-[#8b7355]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#6b5847] mb-1">{payment.method}</h3>
                    <p className="text-sm text-[#8b7355]">{payment.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[#8b7355] font-semibold">{payment.timeline}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 mt-8 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-start gap-4">
              <Info className="flex-shrink-0 w-6 h-6 mt-1 text-blue-600" />
              <div>
                <p className="text-[#6b5847] font-semibold mb-2">Important Note:</p>
                <p className="text-[#8b7355]">
                  The timeline mentioned above is from when we process your refund on our end. Your bank or payment provider may take additional time (2-5 business days) to credit the amount to your account. If you don't see the refund after the mentioned timeline, please contact your bank or payment provider first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Scenarios */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">Refund Scenarios</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {refundScenarios.map((scenario, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                <div className={`inline-block p-3 rounded-lg mb-4 ${
                  scenario.color === 'green' ? 'bg-green-100' :
                  scenario.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <scenario.icon className={`w-8 h-8 ${
                    scenario.color === 'green' ? 'text-green-600' :
                    scenario.color === 'yellow' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-[#6b5847] mb-2">{scenario.scenario}</h3>
                <p className="text-[#8b7355] mb-4">{scenario.description}</p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-[#6b5847] mb-2">Conditions:</p>
                  <ul className="space-y-2">
                    {scenario.conditions.map((condition, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#8b7355] mt-1">•</span>
                        <span className="text-sm text-[#8b7355]">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partial Refund Calculation Example */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-4">Understanding Partial Refunds</h2>
          <p className="text-center text-[#8b7355] mb-12">
            Here's an example of how we calculate partial refunds for customer-initiated returns:
          </p>
          <div className="bg-[#f5f1ed] p-8 rounded-lg max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-[#6b5847] mb-6 text-center">Sample Calculation</h3>
            <div className="space-y-4">
              {partialRefundCalculation.map((item, index) => (
                <div key={index} className={`flex justify-between items-center ${
                  index === partialRefundCalculation.length - 1 ? 'border-t-2 border-[#8b7355] pt-4 mt-4' : ''
                }`}>
                  <span className="text-[#6b5847]">{item.description}</span>
                  <span className={`font-semibold ${item.color}`}>{item.amount}</span>
                </div>
              ))}
            </div>
            <div className="p-4 mt-6 bg-white rounded-lg">
              <p className="text-sm text-[#8b7355]">
                <span className="font-semibold text-[#6b5847]">Note:</span> Return shipping charges are waived for defective items, wrong deliveries, or our errors. You receive a full refund in such cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Exclusions */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-4">Non-Refundable Charges</h2>
          <p className="text-center text-[#8b7355] mb-12">
            The following charges are non-refundable (unless the return is due to our error):
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {refundExclusions.map((exclusion, index) => (
              <div key={index} className="p-6 bg-white border-l-4 border-red-500 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <exclusion.icon className="flex-shrink-0 w-6 h-6 mt-1 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#6b5847] mb-2">{exclusion.item}</h3>
                    <p className="text-[#8b7355]">{exclusion.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Status Tracker */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-4">Track Your Refund Status</h2>
          <p className="text-center text-[#8b7355] mb-12">
            Understand what each status means in your refund journey:
          </p>
          <div className="space-y-4">
            {refundStatuses.map((status, index) => (
              <div key={index} className="bg-[#f5f1ed] p-6 rounded-lg flex items-start gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}>
                  {status.status}
                </span>
                <p className="text-[#8b7355] flex-1">{status.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/track-order"
              className="inline-flex items-center gap-2 bg-[#8b7355] text-white px-8 py-3 rounded-lg hover:bg-[#6b5847] transition-colors font-semibold"
            >
              <FileText className="w-5 h-5" />
              Track Your Refund
            </Link>
          </div>
        </div>
      </section>

      {/* Special Refund Cases */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">Special Refund Cases</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-8 bg-white rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-8 h-8 text-[#8b7355]" />
                <h3 className="text-xl font-semibold text-[#6b5847]">Store Credit Option</h3>
              </div>
              <p className="text-[#8b7355] mb-4">
                Prefer store credit instead of a refund? We offer instant store credit that:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Is issued immediately upon return approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Never expires</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Can be used for any future purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Includes full order value (no deductions)</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-[#8b7355]" />
                <h3 className="text-xl font-semibold text-[#6b5847]">COD Refunds</h3>
              </div>
              <p className="text-[#8b7355] mb-4">
                For Cash on Delivery orders, refunds are processed via bank transfer:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Provide bank account details to customer service</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">We verify your account information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Bank transfer initiated after approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Refund credited in 10-14 business days</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-8 h-8 text-[#8b7355]" />
                <h3 className="text-xl font-semibold text-[#6b5847]">Split Payment Refunds</h3>
              </div>
              <p className="text-[#8b7355] mb-4">
                Used multiple payment methods? Refunds are split proportionally:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Each payment method receives its proportional share</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Gift cards refunded as store credit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Promotional balances restored to account</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Transparent breakdown provided</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-white rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-[#8b7355]" />
                <h3 className="text-xl font-semibold text-[#6b5847]">Defective Item Refunds</h3>
              </div>
              <p className="text-[#8b7355] mb-4">
                Received a defective item? We make it right with priority refunds:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">100% full refund including all charges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Free return pickup arranged</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Expedited refund processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-green-600" />
                  <span className="text-[#8b7355]">Additional compensation for inconvenience</span>
                </li>
              </ul>
            </div>
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
            <h2 className="mb-4 text-3xl font-bold text-center">Questions About Your Refund?</h2>
            <p className="mb-8 text-center opacity-90">
              Our dedicated support team is ready to help you with any refund-related queries.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2 font-semibold">Email Support</h3>
                <a href="mailto:refunds@ciyatake.com" className="text-sm opacity-90 hover:opacity-100">
                  refunds@ciyatake.com
                </a>
              </div>
              <div className="p-6 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2 font-semibold">Phone Support</h3>
                <a href="tel:+919876543210" className="text-sm opacity-90 hover:opacity-100">
                  +91 98765 43210
                </a>
              </div>
              <div className="p-6 text-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Clock className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2 font-semibold">Available</h3>
                <p className="text-sm opacity-90">Mon-Sat, 9 AM - 6 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 border-2 border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-start gap-4">
              <Info className="flex-shrink-0 w-8 h-8 mt-1 text-yellow-600" />
              <div>
                <h3 className="text-xl font-bold text-[#6b5847] mb-4">Important Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      Refunds are only processed after the returned item passes our quality inspection and meets all eligibility criteria.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      The refund timeline begins from when we process the refund, not when you ship the item or when we receive it.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      Your bank or payment provider may take additional 2-5 business days beyond our processing time to credit your account.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      If you don't see your refund within the stated timeline, please check with your bank first before contacting us.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      Refund amounts may differ from the order total if shipping charges, return shipping costs, or other non-refundable fees apply.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      Gift cards, promotional balances, and discount codes used in the original purchase will be refunded as store credit only.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-yellow-600">•</span>
                    <span className="text-[#8b7355]">
                      We reserve the right to refuse refunds for returns that don't meet our policy criteria or show signs of wear/use.
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
            This Refund Policy is part of our Terms of Service and is subject to change. We will notify customers of significant policy updates.
          </p>
          <p className="text-[#8b7355] text-xs">
            © {new Date().getFullYear()} Ciyatake. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
