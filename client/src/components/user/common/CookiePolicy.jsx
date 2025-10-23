import { Cookie, Shield, Settings, Eye, BarChart, Target, CheckCircle, Info, Globe, Calendar, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const CookiePolicy = () => {
  const lastUpdated = "October 19, 2025";
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    performance: true,
    functional: true,
    marketing: true
  });

  const handleToggle = (category) => {
    if (category === 'essential') return;
    setCookieSettings(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSavePreferences = () => {
    console.log('Cookie preferences saved:', cookieSettings);
    alert('Your cookie preferences have been saved!');
  };

  const sections = [
    {
      id: 1,
      icon: Cookie,
      title: "What Are Cookies?",
      content: `Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.

**How Cookies Work:**
Cookies store small amounts of data that can be retrieved by the website that created them. When you return to the website, it can read the cookie to remember information about your previous visit.

**Types of Cookies:**
- **Session Cookies:** Temporary cookies that expire when you close your browser
- **Persistent Cookies:** Remain on your device for a set period or until you delete them
- **First-Party Cookies:** Set by the website you're visiting
- **Third-Party Cookies:** Set by external services (analytics, advertising, etc.)

**Purpose:**
Cookies help us provide you with a better experience by remembering your preferences, keeping you logged in, analyzing how you use our website, and showing relevant advertisements.

**Your Control:**
You have control over cookies and can manage or delete them through your browser settings. However, disabling certain cookies may affect website functionality.`
    },
    {
      id: 2,
      icon: Shield,
      title: "Essential Cookies",
      content: `Essential cookies are necessary for our website to function properly. These cookies cannot be disabled as they are critical for basic site functionality.

**What They Do:**
- Enable core website functionality
- Keep you logged into your account
- Remember items in your shopping cart
- Enable secure payment processing
- Maintain security and prevent fraud
- Remember your cookie preferences

**Examples:**
- Session identifiers for logged-in users
- Shopping cart data
- Security tokens
- Load balancing cookies
- Form submission data

**Duration:**
Most essential cookies are session cookies that expire when you close your browser. Some may persist longer for functionality reasons.

**Legal Basis:**
Essential cookies are necessary for providing the service you've requested. They do not require your consent under data protection laws.

**Privacy:**
These cookies do not track your browsing behavior across other websites and contain only information necessary for website functionality.`
    },
    {
      id: 3,
      icon: BarChart,
      title: "Performance Cookies",
      content: `Performance cookies help us understand how visitors interact with our website by collecting anonymous information about usage patterns.

**What They Collect:**
- Pages visited and time spent on pages
- Links clicked and navigation paths
- Error messages encountered
- Loading times and performance metrics
- Device and browser information
- Geographic location (country/city level)

**Purpose:**
- Identify popular products and content
- Detect and fix technical issues
- Improve website speed and performance
- Optimize user experience
- Understand user behavior patterns

**Analytics Tools We Use:**
- Google Analytics
- Internal analytics platform
- Heat mapping tools
- Performance monitoring services

**Data Processing:**
All data collected is anonymous and aggregated. We cannot identify you personally from this data.

**Your Choice:**
You can opt-out of performance cookies through our cookie settings. This will not affect website functionality but will limit our ability to improve your experience.`
    },
    {
      id: 4,
      icon: Settings,
      title: "Functional Cookies",
      content: `Functional cookies enable enhanced features and personalization to improve your experience on our website.

**What They Remember:**
- Language and region preferences
- Currency selection
- Display preferences (list vs. grid view)
- Font size and accessibility settings
- Previous searches and viewed products
- Personalized recommendations

**Enhanced Features:**
- Remember your login status across sessions
- Auto-fill forms with saved information
- Provide personalized product suggestions
- Remember your filter and sort preferences
- Save items to wishlist
- Enable social media sharing features

**Benefits:**
These cookies make your shopping experience more convenient by remembering your choices and preferences, so you don't have to re-enter information each time you visit.

**Third-Party Services:**
Some functional cookies are set by third-party services integrated into our website (chat support, video players, social media widgets).

**Disabling Impact:**
Disabling functional cookies will not prevent you from using our website, but you may need to re-enter preferences and settings on each visit.`
    },
    {
      id: 5,
      icon: Target,
      title: "Marketing Cookies",
      content: `Marketing cookies track your browsing activity to deliver advertisements relevant to your interests.

**What They Do:**
- Track products you've viewed
- Show relevant advertisements on our site and other websites
- Measure advertising campaign effectiveness
- Limit the number of times you see an ad
- Provide personalized offers and promotions
- Enable retargeting campaigns

**Advertising Partners:**
We work with third-party advertising networks that may place cookies on your device:
- Google Ads
- Facebook Pixel
- Instagram Advertising
- Other advertising platforms

**Cross-Site Tracking:**
Marketing cookies may track your activity across multiple websites to build a profile of your interests and show relevant advertisements.

**Personalization:**
These cookies help us show you products and offers that are more likely to interest you, making advertisements more relevant and less intrusive.

**Opt-Out Options:**
- Disable marketing cookies through our cookie settings
- Use browser privacy features or ad blockers
- Visit industry opt-out pages (Network Advertising Initiative, Digital Advertising Alliance)
- Adjust advertising preferences on social media platforms

**No Personal Data:**
While marketing cookies track behavior, they do not store personally identifiable information like your name or email address.`
    },
    {
      id: 6,
      icon: Eye,
      title: "Third-Party Cookies",
      content: `Our website may include content and services from third parties that set their own cookies:

**Third-Party Services:**
- Payment processors (secure payment handling)
- Social media platforms (sharing buttons, embedded content)
- Analytics providers (website usage analysis)
- Advertising networks (targeted advertising)
- Customer support tools (live chat, feedback)
- Content delivery networks (faster page loading)

**Independent Control:**
Third-party cookies are controlled by the respective third parties, not by Ciyatake. They have their own privacy and cookie policies.

**Common Third Parties:**
- Google (Analytics, Ads, YouTube)
- Facebook (Pixel, social plugins)
- Payment gateways (Razorpay, Stripe, PayU)
- Chat services (Zendesk, Intercom)
- Email marketing platforms

**Your Privacy:**
We carefully select third-party partners and require them to comply with applicable privacy laws. However, we recommend reviewing their privacy policies.

**Managing Third-Party Cookies:**
You can control third-party cookies through:
- Our cookie settings panel
- Browser settings and privacy controls
- Third-party opt-out tools
- Privacy-focused browser extensions

**Data Sharing:**
When third-party cookies are set, information may be shared with those parties according to their privacy policies.`
    },
    {
      id: 7,
      icon: Settings,
      title: "Managing Your Cookie Preferences",
      content: `You have several options for controlling cookies on our website:

**Cookie Settings Panel:**
Use our cookie settings tool (available below) to:
- View detailed information about each cookie category
- Enable or disable optional cookie categories
- Save your preferences for future visits
- Update your choices at any time

**Browser Settings:**
All modern browsers allow you to control cookies:
- Block all cookies
- Block third-party cookies only
- Delete cookies after each session
- Receive notifications before cookies are set
- View and delete existing cookies

**Browser-Specific Instructions:**
- Chrome: Settings > Privacy and Security > Cookies
- Firefox: Settings > Privacy & Security > Cookies
- Safari: Preferences > Privacy > Cookies
- Edge: Settings > Privacy > Cookies

**Mobile Devices:**
- iOS: Settings > Safari > Block Cookies
- Android: Browser Settings > Privacy > Cookies

**Impact of Disabling Cookies:**
- Essential cookies: Website may not function properly
- Performance cookies: We cannot improve your experience
- Functional cookies: You'll need to re-enter preferences
- Marketing cookies: Advertisements will be less relevant

**Privacy Tools:**
Consider using privacy-focused browsers (Brave, Firefox Focus) or browser extensions that block tracking cookies.`
    },
    {
      id: 8,
      icon: Info,
      title: "Cookies We Use",
      content: `Here is a detailed list of cookies used on Ciyatake:

**Essential Cookies:**
- _session: Maintains your login session (Session)
- cart_token: Stores your shopping cart items (7 days)
- csrf_token: Security protection against attacks (Session)
- cookie_consent: Remembers your cookie preferences (1 year)

**Performance Cookies:**
- _ga: Google Analytics visitor tracking (2 years)
- _gid: Google Analytics session tracking (24 hours)
- _gat: Google Analytics request throttling (1 minute)
- analytics_session: Internal analytics (30 days)

**Functional Cookies:**
- language_pref: Your language selection (1 year)
- currency_pref: Your currency preference (1 year)
- view_mode: Grid/list view preference (30 days)
- recently_viewed: Recently viewed products (30 days)

**Marketing Cookies:**
- _fbp: Facebook Pixel tracking (90 days)
- _gcl_au: Google Ads conversion tracking (90 days)
- retargeting_id: Retargeting campaign tracking (90 days)
- ad_preferences: Your advertising preferences (1 year)

**Third-Party Cookies:**
Various cookies set by third-party services integrated into our website. See third-party privacy policies for details.

**Cookie Updates:**
This list may change as we update our services. We will notify you of significant changes to our cookie practices.`
    },
    {
      id: 9,
      icon: Globe,
      title: "International Data Transfers",
      content: `Some cookies may result in data being transferred internationally:

**Data Processing Locations:**
- Our servers are primarily located in India
- Some third-party services process data in other countries
- Analytics and advertising partners may have global operations
- Data may be transferred to countries with different privacy laws

**Legal Basis:**
- Standard contractual clauses
- Privacy Shield frameworks (where applicable)
- Adequate data protection safeguards
- Your consent for optional cookies

**Data Protection:**
We ensure that international data transfers comply with applicable data protection laws and that your data receives adequate protection regardless of location.

**Third-Party Transfers:**
When you consent to third-party cookies, those parties may transfer your data internationally according to their privacy policies.

**Your Rights:**
You have rights regarding your data regardless of where it is processed:
- Access your data
- Correct inaccuracies
- Request deletion
- Object to processing
- Withdraw consent

**Questions:**
Contact us at privacy@ciyatake.com for information about specific data transfers and safeguards in place.`
    },
    {
      id: 10,
      icon: Shield,
      title: "Children's Privacy",
      content: `We are committed to protecting children's privacy:

**Age Restrictions:**
- Our services are not directed to children under 13
- We do not knowingly collect data from children under 13
- Account registration requires users to be 18 or older

**Parental Guidance:**
- Parents should monitor their children's online activities
- Use parental control tools and browser restrictions
- Educate children about online privacy
- Supervise use of our website

**If You're a Parent:**
If you believe we have collected information from a child under 13:
- Contact us immediately at privacy@ciyatake.com
- We will promptly delete the information
- We will take steps to prevent future collection

**Cookie Controls:**
Parents can disable cookies through browser settings to prevent tracking of children's online activities.

**Compliance:**
We comply with COPPA (Children's Online Privacy Protection Act) and similar laws protecting children's privacy.`
    },
    {
      id: 11,
      icon: AlertCircle,
      title: "Changes to Cookie Policy",
      content: `We may update this Cookie Policy from time to time:

**Notification of Changes:**
- Updated policy posted on this page
- "Last Updated" date will be revised
- Significant changes may be communicated via email or website notice
- Cookie consent banner may be shown again for material changes

**Your Options:**
- Review this policy periodically
- Update your cookie preferences as needed
- Contact us with questions about changes
- Withdraw consent for optional cookies at any time

**Reason for Updates:**
- New cookies or technologies implemented
- Changes to third-party services
- Legal or regulatory requirements
- Improvements to cookie practices

**Continued Use:**
Your continued use of our website after policy changes constitutes acceptance of the updated Cookie Policy.

**Historical Versions:**
Previous versions of this policy may be available upon request for reference purposes.`
    },
    {
      id: 12,
      icon: Info,
      title: "Contact Us",
      content: `If you have questions about our use of cookies:

**Privacy Team:**
- Email: privacy@ciyatake.com
- Response time: Within 2-3 business days

**Customer Service:**
- Email: care@ciyatake.com
- Phone: +91 98765 43210
- Hours: Monday-Saturday, 9:00 AM - 6:00 PM IST

**Mailing Address:**
Ciyatake
123 Fashion Street, Andheri East
Mumbai, Maharashtra 400069
India

**Data Protection Officer:**
For data protection inquiries, contact our Data Protection Officer at dpo@ciyatake.com

**Your Rights:**
We will help you exercise your rights regarding cookies and data:
- Access information we collect
- Update cookie preferences
- Request deletion of data
- Object to certain processing
- Lodge complaints with authorities

**Feedback:**
We welcome your feedback about our cookie practices and privacy policies.`
    }
  ];

  const cookieCategories = [
    {
      name: 'essential',
      icon: Shield,
      title: 'Essential Cookies',
      description: 'Required for website functionality. Cannot be disabled.',
      required: true,
      examples: 'Login sessions, shopping cart, security'
    },
    {
      name: 'performance',
      icon: BarChart,
      title: 'Performance Cookies',
      description: 'Help us analyze website usage and improve performance.',
      required: false,
      examples: 'Google Analytics, page load times, error tracking'
    },
    {
      name: 'functional',
      icon: Settings,
      title: 'Functional Cookies',
      description: 'Enable enhanced features and personalization.',
      required: false,
      examples: 'Language preferences, recently viewed items, display settings'
    },
    {
      name: 'marketing',
      icon: Target,
      title: 'Marketing Cookies',
      description: 'Track your activity to show relevant advertisements.',
      required: false,
      examples: 'Facebook Pixel, Google Ads, retargeting campaigns'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Cookie className="w-16 h-16" />
          </div>
          <h1 className="mb-4 text-5xl font-bold">Cookie Policy</h1>
          <p className="mb-4 text-xl opacity-90">
            Learn about how we use cookies and similar technologies to improve your experience on Ciyatake.
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

      {/* Cookie Preferences Panel */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-[#6b5847] mb-6 text-center">Manage Cookie Preferences</h2>
            <p className="text-[#8b7355] text-center mb-8">
              Control which cookies you want to allow. Essential cookies cannot be disabled as they are necessary for the website to function.
            </p>
            <div className="space-y-6">
              {cookieCategories.map((category) => (
                <div key={category.name} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start flex-1 gap-4">
                      <div className="bg-[#f5f1ed] p-3 rounded-lg">
                        <category.icon className="w-6 h-6 text-[#8b7355]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#6b5847] mb-2">{category.title}</h3>
                        <p className="text-[#8b7355] mb-2">{category.description}</p>
                        <p className="text-sm text-[#8b7355]">
                          <span className="font-semibold">Examples:</span> {category.examples}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      {category.required ? (
                        <div className="flex items-center gap-2 text-[#8b7355]">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-semibold">Always Active</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggle(category.name)}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                            cookieSettings[category.name]
                              ? 'bg-[#8b7355]'
                              : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              cookieSettings[category.name]
                                ? 'translate-x-7'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={handleSavePreferences}
                className="bg-[#8b7355] text-white px-8 py-4 rounded-lg hover:bg-[#6b5847] transition-colors font-semibold text-lg"
              >
                Save Preferences
              </button>
            </div>
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

      {/* Quick Summary */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">Cookie Policy Summary</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Transparency</h3>
              <p className="text-[#8b7355]">
                We clearly explain what cookies we use, why we use them, and how they benefit you.
              </p>
            </div>
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Your Control</h3>
              <p className="text-[#8b7355]">
                Manage your cookie preferences anytime through our settings panel or browser controls.
              </p>
            </div>
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Privacy Protection</h3>
              <p className="text-[#8b7355]">
                We respect your privacy and only use cookies that improve your shopping experience.
              </p>
            </div>
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Regular Updates</h3>
              <p className="text-[#8b7355]">
                We keep this policy current and notify you of any significant changes to our practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white p-8 rounded-lg text-center">
            <Cookie className="w-12 h-12 mx-auto mb-4" />
            <h2 className="mb-4 text-3xl font-bold">Questions About Cookies?</h2>
            <p className="mb-6 opacity-90">
              If you have any questions about our use of cookies or this Cookie Policy, please contact our privacy team.
            </p>
            <a
              href="mailto:privacy@ciyatake.com"
              className="bg-white text-[#6b5847] px-8 py-3 rounded-lg hover:bg-[#f5f1ed] transition-colors font-semibold inline-flex items-center gap-2"
            >
              <Info className="w-5 h-5" />
              privacy@ciyatake.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="px-4 py-8 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8b7355] text-sm">
            By continuing to use Ciyatake, you consent to our use of cookies as described in this Cookie Policy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
