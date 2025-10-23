import { FileText, ShoppingBag, CreditCard, Package, RefreshCw, Shield, AlertTriangle, Scale, User, Lock, Globe, Calendar, CheckCircle } from 'lucide-react';

const TermsServices = () => {
  const lastUpdated = "October 19, 2025";

  const sections = [
    {
      id: 1,
      icon: FileText,
      title: "Agreement to Terms",
      content: `Welcome to Ciyatake. These Terms of Service ("Terms") govern your access to and use of our website, mobile application, products, and services (collectively, the "Services").

**By accessing or using our Services, you agree to be bound by these Terms.** If you do not agree to these Terms, you may not access or use our Services.

**Key Points:**
- These Terms constitute a legally binding agreement between you and Ciyatake
- You must be at least 18 years old to use our Services
- If you are using our Services on behalf of an organization, you represent that you have authority to bind that organization
- We may modify these Terms at any time by posting revised Terms on our website

**Acceptance:**
Your continued use of our Services after any changes indicates your acceptance of the modified Terms. We recommend reviewing these Terms periodically.`
    },
    {
      id: 2,
      icon: User,
      title: "Account Registration",
      content: `To access certain features of our Services, you must create an account:

**Registration Requirements:**
- Provide accurate, current, and complete information
- Maintain and update your information to keep it accurate
- You are responsible for maintaining the confidentiality of your account credentials
- You are responsible for all activities that occur under your account
- You must be at least 18 years old to create an account

**Account Security:**
- Choose a strong, unique password
- Do not share your account credentials with others
- Notify us immediately of any unauthorized access or security breach
- We reserve the right to terminate accounts that violate these Terms

**Account Termination:**
- You may close your account at any time through account settings
- We may suspend or terminate your account for violations of these Terms
- Upon termination, your right to use our Services ceases immediately
- We may retain certain information as required by law or for legitimate business purposes`
    },
    {
      id: 3,
      icon: ShoppingBag,
      title: "Use of Services",
      content: `You agree to use our Services only for lawful purposes and in accordance with these Terms:

**Permitted Use:**
- Browse and purchase products available on our platform
- Create wishlists and save items for later
- Leave reviews and ratings for products you've purchased
- Communicate with customer service for support

**Prohibited Activities:**
- Violating any applicable laws or regulations
- Infringing intellectual property rights of others
- Transmitting viruses, malware, or harmful code
- Attempting to gain unauthorized access to our systems
- Using automated tools (bots, scrapers) without permission
- Impersonating others or providing false information
- Harassing, abusing, or threatening other users or staff
- Interfering with the proper functioning of our Services
- Reselling products for commercial purposes without authorization

**Consequences:**
Violation of these Terms may result in account suspension or termination, legal action, and reporting to law enforcement authorities.`
    },
    {
      id: 4,
      icon: ShoppingBag,
      title: "Product Information",
      content: `We strive to provide accurate product information, but we cannot guarantee perfection:

**Product Descriptions:**
- Product descriptions, images, and specifications are for informational purposes
- Colors may vary slightly due to screen settings and photography
- Actual products may differ slightly from images shown
- We reserve the right to correct errors or inaccuracies

**Pricing:**
- All prices are in Indian Rupees (INR) unless otherwise stated
- Prices are subject to change without notice
- We reserve the right to correct pricing errors
- Promotional prices are valid for limited time periods
- Additional charges (taxes, shipping) may apply

**Availability:**
- Product availability is subject to change
- We do not guarantee that products will always be in stock
- We reserve the right to limit quantities purchased
- Out-of-stock items may be back-ordered or cancelled

**Accuracy:**
While we make every effort to ensure accuracy, errors may occur. We reserve the right to cancel orders placed for products with incorrect pricing or information.`
    },
    {
      id: 5,
      icon: CreditCard,
      title: "Orders and Payments",
      content: `When you place an order through our Services, you agree to the following:

**Order Process:**
- All orders are subject to acceptance and availability
- We reserve the right to refuse or cancel any order
- Order confirmation does not guarantee product availability
- We may require additional verification for certain orders

**Payment:**
- Payment is required at the time of order placement
- We accept credit cards, debit cards, net banking, and other specified payment methods
- All payments are processed securely through third-party payment providers
- You represent that you have the right to use the payment method provided

**Payment Authorization:**
- By providing payment information, you authorize us to charge the total amount
- You are responsible for all charges incurred under your account
- In case of payment failure, your order may be cancelled

**Taxes:**
- Applicable taxes (GST, etc.) will be added to your order total
- You are responsible for all taxes associated with your purchase
- Tax amounts are calculated based on shipping address

**Currency:**
All transactions are processed in Indian Rupees (INR) unless otherwise specified.`
    },
    {
      id: 6,
      icon: Package,
      title: "Shipping and Delivery",
      content: `We aim to deliver your orders promptly and safely:

**Shipping:**
- Shipping times vary based on location and product availability
- Estimated delivery dates are not guaranteed
- Shipping costs are calculated at checkout based on your location
- Free shipping may be available for orders above certain amounts

**Delivery:**
- Delivery is made to the address you provide at checkout
- Ensure your shipping address is accurate and complete
- You are responsible for providing a safe delivery location
- Someone must be available to receive the package

**Risk of Loss:**
- Risk of loss transfers to you upon delivery
- Delivery is deemed complete when the package is left at the specified address
- We are not responsible for stolen or lost packages after delivery

**Delays:**
- We are not liable for delays caused by shipping carriers
- Natural disasters, strikes, or other events beyond our control may cause delays
- We will notify you of significant delays when possible

**International Shipping:**
Currently, we only ship within India. International shipping may be available in the future.`
    },
    {
      id: 7,
      icon: RefreshCw,
      title: "Returns and Refunds",
      content: `We want you to be satisfied with your purchase. Our return and refund policy:

**Return Eligibility:**
- Products must be returned within 7-14 days of delivery (varies by category)
- Items must be unused, unworn, and in original packaging with tags
- Certain products (personal care, intimate items, etc.) are non-returnable
- Sale and clearance items may have different return policies

**Return Process:**
- Initiate a return through your account or contact customer service
- Pack items securely in original packaging
- Attach the provided return label
- Ship via authorized courier (return pickup may be available)

**Refunds:**
- Refunds are processed within 7-10 business days after receiving returned items
- Original payment method will be credited
- Shipping charges are non-refundable (unless item is defective)
- We inspect returned items before processing refunds

**Exchanges:**
- Subject to availability of replacement items
- Price differences may apply for exchanges
- Contact customer service to arrange exchanges

**Damaged or Defective Items:**
Notify us within 48 hours of delivery for damaged or defective items. We will arrange for replacement or full refund including shipping charges.`
    },
    {
      id: 8,
      icon: Shield,
      title: "Intellectual Property",
      content: `All content and materials on our Services are protected by intellectual property laws:

**Our Rights:**
- Ciyatake owns or licenses all content, including text, images, logos, graphics, and software
- The Ciyatake name, logo, and trademarks are our property
- All product descriptions, images, and materials are protected by copyright
- Website design, layout, and functionality are our intellectual property

**Your License:**
- We grant you a limited, non-exclusive, non-transferable license to use our Services
- This license is for personal, non-commercial use only
- You may not copy, modify, distribute, or create derivative works
- You may not reverse engineer or extract source code

**User Content:**
- You retain ownership of content you submit (reviews, photos, etc.)
- By submitting content, you grant us a worldwide, royalty-free license to use, reproduce, and display it
- You represent that you have rights to submit the content
- You are responsible for the content you submit

**Prohibited Use:**
Unauthorized use of our intellectual property may result in legal action and termination of your account.`
    },
    {
      id: 9,
      icon: AlertTriangle,
      title: "Disclaimers and Limitations",
      content: `Please read these important disclaimers and limitations:

**Service Availability:**
- Our Services are provided "as is" and "as available"
- We do not guarantee uninterrupted or error-free service
- We may suspend or discontinue Services at any time
- Scheduled maintenance may cause temporary unavailability

**Product Disclaimer:**
- We make no warranties about product quality, fitness, or merchantability
- Products are sold "as is" except where required by law
- Manufacturer warranties may apply to certain products
- We are not liable for product defects beyond our return policy

**Limitation of Liability:**
- To the fullest extent permitted by law, Ciyatake is not liable for any indirect, incidental, special, or consequential damages
- Our total liability is limited to the amount you paid for the product
- We are not liable for delays, failures, or disruptions of Services
- We are not liable for third-party services or content

**Force Majeure:**
We are not responsible for failures or delays due to circumstances beyond our control, including natural disasters, acts of war, government actions, or technical failures.

**Law as per India:**
Some jurisdictions do not allow certain limitations. These limitations may not apply to you if prohibited by law.`
    },
    {
      id: 10,
      icon: User,
      title: "User Conduct and Reviews",
      content: `When interacting with our Services, you agree to follow these guidelines:

**Product Reviews:**
- Reviews must be based on genuine experience with the product
- Reviews must be honest and not misleading
- No offensive, abusive, or inappropriate language
- No promotion of competing products or services
- No disclosure of personal information

**Community Guidelines:**
- Treat other users with respect
- Do not post spam or irrelevant content
- Do not post content that violates intellectual property rights
- Do not impersonate others or misrepresent your identity
- Do not engage in fraudulent or deceptive practices

**Content Moderation:**
- We reserve the right to remove or edit any user content
- We may suspend or terminate accounts for violating guidelines
- Removal of content does not waive our rights or remedies
- We are not obligated to monitor all user content

**Reporting:**
If you encounter inappropriate content or behavior, please report it to us through the appropriate channels.`
    },
    {
      id: 11,
      icon: Lock,
      title: "Privacy and Data Protection",
      content: `Your privacy is important to us:

**Privacy Policy:**
- Our Privacy Policy governs the collection and use of your personal data
- By using our Services, you consent to our Privacy Policy
- Please review our Privacy Policy for detailed information


**Data Security:**
- We implement security measures to protect your data
- We cannot guarantee absolute security
- You are responsible for maintaining the confidentiality of your account
- Notify us immediately of any security breaches

**Cookies:**
- We use cookies and similar technologies
- See our Cookie Policy for more information
- You can control cookies through browser settings

**Marketing Communications:**
- We may send promotional emails with your consent
- You can opt-out of marketing emails at any time
- Transactional emails (order confirmations, etc.) will still be sent

**Third Parties:**
We may share your information with service providers, as described in our Privacy Policy.`
    },
    {
      id: 12,
      icon: Globe,
      title: "Third-Party Services",
      content: `Our Services may integrate with or link to third-party services:

**Third-Party Links:**
- Our website may contain links to external websites
- We are not responsible for third-party content or practices
- Third-party sites have their own terms and privacy policies
- Access third-party sites at your own risk

**Payment Providers:**
- Payments are processed by third-party payment gateways
- Payment providers have their own terms and conditions
- We are not responsible for payment processing issues
- Disputed charges should be directed to your payment provider

**Shipping Partners:**
- Delivery is handled by third-party logistics providers
- Shipping carriers have their own terms and conditions
- We are not liable for carrier delays or mishandling
- Track shipments through carrier websites

**Social Media:**
- We may integrate social media features
- Social platforms have their own terms and privacy policies
- Interactions on social media are governed by platform rules

**No Endorsement:**
Links to third parties do not constitute endorsement of their services or products.`
    },
    {
      id: 13,
      icon: Scale,
      title: "Dispute Resolution",
      content: `We aim to resolve disputes amicably:

**Informal Resolution:**
- Contact customer service first to resolve any issues
- We will make reasonable efforts to address your concerns
- Most disputes can be resolved through communication

**Governing Law:**
- These Terms are governed by the laws of India
- Courts in Mumbai, Maharashtra have exclusive jurisdiction
- You agree to submit to the jurisdiction of these courts

**Arbitration:**
- Disputes may be resolved through binding arbitration
- Arbitration shall be conducted in Mumbai, India
- Arbitration rules and procedures will be mutually agreed upon
- Each party bears their own costs unless otherwise awarded

**Class Action Waiver:**
- You agree to bring claims individually, not as a class action
- You waive any right to participate in class action lawsuits
- This waiver applies to the fullest extent permitted by law

**Limitation Period:**
Any claims must be brought within one year of the cause of action arising. Claims not brought within this period are permanently barred.`
    },
    {
      id: 14,
      icon: FileText,
      title: "Modifications to Terms",
      content: `We may update these Terms from time to time:

**Changes:**
- We reserve the right to modify these Terms at any time
- Updated Terms will be posted on our website with a new "Last Updated" date
- Material changes may be notified via email or website notice
- Continued use after changes constitutes acceptance

**Your Options:**
- Review Terms regularly to stay informed
- If you disagree with changes, discontinue use of our Services
- Contact us if you have questions about changes

**Effect of Changes:**
- Changes take effect immediately upon posting (or as specified)
- Previous versions of Terms are superseded
- Your use of Services after changes means you accept the new Terms

**Version History:**
Previous versions of Terms may be available upon request for reference purposes.`
    },
    {
      id: 15,
      icon: AlertTriangle,
      title: "Termination",
      content: `Either party may terminate this agreement:

**Your Right to Terminate:**
- You may stop using our Services at any time
- Close your account through account settings
- Termination does not affect orders already placed
- Some provisions survive termination (payment obligations, etc.)

**Our Right to Terminate:**
- We may suspend or terminate your account for Terms violations
- We may terminate without cause with reasonable notice
- We may terminate immediately for serious violations
- We are not liable for termination consequences

**Effect of Termination:**
- Your right to use Services ceases immediately
- Outstanding payment obligations remain due
- Return obligations for products continue to apply
- We may delete your account and associated data

**Surviving Provisions:**
Sections regarding payment, intellectual property, disclaimers, and dispute resolution survive termination.`
    },
    {
      id: 16,
      icon: FileText,
      title: "General Provisions",
      content: `Additional terms that apply to your use of our Services:

**Entire Agreement:**
- These Terms constitute the entire agreement between you and Ciyatake
- These Terms supersede all prior agreements and understandings
- No other representations or warranties are binding

**Severability:**
- If any provision is found unenforceable, it will be modified to reflect intent
- Other provisions remain in full force and effect
- Invalid provisions do not affect the validity of remaining Terms

**Waiver:**
- Failure to enforce any provision is not a waiver of that provision
- Waivers must be in writing to be effective
- Waiver of one breach does not waive subsequent breaches

**Assignment:**
- You may not assign or transfer these Terms without our consent
- We may assign these Terms to affiliates or successors
- Assignment does not release original party from obligations

**Contact:**
For questions about these Terms, contact us at legal@ciyatake.com or through our customer service channels.`
    }
  ];

  const quickFacts = [
    {
      icon: CheckCircle,
      title: "Fair & Transparent",
      description: "Clear terms that protect both you and Ciyatake"
    },
    {
      icon: Shield,
      title: "Your Rights Protected",
      description: "We respect consumer rights and legal protections"
    },
    {
      icon: Scale,
      title: "Legally Binding",
      description: "These terms form a contract between you and us"
    },
    {
      icon: Globe,
      title: "Governed by Indian Law",
      description: "Subject to laws of India and courts in Mumbai"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Scale className="w-16 h-16" />
          </div>
          <h1 className="mb-4 text-5xl font-bold">Terms of Service</h1>
          <p className="mb-4 text-xl opacity-90">
            Please read these terms carefully before using Ciyatake. By using our services, you agree to these terms.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm opacity-80">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="sticky top-0 z-10 px-4 py-8 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#section-${section.id}`}
                className="text-sm text-[#8b7355] hover:text-[#6b5847] hover:bg-[#f5f1ed] px-4 py-2 rounded-lg transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-4">
            {quickFacts.map((fact, index) => (
              <div key={index} className="p-6 text-center bg-white rounded-lg">
                <fact.icon className="w-10 h-10 text-[#8b7355] mx-auto mb-3" />
                <h3 className="font-semibold text-[#6b5847] mb-2">{fact.title}</h3>
                <p className="text-sm text-[#8b7355]">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
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

      {/* Important Notice */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#fff3cd] border-l-4 border-[#8b7355] p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-[#8b7355] flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-[#6b5847] mb-2">Important Notice</h3>
                <p className="text-[#6b5847] leading-relaxed">
                  These Terms of Service constitute a legally binding agreement. By using Ciyatake, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree to these terms, please do not use our services. For any questions or concerns, please contact our legal team at legal@ciyatake.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white p-8 rounded-lg text-center">
            <h2 className="mb-4 text-3xl font-bold">Questions About These Terms?</h2>
            <p className="mb-6 opacity-90">
              If you have any questions or concerns about these Terms of Service, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:legal@ciyatake.com"
                className="bg-white text-[#6b5847] px-6 py-3 rounded-lg hover:bg-[#f5f1ed] transition-colors font-semibold inline-flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                legal@ciyatake.com
              </a>
              <a
                href="mailto:care@ciyatake.com"
                className="bg-transparent border-2 border-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#6b5847] transition-colors font-semibold inline-flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Customer Service
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="px-4 py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8b7355] text-sm">
            By continuing to use Ciyatake, you acknowledge your acceptance of these Terms of Service and any future modifications.<br />
            This website is owned by Sudarshan Singh.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsServices;
