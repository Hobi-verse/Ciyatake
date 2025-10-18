import { useEffect, useState } from "react";
import {
  Newspaper,
  Download,
  ExternalLink,
  Award,
  Calendar,
  Mail,
  Phone,
  User,
  FileText,
  Image,
  Building2,
  Quote,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  ArrowLeft,
} from "lucide-react";

const Press = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    publication: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const pressReleases = [
    {
      id: 1,
      title: "Ciyatake Announces Record-Breaking Festive Season Sales",
      date: "October 15, 2025",
      category: "Company News",
      summary:
        "Ciyatake reports a 150% increase in sales during the festive season, marking the company's strongest quarter to date. The growth was driven by expanded product categories and enhanced customer experience initiatives.",
    },
    {
      id: 2,
      title: "Ciyatake Launches Sustainable Fashion Collection",
      date: "September 28, 2025",
      category: "Product Launch",
      summary:
        "In line with our commitment to sustainability, Ciyatake introduces an eco-friendly fashion line made from recycled materials and organic fabrics, partnering with local artisans and sustainable manufacturers.",
    },
    {
      id: 3,
      title: "Ciyatake Expands Operations to 50 New Cities",
      date: "August 12, 2025",
      category: "Expansion",
      summary:
        "Ciyatake announces major expansion across India, bringing same-day delivery services to 50 additional cities. This expansion is expected to serve over 10 million new customers nationwide.",
    },
    {
      id: 4,
      title: 'Ciyatake Receives "Best E-commerce Platform" Award',
      date: "July 5, 2025",
      category: "Awards",
      summary:
        'Ciyatake has been honored with the prestigious "Best E-commerce Platform of the Year" award at the India Digital Commerce Summit 2025, recognizing excellence in customer service and innovation.',
    },
    {
      id: 5,
      title: "Ciyatake Partners with Leading Electronics Brands",
      date: "June 20, 2025",
      category: "Partnerships",
      summary:
        "Ciyatake announces strategic partnerships with top electronics manufacturers, offering customers exclusive access to the latest technology products with special pricing and extended warranties.",
    },
    {
      id: 6,
      title: "Ciyatake Launches AI-Powered Shopping Assistant",
      date: "May 8, 2025",
      category: "Technology",
      summary:
        "Introducing an innovative AI shopping assistant that provides personalized product recommendations, helping customers discover products tailored to their preferences and shopping history.",
    },
  ];

  const mediaMentions = [
    {
      id: 1,
      publication: "The Economic Times",
      articleTitle: "How Ciyatake is Revolutionizing Online Shopping in India",
      date: "October 10, 2025",
      excerpt:
        "Ciyatake has emerged as a major player in India's e-commerce landscape, combining technology innovation with customer-centric service to create a shopping experience that stands out...",
      link: "https://economictimes.com",
      logo: "📰",
    },
    {
      id: 2,
      publication: "Business Standard",
      articleTitle: "E-commerce Boom: Ciyatake Reports 150% Growth",
      date: "October 5, 2025",
      excerpt:
        "The festive season has proven particularly lucrative for Ciyatake, with the company reporting unprecedented growth figures that surpass industry averages...",
      link: "https://business-standard.com",
      logo: "📊",
    },
    {
      id: 3,
      publication: "TechCrunch India",
      articleTitle:
        "Ciyatake's AI Shopping Assistant Sets New Industry Standard",
      date: "September 15, 2025",
      excerpt:
        "With its newly launched AI-powered shopping assistant, Ciyatake demonstrates how artificial intelligence can enhance the online shopping experience through personalization...",
      link: "https://techcrunch.com",
      logo: "💻",
    },
    {
      id: 4,
      publication: "Forbes India",
      articleTitle:
        "Sustainability Meets Style: Ciyatake's Green Fashion Initiative",
      date: "September 1, 2025",
      excerpt:
        "Ciyatake's commitment to sustainable fashion represents a significant shift in how e-commerce platforms approach environmental responsibility...",
      link: "https://forbesindia.com",
      logo: "🌍",
    },
    {
      id: 5,
      publication: "YourStory",
      articleTitle: "From Startup to Market Leader: The Ciyatake Journey",
      date: "August 20, 2025",
      excerpt:
        "A deep dive into how Ciyatake transformed from a small startup to one of India's most trusted e-commerce platforms, focusing on customer satisfaction and innovation...",
      link: "https://yourstory.com",
      logo: "🚀",
    },
    {
      id: 6,
      publication: "India Today",
      articleTitle:
        "Award-Winning Customer Service: Ciyatake's Success Formula",
      date: "July 10, 2025",
      excerpt:
        "Following its recent award win, we explore what makes Ciyatake's customer service approach different and how it has contributed to the company's rapid growth...",
      link: "https://indiatoday.in",
      logo: "🏆",
    },
  ];

  const mediaLogos = [
    { name: "The Economic Times", emoji: "📰" },
    { name: "Business Standard", emoji: "📊" },
    { name: "TechCrunch", emoji: "💻" },
    { name: "Forbes India", emoji: "🌍" },
    { name: "YourStory", emoji: "🚀" },
    { name: "India Today", emoji: "🏆" },
    { name: "Mint", emoji: "💼" },
    { name: "CNBC TV18", emoji: "📺" },
    { name: "Hindu BusinessLine", emoji: "📈" },
    { name: "Inc42", emoji: "🎯" },
    { name: "Business Insider", emoji: "💡" },
    { name: "Entrepreneur India", emoji: "✨" },
  ];

  const mediaResources = [
    {
      id: 1,
      title: "Brand Logo Pack",
      description:
        "High-resolution Ciyatake logos in various formats (PNG, SVG, EPS)",
      type: "Logos",
      fileSize: "2.5 MB",
      icon: Image,
    },
    {
      id: 2,
      title: "Company Overview",
      description:
        "Comprehensive company profile, mission, vision, and key milestones",
      type: "Document",
      fileSize: "450 KB",
      icon: FileText,
    },
    {
      id: 3,
      title: "Product Images",
      description: "High-resolution product photography and lifestyle shots",
      type: "Images",
      fileSize: "15 MB",
      icon: Image,
    },
    {
      id: 4,
      title: "Executive Bios",
      description: "Founder and leadership team biographies with headshots",
      type: "Document",
      fileSize: "1.2 MB",
      icon: User,
    },
    {
      id: 5,
      title: "Fact Sheet",
      description: "Key statistics, achievements, and company information",
      type: "Document",
      fileSize: "320 KB",
      icon: FileText,
    },
    {
      id: 6,
      title: "Brand Guidelines",
      description: "Complete brand identity guidelines and usage instructions",
      type: "Document",
      fileSize: "3.8 MB",
      icon: Building2,
    },
  ];

  const quotes = [
    {
      text: "Ciyatake has redefined what it means to provide exceptional customer service in the e-commerce space.",
      source: "The Economic Times",
    },
    {
      text: "A shining example of how technology and customer focus can drive exponential growth.",
      source: "Forbes India",
    },
    {
      text: "The future of online shopping in India looks bright with innovators like Ciyatake leading the way.",
      source: "TechCrunch India",
    },
  ];

  const awards = [
    {
      year: "2025",
      title: "Best E-commerce Platform of the Year",
      organization: "India Digital Commerce Summit",
    },
    {
      year: "2025",
      title: "Excellence in Customer Service Award",
      organization: "Retail Excellence Awards",
    },
    {
      year: "2024",
      title: "Fastest Growing E-commerce Company",
      organization: "Business Today",
    },
    {
      year: "2024",
      title: "Innovation in Technology Award",
      organization: "Tech Awards India",
    },
  ];

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Media inquiry submitted:", contactForm);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({
        name: "",
        email: "",
        publication: "",
        message: "",
      });
    }, 3000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white py-20 px-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 font-semibold transition-all duration-200 border-2 border-white rounded-lg shadow-md sm:mb-8 hover:text-black hover:shadow-xl hover:scale-105 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </a>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Newspaper className="w-16 h-16" />
          </div>
          <h1 className="mb-6 text-5xl font-bold">Ciyatake in the News</h1>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed opacity-90">
            Discover the latest news, press releases, and media coverage about
            Ciyatake. We're proud to share our journey, achievements, and
            commitment to transforming the e-commerce landscape in India.
          </p>
        </div>
      </section>

      {/* Press Releases */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-[#6b5847] mb-4">
              Press Releases
            </h2>
            <p className="text-[#8b7355] max-w-2xl mx-auto">
              Stay updated with our latest announcements, product launches, and
              company milestones
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {pressReleases.map((release) => (
              <div
                key={release.id}
                className="p-6 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-[#f5f1ed] text-[#6b5847] px-3 py-1 rounded-full text-sm font-semibold">
                    {release.category}
                  </span>
                  <div className="flex items-center text-[#8b7355] text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {release.date}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#6b5847] mb-3">
                  {release.title}
                </h3>
                <p className="text-[#8b7355] mb-4 leading-relaxed">
                  {release.summary}
                </p>
                <div className="flex gap-3">
                  <button className="text-[#8b7355] hover:text-[#6b5847] font-semibold text-sm flex items-center gap-1 transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="text-[#8b7355] hover:text-[#6b5847] font-semibold text-sm flex items-center gap-1 transition-colors">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Mentions */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-[#6b5847] mb-4">
              Media Mentions
            </h2>
            <p className="text-[#8b7355] max-w-2xl mx-auto">
              See what leading publications are saying about Ciyatake
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mediaMentions.map((mention) => (
              <div
                key={mention.id}
                className="bg-[#f5f1ed] p-6 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{mention.logo}</div>
                    <div>
                      <p className="font-semibold text-[#6b5847]">
                        {mention.publication}
                      </p>
                      <p className="text-sm text-[#8b7355] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {mention.date}
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#6b5847] mb-3">
                  {mention.articleTitle}
                </h3>
                <p className="text-[#8b7355] text-sm mb-4 leading-relaxed">
                  {mention.excerpt}
                </p>
                <a
                  href={mention.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8b7355] hover:text-[#6b5847] font-semibold text-sm flex items-center gap-1 transition-colors"
                >
                  Read Full Article
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured In / Brand Logos */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-[#6b5847] mb-4">
              As Featured In
            </h2>
            <p className="text-[#8b7355] max-w-2xl mx-auto">
              Trusted and recognized by leading media outlets across India
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
            {mediaLogos.map((logo, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 transition-shadow bg-white rounded-lg hover:shadow-md"
              >
                <div className="mb-2 text-4xl">{logo.emoji}</div>
                <p className="text-[#6b5847] text-sm font-semibold text-center">
                  {logo.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes / Highlights */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <Quote className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-[#6b5847] mb-4">
              What They're Saying
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {quotes.map((quote, index) => (
              <div key={index} className="bg-[#f5f1ed] p-8 rounded-lg relative">
                <Quote className="w-8 h-8 text-[#8b7355] opacity-50 mb-4" />
                <p className="text-[#6b5847] text-lg italic mb-6 leading-relaxed">
                  "{quote.text}"
                </p>
                <p className="text-[#8b7355] font-semibold">— {quote.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <Award className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-[#6b5847] mb-4">
              Awards & Recognition
            </h2>
            <p className="text-[#8b7355] max-w-2xl mx-auto">
              Honored to be recognized for our commitment to excellence and
              innovation
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {awards.map((award, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm"
              >
                <div className="bg-[#f5f1ed] p-3 rounded-lg flex-shrink-0">
                  <Award className="w-8 h-8 text-[#8b7355]" />
                </div>
                <div>
                  <div className="text-sm text-[#8b7355] font-semibold mb-1">
                    {award.year}
                  </div>
                  <h3 className="text-xl font-semibold text-[#6b5847] mb-1">
                    {award.title}
                  </h3>
                  <p className="text-[#8b7355]">{award.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit / Resources */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-[#6b5847] mb-4">
              Media Kit & Resources
            </h2>
            <p className="text-[#8b7355] max-w-2xl mx-auto">
              Download our brand assets, company information, and
              high-resolution images for your coverage
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mediaResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-[#f5f1ed] p-6 rounded-lg hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white rounded-lg">
                    <resource.icon className="w-8 h-8 text-[#8b7355]" />
                  </div>
                  <span className="text-sm text-[#8b7355] font-semibold">
                    {resource.fileSize}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#6b5847] mb-2">
                  {resource.title}
                </h3>
                <p className="text-[#8b7355] text-sm mb-4">
                  {resource.description}
                </p>
                <button className="bg-[#8b7355] text-white px-4 py-2 rounded-lg hover:bg-[#6b5847] transition-colors font-semibold text-sm flex items-center gap-2 w-full justify-center group-hover:scale-105">
                  <Download className="w-4 h-4" />
                  Download {resource.type}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="bg-[#8b7355] text-white px-8 py-4 rounded-lg hover:bg-[#6b5847] transition-colors font-semibold text-lg inline-flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Complete Media Kit
            </button>
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white p-8 rounded-lg">
              <h2 className="mb-6 text-3xl font-bold">Media Contact</h2>
              <p className="mb-8 leading-relaxed opacity-90">
                For press inquiries, interviews, or additional information,
                please reach out to our media relations team. We're here to help
                with your story.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg bg-opacity-20">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold">Media Relations Team</p>
                    <p className="opacity-90">Ciyatake Communications</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg bg-opacity-20">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold">Email</p>
                    <a
                      href="mailto:media@ciyatake.com"
                      className="transition-opacity opacity-90 hover:opacity-100"
                    >
                      media@ciyatake.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg bg-opacity-20">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold">Phone</p>
                    <a
                      href="tel:+919876543210"
                      className="transition-opacity opacity-90 hover:opacity-100"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg bg-opacity-20">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold">Available</p>
                    <p className="opacity-90">
                      Monday - Friday, 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 bg-white rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold text-[#6b5847] mb-2">
                Media Inquiry Form
              </h2>
              <p className="text-[#8b7355] mb-6">
                Send us your inquiry and we'll respond promptly
              </p>

              {submitted ? (
                <div className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-semibold text-[#6b5847] mb-2">
                    Inquiry Received!
                  </h3>
                  <p className="text-[#8b7355]">
                    Thank you for your interest. Our media team will contact you
                    soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={contactForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={contactForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                      placeholder="your.email@publication.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="publication"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Publication / Organization *
                    </label>
                    <input
                      type="text"
                      id="publication"
                      name="publication"
                      required
                      value={contactForm.publication}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                      placeholder="Publication name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={contactForm.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355] resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#8b7355] text-white px-6 py-4 rounded-lg hover:bg-[#6b5847] transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                  >
                    Submit Inquiry
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-6" />
          <h2 className="mb-6 text-4xl font-bold">
            Working on a Story About Ciyatake?
          </h2>
          <p className="mb-8 text-xl leading-relaxed opacity-90">
            We're committed to providing accurate information and timely
            responses. Our media team is ready to assist with interviews, data,
            and resources for your coverage.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="mailto:media@ciyatake.com"
              className="bg-white text-[#6b5847] px-8 py-4 rounded-lg hover:bg-[#f5f1ed] transition-colors font-semibold text-lg inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Media Team
            </a>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#6b5847] transition-colors font-semibold text-lg inline-flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download Media Kit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
