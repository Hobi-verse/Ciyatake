import { Shield, Lock, Eye, Database, UserCheck, Mail, FileText, AlertCircle, CheckCircle, Globe, Calendar } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "October 19, 2025";

  const sections = [
    {
      id: 1,
      icon: FileText,
      title: "Introduction",
      content: `Welcome to Ciyatake. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.

This privacy policy applies to information we collect about you when you use our website, mobile application, or interact with us through customer service, social media, or other channels.

By using Ciyatake, you agree to the collection and use of information in accordance with this policy.`
    },
    {
      id: 2,
      icon: Database,
      title: "Information We Collect",
      content: `We collect several types of information from and about users of our services:

**Personal Information:**
- Name, email address, phone number
- Billing and shipping addresses
- Payment information (processed securely through payment providers)
- Account credentials (username and password)

**Transaction Information:**
- Purchase history and order details
- Product preferences and shopping behavior
- Customer service interactions and communications

**Technical Information:**
- IP address and device information
- Browser type and version
- Operating system and platform
- Cookies and similar tracking technologies
- Website usage data and analytics

**Optional Information:**
- Profile picture and preferences
- Birthday and demographic information
- Product reviews and ratings
- Wishlist and saved items`
    },
    {
      id: 3,
      icon: Eye,
      title: "How We Use Your Information",
      content: `We use the information we collect for various purposes:

**Service Delivery:**
- Process and fulfill your orders
- Manage your account and provide customer support
- Send order confirmations and shipping updates
- Handle returns, refunds, and exchanges

**Communication:**
- Respond to your inquiries and requests
- Send important notices about your account
- Provide customer service and support
- Send promotional offers and marketing communications (with your consent)

**Improvement and Analytics:**
- Analyze website usage and customer behavior
- Improve our products, services, and website
- Conduct market research and surveys
- Develop new features and offerings

**Security and Legal:**
- Detect and prevent fraud and abuse
- Comply with legal obligations
- Protect our rights and property
- Enforce our terms and conditions`
    },
    {
      id: 4,
      icon: Lock,
      title: "Data Security",
      content: `We implement appropriate technical and organizational security measures to protect your personal data:

**Security Measures:**
- SSL/TLS encryption for data transmission
- Secure payment processing through PCI-DSS compliant providers
- Regular security audits and vulnerability assessments
- Access controls and authentication systems
- Employee training on data protection

**Data Storage:**
- Your data is stored on secure servers
- Regular backups to prevent data loss
- Industry-standard security protocols
- Restricted access to authorized personnel only

While we strive to protect your personal data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but will notify you promptly of any data breaches as required by law.`
    },
    {
      id: 5,
      icon: UserCheck,
      title: "Sharing Your Information",
      content: `We may share your personal information in the following circumstances:

**Service Providers:**
- Payment processors (for transaction processing)
- Shipping and logistics partners (for order fulfillment)
- Cloud hosting providers (for data storage)
- Marketing and analytics services
- Customer service platforms

**Business Transfers:**
- In connection with mergers, acquisitions, or asset sales
- During business reorganization or restructuring

**Legal Requirements:**
- To comply with legal obligations and regulations
- To respond to lawful requests from authorities
- To protect our rights, property, and safety
- To enforce our terms and conditions

**With Your Consent:**
- When you explicitly authorize us to share your information
- For purposes disclosed at the time of collection

We do not sell your personal information to third parties for their marketing purposes.`
    },
    {
      id: 6,
      icon: Globe,
      title: "Your Privacy Rights",
      content: `You have several rights regarding your personal data:

**Access and Portability:**
- Request access to your personal data
- Receive a copy of your data in a portable format

**Correction and Updates:**
- Update or correct inaccurate information
- Keep your account information current

**Deletion:**
- Request deletion of your personal data
- Close your account (subject to legal requirements)

**Opt-Out Rights:**
- Unsubscribe from marketing emails
- Disable cookies through browser settings
- Opt-out of targeted advertising

**Objection and Restriction:**
- Object to certain data processing activities
- Request restriction of processing in certain circumstances

**Withdraw Consent:**
- Withdraw your consent at any time (where processing is based on consent)

To exercise these rights, contact us at privacy@ciyatake.com. We will respond within 30 days.`
    },
    {
      id: 7,
      icon: Database,
      title: "Data Retention",
      content: `We retain your personal data only as long as necessary:

**Account Information:**
- Retained while your account is active
- Retained for 3 years after account closure (for legal purposes)

**Transaction Records:**
- Retained for 7 years for accounting and tax purposes
- Required by law for financial record-keeping

**Marketing Data:**
- Retained until you unsubscribe or opt-out
- Deleted within 30 days of opt-out request

**Technical Data:**
- Cookies and analytics data retained for 12-24 months
- Log files retained for security purposes (90 days)

After the retention period, we securely delete or anonymize your data.`
    },
    {
      id: 8,
      icon: AlertCircle,
      title: "Cookies and Tracking",
      content: `We use cookies and similar technologies to enhance your experience:

**Essential Cookies:**
- Required for website functionality
- Cannot be disabled
- Session management and security

**Performance Cookies:**
- Analyze website usage and performance
- Help us improve our services
- Anonymous aggregate data

**Functional Cookies:**
- Remember your preferences and settings
- Provide personalized features
- Enhanced user experience

**Marketing Cookies:**
- Track advertising effectiveness
- Provide relevant advertisements
- Third-party advertising networks

You can control cookies through your browser settings. Disabling certain cookies may affect website functionality. See our Cookie Policy for detailed information.`
    },
    {
      id: 9,
      icon: Shield,
      title: "Children's Privacy",
      content: `Ciyatake does not knowingly collect personal information from children under 13 years of age.

**Our Commitment:**
- We do not direct our services to children
- We do not knowingly collect data from children
- Age verification for account creation

**If You're a Parent:**
- Contact us if you believe we have collected data from your child
- We will promptly delete such information
- We will take steps to prevent future collection

**Parental Responsibility:**
- Parents should monitor their children's online activities
- Use parental control tools when appropriate
- Contact us with any concerns about children's privacy

If we learn we have collected information from a child under 13, we will delete it immediately.`
    },
    {
      id: 10,
      icon: Globe,
      title: "International Transfers",
      content: `Your information may be transferred to and processed in countries other than your own:

**Data Transfer:**
- Our servers may be located in different countries
- Service providers may operate internationally
- Data protection laws may vary by country

**Safeguards:**
- We use standard contractual clauses
- We ensure adequate data protection measures
- We comply with applicable data transfer regulations

**Your Rights:**
- You have the same privacy rights regardless of location
- We maintain the same security standards globally
- Contact us for information about specific transfers

By using our services, you consent to the transfer of your information as described in this policy.`
    },
    {
      id: 11,
      icon: FileText,
      title: "Third-Party Links",
      content: `Our website may contain links to third-party websites and services:

**Important Notice:**
- We are not responsible for third-party privacy practices
- External sites have their own privacy policies
- Review their policies before providing information

**Social Media:**
- We may link to our social media pages
- Social platforms have their own data collection practices
- Interactions on social media are governed by their terms

**Payment Providers:**
- Payment processing is handled by third-party providers
- They have their own privacy and security policies
- We recommend reviewing their terms

We encourage you to be aware when you leave our site and to read the privacy statements of other websites.`
    },
    {
      id: 12,
      icon: Mail,
      title: "Changes to This Policy",
      content: `We may update this privacy policy from time to time:

**Notification of Changes:**
- We will post the updated policy on this page
- We will update the "Last Updated" date
- Significant changes will be notified via email
- Continued use constitutes acceptance of changes

**Your Responsibility:**
- Review this policy periodically
- Check the last updated date
- Contact us with questions about changes

**Version History:**
- Previous versions available upon request
- Major updates documented and communicated
- Transparent about policy changes

We encourage you to review this privacy policy regularly to stay informed about how we protect your information.`
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "privacy@ciyatake.com",
      link: "mailto:privacy@ciyatake.com"
    },
    {
      icon: Mail,
      title: "General Inquiries",
      content: "care@ciyatake.com",
      link: "mailto:care@ciyatake.com"
    },
    {
      icon: FileText,
      title: "Mailing Address",
      content: "123 Fashion Street, Andheri East, Mumbai, Maharashtra 400069"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16" />
          </div>
          <h1 className="mb-4 text-5xl font-bold">Privacy Policy</h1>
          <p className="mb-4 text-xl opacity-90">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
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

      {/* Key Points Summary */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">Key Privacy Points</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">We Protect Your Data</h3>
              <p className="text-[#8b7355]">
                Industry-standard security measures, encryption, and secure servers to safeguard your information.
              </p>
            </div>
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Transparent Practices</h3>
              <p className="text-[#8b7355]">
                Clear information about what data we collect, how we use it, and who we share it with.
              </p>
            </div>
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Your Control</h3>
              <p className="text-[#8b7355]">
                You can access, update, or delete your data anytime. Exercise your privacy rights easily.
              </p>
            </div>
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">No Data Selling</h3>
              <p className="text-[#8b7355]">
                We never sell your personal information to third parties for marketing purposes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white p-8 rounded-lg">
            <h2 className="mb-4 text-3xl font-bold text-center">Questions About Privacy?</h2>
            <p className="mb-8 text-center opacity-90">
              If you have questions or concerns about this privacy policy or our data practices, please contact us:
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {contactInfo.map((info, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-white rounded-lg bg-opacity-20">
                      <info.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{info.title}</h3>
                  {info.link ? (
                    <a href={info.link} className="text-sm transition-opacity opacity-90 hover:opacity-100">
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-sm opacity-90">{info.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="px-4 py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8b7355] text-sm">
            By using Ciyatake, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
