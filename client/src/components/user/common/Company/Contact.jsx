import { useEffect, useState } from "react";
import {HashLink} from "react-router-hash-link";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Send,
  CheckCircle,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  HeadphonesIcon,
  Package,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "care@ciyatake.com",
      subContent: "support@ciyatake.com",
      link: "mailto:care@ciyatake.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 98765 43210",
      subContent: "+91 98765 43211",
      link: "tel:+919876543210",
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Monday to Saturday",
      subContent: "9:00 AM - 6:00 PM IST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Fashion Street, Andheri East",
      subContent: "Mumbai, Maharashtra 400069",
    },
  ];

  const quickLinks = [
    {
      icon: Package,
      title: "Track Order",
      description: "Check your order status and delivery updates",
      link: "/track-order",
    },
    {
      icon: RefreshCw,
      title: "Returns & Refunds",
      description: "Learn about our return and refund policy",
      link: "/returns",
    },
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Find answers to commonly asked questions",
      link: "/faqs",
    },
    {
      icon: HeadphonesIcon,
      title: "Customer Care",
      description: "Browse our complete help center",
      link: "/help",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      link: "https://facebook.com/ciyatake",
      label: "Facebook",
    },
    {
      icon: Instagram,
      link: "https://instagram.com/ciyatake",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      link: "https://linkedin.com/company/ciyatake",
      label: "LinkedIn",
    },
    { icon: Twitter, link: "https://twitter.com/ciyatake", label: "Twitter" },
  ];

  const subjectOptions = [
    "General Inquiry",
    "Order Issue",
    "Product Question",
    "Return Request",
    "Payment Issue",
    "Shipping Inquiry",
    "Feedback",
    "Partnership/Business",
    "Other",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white py-20 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 font-semibold transition-all duration-200 border-2 border-white rounded-lg shadow-md sm:mb-8 hover:text-black hover:shadow-xl hover:scale-105 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <MessageSquare className="w-16 h-16" />
          </div>
          <h1 className="mb-6 text-5xl font-bold">Get in Touch</h1>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed opacity-90">
            We're here to help! Whether you have a question about your order,
            need product recommendations, or just want to share feedback, our
            friendly team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="p-8 bg-white rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold text-[#6b5847] mb-2">
                Send Us a Message
              </h2>
              <p className="text-[#8b7355] mb-6">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>

              {submitted ? (
                <div className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-semibold text-[#6b5847] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[#8b7355]">
                    Thank you for reaching out. We'll respond to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                      placeholder="Your full name"
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
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Phone Number{" "}
                      <span className="text-sm text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                    >
                      <option value="">Select a subject</option>
                      {subjectOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
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
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#8b7355] text-white px-6 py-4 rounded-lg hover:bg-[#6b5847] transition-colors font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-[#6b5847] mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="p-6 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-[#f5f1ed] p-3 rounded-lg">
                          <info.icon className="w-6 h-6 text-[#8b7355]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#6b5847] mb-1">
                            {info.title}
                          </h3>
                          {info.link ? (
                            <HashLink
                              to={info.link}
                              className="text-[#8b7355] hover:text-[#6b5847] block"
                            >
                              {info.content}
                            </HashLink>
                          ) : (
                            <p className="text-[#8b7355]">{info.content}</p>
                          )}
                          <p className="text-[#8b7355] text-sm">
                            {info.subContent}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-[#6b5847] mb-4">
                  Connect With Us
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <HashLink
                      key={index}
                      to={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f5f1ed] p-3 rounded-lg hover:bg-[#8b7355] hover:text-white transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-6 h-6" />
                    </HashLink>
                  ))}
                </div>
              </div>

              {/* Live Chat CTA */}
              <div className="bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <MessageSquare className="flex-shrink-0 w-8 h-8" />
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Need Instant Help?
                    </h3>
                    <p className="mb-4 opacity-90">
                      Chat with our customer support team for immediate
                      assistance.
                    </p>
                    <button className="bg-white text-[#6b5847] px-6 py-2 rounded-lg hover:bg-[#f5f1ed] transition-colors font-semibold">
                      Start Live Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Links */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#6b5847] text-center mb-4">
            Quick Help
          </h2>
          <p className="text-center text-[#8b7355] mb-12 max-w-2xl mx-auto">
            Looking for something specific? These links might help you find what
            you need faster.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link, index) => (
              <HashLink
                key={index}
                to={link.link}
                className="bg-[#f5f1ed] p-6 rounded-lg hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <link.icon className="w-10 h-10 text-[#8b7355] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-[#6b5847] mb-2">
                  {link.title}
                </h3>
                <p className="text-[#8b7355] text-sm mb-3">
                  {link.description}
                </p>
                <span className="text-[#8b7355] font-semibold text-sm flex items-center gap-1">
                  Learn More
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </HashLink>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#6b5847] text-center mb-12">
            Find Us
          </h2>
          <div className="p-4 overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="w-full h-96 bg-[#f5f1ed] rounded-lg flex items-center justify-center">
              <div className="text-center text-[#8b7355]">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p className="font-semibold">
                  123 Fashion Street, Andheri East
                </p>
                <p>Mumbai, Maharashtra 400069</p>
                <p className="mt-2 text-sm">
                  (Google Maps integration can be added here)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">We're Here to Help</h2>
          <p className="mb-8 text-xl leading-relaxed opacity-90">
            Have a question or concern? Send us a message and our dedicated
            support team will respond within 24 hours. Your satisfaction is our
            priority.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="mailto:care@ciyatake.com"
              className="bg-white text-[#6b5847] px-8 py-4 rounded-lg hover:bg-[#f5f1ed] transition-colors font-semibold text-lg inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
            <a
              href="tel:+919876543210"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#6b5847] transition-colors font-semibold text-lg inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <HelpCircle className="w-12 h-12 text-[#8b7355] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#6b5847] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#8b7355] mb-8">
            Many questions can be answered quickly in our FAQ section. Check it
            out before reaching out!
          </p>
          <a
            href="/faqs"
            className="bg-[#8b7355] text-white px-8 py-4 rounded-lg hover:bg-[#6b5847] transition-colors font-semibold text-lg inline-flex items-center gap-2"
          >
            Visit FAQ Center
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
