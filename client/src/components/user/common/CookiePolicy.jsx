import { Cookie, Shield, Settings, Eye, BarChart, Target, CheckCircle, Info, Globe, Calendar, AlertCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { HashLink } from 'react-router-hash-link';

const CookiePolicy = () => {
  const lastUpdated = "October 19, 2025";
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    performance: true,
    functional: true,
    marketing: true
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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

      {/* Navigation */}
      <section className="sticky top-0 z-10 px-4 py-4 bg-white shadow-sm md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-between w-full px-4 py-3 text-[#8b7355] hover:text-[#6b5847] bg-[#f5f1ed] rounded-lg transition-colors"
            >
              <span className="font-semibold">Quick Navigation</span>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {mobileMenuOpen && (
              <div className="mt-2 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-96">
                {sections.map((section) => (
                  <HashLink
                    key={section.id}
                    smooth
                    to={`#section-${section.id}`}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-[#8b7355] hover:text-[#6b5847] hover:bg-[#f5f1ed] transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <section.icon className="flex-shrink-0 w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </HashLink>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="flex-wrap justify-center hidden gap-3 md:flex">
            {sections.map((section) => (
              <HashLink
                key={section.id}
                smooth
                to={`#section-${section.id}`}
                className="text-sm text-[#8b7355] hover:text-[#6b5847] hover:bg-[#f5f1ed] px-4 py-2 rounded-lg transition-colors"
              >
                {section.title}
              </HashLink>
            ))}
          </div>
        </div>
      </section>

      {/* Preferences Panel */}
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
                            cookieSettings[category.name] ? 'bg-[#8b7355]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              cookieSettings[category.name] ? 'translate-x-7' : 'translate-x-1'
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

      {/* Content Sections */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section) => (
            <div key={section.id} id={`section-${section.id}`} className="p-8 bg-white rounded-lg shadow-sm scroll-mt-24">
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

      {/* Summary */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#6b5847] text-center mb-12">Cookie Policy Summary</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Transparency</h3>
              <p className="text-[#8b7355]">We clearly explain what cookies we use, why we use them, and how they benefit you.</p>
            </div>
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Your Control</h3>
              <p className="text-[#8b7355]">Manage your cookie preferences anytime through our settings panel or browser controls.</p>
            </div>
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Privacy Protection</h3>
              <p className="text-[#8b7355]">We respect your privacy and only use cookies that improve your shopping experience.</p>
            </div>
            <div className="bg-[#f5f1ed] p-6 rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#8b7355] mb-3" />
              <h3 className="text-xl font-semibold text-[#6b5847] mb-2">Regular Updates</h3>
              <p className="text-[#8b7355]">We keep this policy current and notify you of any significant changes to our practices.</p>
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

      {/* Footer */}
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
