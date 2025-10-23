import { useState } from 'react';
import { Package, Truck, MapPin, Clock, IndianRupee, AlertCircle, CheckCircle, Globe, Calendar, Shield, RefreshCw, Phone, Menu, X } from 'lucide-react';

const ShippingPolicy = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastUpdated = "October 19, 2025";

  const sections = [
    {
      id: 1,
      icon: Package,
      title: "Shipping Overview",
      content: `At Ciyatake, we strive to deliver your fashion essentials promptly and safely to your doorstep. Our shipping policy outlines the processes, timelines, and terms related to the delivery of your orders.

**Our Commitment:**
- Fast and reliable delivery across India
- Secure packaging to protect your items
- Real-time tracking for all orders
- Multiple shipping options to suit your needs
- Dedicated customer support for shipping queries

**Coverage:**
We currently ship to all serviceable locations across India. International shipping is not available at this time but may be introduced in the future.

**Order Processing:**
Orders are typically processed within 1-2 business days (excluding weekends and public holidays). You will receive an order confirmation email once your order is successfully placed, followed by a shipping confirmation with tracking details once your order is dispatched.`
    },
    {
      id: 2,
      icon: MapPin,
      title: "Shipping Locations",
      content: `We deliver to addresses across India, subject to courier serviceability:

**Serviceable Areas:**
- All major cities and metro areas
- Tier 2 and Tier 3 cities
- Towns and villages with courier access
- Remote areas (subject to courier availability)

**Pin Code Verification:**
You can verify if we deliver to your location by entering your pin code at checkout. If your pin code is not serviceable, we will notify you immediately.

**Delivery Restrictions:**
- PO Box addresses may not be accepted by all couriers
- Military and restricted areas may require additional verification
- Some remote locations may have extended delivery times

**Address Requirements:**
- Provide complete and accurate delivery address
- Include landmarks for easier location
- Provide working contact number
- Ensure someone is available to receive the package

**Address Changes:**
Address changes are only possible before the order is dispatched. Contact customer service immediately if you need to modify your delivery address.`
    },
    {
      id: 3,
      icon: Clock,
      title: "Delivery Timelines",
      content: `Estimated delivery times vary based on your location and product availability:

**Metro Cities (Mumbai, Delhi, Bangalore, etc.):**
- Standard Delivery: 3-5 business days
- Express Delivery: 1-2 business days (if available)

**Tier 2 Cities:**
- Standard Delivery: 4-6 business days
- Express Delivery: 2-3 business days (if available)

**Tier 3 Cities & Towns:**
- Standard Delivery: 5-7 business days
- Express Delivery: Not available

**Remote Areas:**
- Standard Delivery: 7-10 business days
- Delivery time may vary based on courier accessibility

**Important Notes:**
- Delivery timelines are estimates and not guaranteed
- Business days exclude Sundays and public holidays
- Orders placed on weekends/holidays are processed on the next business day
- Peak seasons (festivals, sales) may experience slight delays
- Weather conditions and unforeseen circumstances may affect delivery

**Order Tracking:**
Once your order is shipped, you'll receive tracking information via email and SMS. You can track your order status in real-time through our website or the courier's tracking portal.`
    },
    {
      id: 4,
      icon: IndianRupee,
      title: "Shipping Charges",
      content: `Our shipping charges are calculated based on order value, weight, and delivery location:

**Free Shipping:**
- Orders above ₹999: FREE standard shipping across India
- Applicable on all products unless specified otherwise
- Automatically applied at checkout

**Standard Shipping Charges:**
- Orders below ₹999: ₹99 - ₹149 (based on location)
- Metro cities: ₹99
- Other cities: ₹119
- Remote areas: ₹149

**Express Shipping Charges:**
- Express delivery: Additional ₹199 - ₹299
- Available only in select cities
- Delivery within 1-3 business days

**Bulk Orders:**
For bulk orders (10+ items), special shipping rates may apply. Contact our customer service team for a customized quote.

**Shipping Cost Calculation:**
Shipping costs are automatically calculated at checkout based on:
- Your delivery pin code
- Total order weight
- Selected delivery option
- Current promotions or offers

**Special Offers:**
- Seasonal promotions may include free shipping on all orders
- Loyalty program members may receive shipping discounts
- Flash sales may include free express shipping

All shipping charges are clearly displayed before you complete your purchase.`
    },
    {
      id: 5,
      icon: Truck,
      title: "Shipping Partners",
      content: `We partner with reliable courier services to ensure safe and timely delivery:

**Our Courier Partners:**
- Delhivery
- Blue Dart
- DTDC
- India Post
- Ecom Express
- Shadowfax

**Partner Selection:**
We automatically assign the most suitable courier partner based on:
- Your delivery location
- Product type and weight
- Fastest available delivery option
- Courier serviceability in your area

**Courier Tracking:**
- Each courier provides real-time tracking
- Track through our website or courier's portal
- Receive SMS and email updates at every milestone
- Contact courier directly for urgent queries

**Packaging Standards:**
- All items are securely packed in branded packaging
- Fragile items receive extra protective packaging
- Tamper-proof seals on all packages
- Discreet packaging available on request

**Quality Assurance:**
Every package goes through quality checks before dispatch to ensure:
- Correct items are packed
- Products are in perfect condition
- Proper packaging and labeling
- All necessary documentation is included`
    },
    {
      id: 6,
      icon: Package,
      title: "Order Processing",
      content: `Understanding our order processing workflow:

**Step 1: Order Confirmation**
- Receive order confirmation email immediately
- Payment verification (typically instant)
- Order enters processing queue

**Step 2: Order Processing**
- Orders processed within 1-2 business days
- Items picked from warehouse
- Quality check performed
- Secure packaging

**Step 3: Dispatch**
- Order handed over to courier partner
- Shipping confirmation email sent
- Tracking number provided
- SMS notification sent

**Step 4: In Transit**
- Package moves through courier network
- Real-time tracking available
- Regular status updates via SMS/email

**Step 5: Out for Delivery**
- Package reaches your local delivery center
- Delivery executive assigned
- Delivery attempted at your address

**Step 6: Delivered**
- Package delivered to your address
- Signature/OTP confirmation required
- Delivery confirmation email sent

**Processing Delays:**
Orders may take longer to process during:
- Festival seasons and sale periods
- Public holidays and weekends
- Warehouse inventory updates
- High order volume periods

We appreciate your patience during peak times and will keep you informed of any delays.`
    },
    {
      id: 7,
      icon: CheckCircle,
      title: "Delivery Process",
      content: `What to expect during delivery:

**Delivery Attempts:**
- Courier will attempt delivery 2-3 times
- Delivery executive will call before arriving
- Ensure someone is available to receive the package
- Valid ID may be required for verification

**Delivery Requirements:**
- Someone must be present to accept delivery
- Signature or OTP confirmation required
- Age verification for applicable products
- Refuse damaged or tampered packages

**Failed Delivery:**
If delivery fails due to:
- Recipient unavailable
- Incorrect address
- Refused delivery
- Contact number unreachable

The package will be returned to the nearest courier facility. You'll receive notification to reschedule delivery or arrange pickup.

**Self-Pickup Option:**
- Available at select courier centers
- Collect package from nearby pickup point
- Valid ID and order details required
- Pickup within 7 days of notification

**Undeliverable Packages:**
If package is undeliverable after multiple attempts:
- Package returned to our warehouse
- You'll be notified via email/SMS
- Refund processed (shipping charges deducted)
- Reship available (additional charges apply)

**Delivery Proof:**
- Digital proof of delivery (POD) maintained
- Photographic evidence for high-value orders
- Available on request for verification`
    },
    {
      id: 8,
      icon: Shield,
      title: "Package Safety & Security",
      content: `We prioritize the safety and security of your orders:

**Secure Packaging:**
- Sturdy, branded packaging materials
- Bubble wrap and cushioning for delicate items
- Waterproof packaging for monsoon seasons
- Tamper-evident seals on all packages

**Package Insurance:**
- All orders automatically insured up to invoice value
- Protection against loss, theft, or damage in transit
- No additional charges for standard insurance
- Additional insurance available for high-value orders

**Package Tracking:**
- GPS tracking for real-time location
- Multiple checkpoints throughout journey
- Regular status updates
- Estimated delivery time updates

**At Delivery:**
- Verify package condition before accepting
- Check for tampering or damage
- Open and inspect items in courier's presence if suspicious
- Refuse delivery if package is damaged

**Report Issues:**
Contact us immediately if:
- Package appears tampered or damaged
- Items are missing or incorrect
- Products are damaged
- Quality concerns

**Claim Process:**
- Report within 48 hours of delivery
- Provide photographs of damaged package/items
- Investigation initiated within 24 hours
- Resolution within 5-7 business days
- Refund or replacement provided as applicable`
    },
    {
      id: 9,
      icon: AlertCircle,
      title: "Shipping Issues & Solutions",
      content: `Common shipping issues and how we handle them:

**Delayed Delivery:**
Reasons: Weather, courier delays, high volume, remote location
Solution: Track package, contact customer service, we'll expedite with courier

**Lost Package:**
If tracking shows no movement for 5+ days:
- We initiate investigation with courier
- File claim if package is confirmed lost
- Full refund or replacement provided
- Processed within 7-10 business days

**Wrong Address:**
If you provided incorrect address:
- Contact us immediately before dispatch
- Address change possible before shipment
- After dispatch: Redirect request to courier (charges may apply)
- Return to sender: Reship with correct address (additional charges)

**Package Damaged:**
On receiving damaged package:
- Don't accept delivery or note damage
- Take photos and videos
- Report within 48 hours
- Replacement or refund processed

**Missing Items:**
If items are missing from your package:
- Report within 48 hours of delivery
- Provide unboxing video if available
- Investigation initiated immediately
- Missing items shipped or refund provided

**Incorrect Items:**
Received wrong product:
- Report within 48 hours
- Return incorrect item
- Correct item shipped immediately
- Return shipping at our cost

**Customer Support:**
For any shipping issues:
- Email: shipping@ciyatake.com
- Phone: +91-XXXX-XXXXXX
- WhatsApp: +91-XXXX-XXXXXX
- Live Chat: Available on website`
    },
    {
      id: 10,
      icon: Globe,
      title: "Special Circumstances",
      content: `Shipping policies for special situations:

**Pre-Order Items:**
- Shipping timelines mentioned on product page
- Dispatched when stock arrives
- Separate shipping if ordered with regular items
- Email notification before dispatch

**Custom/Personalized Items:**
- Additional 3-5 days for customization
- No exchanges on personalized items
- Customization details confirmed before processing
- Shipping time added to customization time

**Bulk Orders:**
- 10+ items of same SKU
- May ship in multiple packages
- Special handling and packaging
- Separate tracking for each package
- Contact for combined shipping options

**Gift Orders:**
- Gift wrapping available (additional charges)
- Gift message included
- Invoice not included in package
- Email invoice to purchaser
- Special delivery instructions accepted

**Sale/Clearance Items:**
- Standard shipping timelines apply
- May take additional 1-2 days during sale periods
- Non-returnable items clearly marked
- All shipping policies apply

**Weekends & Holidays:**
- No processing on Sundays and public holidays
- Orders placed on holidays processed next business day
- Delivery may not be available on some holidays
- Check holiday shipping schedule on website

**Festival Rush:**
During Diwali, Dussehra, Christmas, and other major festivals:
- Order early for guaranteed delivery
- Extended delivery timelines
- Express shipping may be unavailable
- No delivery on festival day (courier policy)`
    },
    {
      id: 11,
      icon: RefreshCw,
      title: "Returns & Exchange Shipping",
      content: `Shipping policies for returns and exchanges:

**Return Shipping:**
- Free return pickup for defective/wrong items
- Customer bears return shipping for change of mind
- Return pickup arranged through customer service
- Original packaging required for return

**Return Process:**
1. Initiate return through website/app
2. Select pickup date and time slot
3. Pack items securely in original packaging
4. Handover to pickup executive
5. Track return shipment
6. Refund after quality check

**Exchange Shipping:**
- Free shipping for size/color exchanges
- Exchange subject to availability
- Original item pickup arranged
- New item shipped after receiving return
- Price difference charged/refunded if applicable

**Return Shipping Charges:**
- Defective/wrong item: FREE
- Change of mind: ₹99 - ₹149 (based on location)
- Sale items: ₹149 (if returnable)
- Deducted from refund amount

**Return Timeline:**
- Pickup within 2-3 business days of request
- Return transit: 3-7 business days
- Quality check: 2-3 business days
- Refund processing: 5-7 business days

**Return Packaging:**
- Use original packaging with tags
- Include invoice and return form
- Secure packaging to prevent damage
- Remove/cover old shipping labels

**Refund for Return Shipping:**
If item is defective/wrong/damaged:
- Return shipping: FREE
- Original shipping charges: Refunded
- Full product amount: Refunded

**Exchange Not Available:**
If exchange not available:
- Return for full refund
- Place new order separately
- Return shipping free if product issue`
    },
    {
      id: 12,
      icon: Phone,
      title: "Contact & Support",
      content: `Get help with your shipping queries:

**Customer Service:**
Email: shipping@ciyatake.com
Phone: 1800-XXX-XXXX (Toll-Free)
WhatsApp: +91-XXXX-XXXXXX
Hours: Monday - Saturday, 9 AM - 7 PM IST

**Live Chat:**
Available on website and app
Monday - Saturday, 9 AM - 7 PM IST
Average response time: 2-3 minutes

**Order Tracking:**
- Track through website: www.ciyatake.com/track
- Use order number or tracking ID
- Email tracking link in shipping confirmation
- SMS tracking updates

**Shipping Queries:**
For questions about:
- Delivery timelines
- Shipping charges
- Address changes
- Delivery status
- Lost packages
- Damaged items

**Social Media:**
Connect with us:
Instagram: @ciyatake
Facebook: /ciyatake
Twitter: @ciyatake
Response time: Within 24 hours

**Feedback:**
Share your delivery experience:
- Rate your delivery
- Review courier service
- Suggest improvements
- Report issues

We value your feedback and continuously work to improve our shipping services.

**Shipping Policy Updates:**
- Policy updates posted on website
- Email notification for major changes
- Check website for latest information
- Contact us for policy clarifications`
    }
  ];

  const shippingHighlights = [
    {
      icon: CheckCircle,
      title: "Free Shipping",
      description: "On orders above ₹999 across India"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "3-7 business days to most locations"
    },
    {
      icon: Shield,
      title: "Secure Packaging",
      description: "Tamper-proof and damage-resistant"
    },
    {
      icon: MapPin,
      title: "Pan-India Delivery",
      description: "Shipping to 20,000+ pin codes"
    }
  ];

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      <section className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Package className="w-16 h-16" />
          </div>
          <h1 className="mb-4 text-5xl font-bold">Shipping Policy</h1>
          <p className="mb-4 text-xl opacity-90">
            Fast, reliable, and secure delivery across India. Everything you need to know about our shipping process.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm opacity-80">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-10 px-4 py-4 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between md:hidden">
            <span className="text-[#8b7355] font-semibold">Quick Navigation</span>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#8b7355] hover:bg-[#f5f1ed] rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex-wrap justify-center hidden gap-3 md:flex">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-sm text-[#8b7355] hover:text-[#6b5847] hover:bg-[#f5f1ed] px-4 py-2 rounded-lg transition-colors"
              >
                {section.title}
              </button>
            ))}
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 bg-[#f5f1ed] rounded-lg p-4 max-h-96 overflow-y-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full text-left text-[#8b7355] hover:text-[#6b5847] hover:bg-white px-4 py-3 rounded-lg transition-colors mb-2"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="flex-shrink-0 w-5 h-5" />
                    <span>{section.title}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-4">
            {shippingHighlights.map((highlight, index) => (
              <div key={index} className="p-6 text-center bg-white rounded-lg shadow-sm">
                <div className="flex justify-center mb-3">
                  <div className="bg-[#f5f1ed] p-3 rounded-lg">
                    <highlight.icon className="w-8 h-8 text-[#8b7355]" />
                  </div>
                </div>
                <h3 className="font-semibold text-[#6b5847] mb-2">{highlight.title}</h3>
                <p className="text-sm text-[#8b7355]">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="p-8 bg-white rounded-lg shadow-sm scroll-mt-24"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-[#f5f1ed] p-3 rounded-lg flex-shrink-0">
                  <section.icon className="w-8 h-8 text-[#8b7355]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-[#6b5847] mb-4">{section.title}</h2>
                  <div className="text-[#6b5847] leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-8">Delivery Timeline Guide</h2>
          <div className="bg-[#f5f1ed] p-8 rounded-lg">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <Clock className="w-6 h-6 text-[#8b7355]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Metro Cities</h3>
                  <p className="text-[#8b7355] mb-2">Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune</p>
                  <p className="text-[#6b5847] font-semibold">3-5 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <Clock className="w-6 h-6 text-[#8b7355]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Tier 2 Cities</h3>
                  <p className="text-[#8b7355] mb-2">Jaipur, Lucknow, Chandigarh, Indore, Nagpur, Coimbatore</p>
                  <p className="text-[#6b5847] font-semibold">4-6 business days</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <Clock className="w-6 h-6 text-[#8b7355]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Other Locations</h3>
                  <p className="text-[#8b7355] mb-2">Tier 3 cities, towns, and remote areas</p>
                  <p className="text-[#6b5847] font-semibold">5-10 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white p-8 rounded-lg">
            <h2 className="mb-4 text-3xl font-bold text-center">Need Help with Shipping?</h2>
            <p className="mb-8 text-center opacity-90">
              Our customer service team is here to help with any shipping-related questions or concerns.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-white rounded-lg bg-opacity-20">
                    <Phone className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Call Us</h3>
                <p className="text-sm opacity-90">1800-XXX-XXXX (Toll-Free)</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-white rounded-lg bg-opacity-20">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Email Us</h3>
                <a href="mailto:shipping@ciyatake.com" className="text-sm transition-opacity opacity-90 hover:opacity-100">
                  shipping@ciyatake.com
                </a>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-white rounded-lg bg-opacity-20">
                    <Globe className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Track Order</h3>
                <p className="text-sm opacity-90">www.ciyatake.com/track</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8b7355] text-sm">
            This shipping policy is subject to change without prior notice. Please check this page regularly for updates. For any clarifications, contact our customer service team.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
