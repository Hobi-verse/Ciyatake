import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Heart,
  TrendingUp,
  Award,
  Coffee,
  GraduationCap,
  Globe,
  MapPin,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  X,
  Upload,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    coverLetter: "",
    resume: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const jobs = [
    {
      id: 1,
      title: "Senior Product Manager",
      department: "Product",
      location: "Mumbai, India",
      type: "Full-time",
      description:
        "Lead product strategy and drive innovation for our e-commerce platform.",
      responsibilities: [
        "Define product roadmap and prioritize features",
        "Collaborate with engineering and design teams",
        "Analyze market trends and customer feedback",
        "Drive product launches and measure success metrics",
      ],
      requirements: [
        "5+ years in product management",
        "E-commerce experience preferred",
        "Strong analytical and leadership skills",
        "Excellent communication abilities",
      ],
      benefits: [
        "Competitive salary package",
        "Health insurance for you and family",
        "Flexible work arrangements",
        "Learning and development budget",
      ],
    },
    {
      id: 2,
      title: "UX/UI Designer",
      department: "Design",
      location: "Bangalore, India",
      type: "Full-time",
      description:
        "Create beautiful and intuitive user experiences for our customers.",
      responsibilities: [
        "Design user interfaces for web and mobile",
        "Conduct user research and usability testing",
        "Create wireframes, prototypes, and high-fidelity designs",
        "Collaborate with product and engineering teams",
      ],
      requirements: [
        "3+ years of UX/UI design experience",
        "Proficiency in Figma, Sketch, or Adobe XD",
        "Strong portfolio demonstrating design skills",
        "Understanding of user-centered design principles",
      ],
      benefits: [
        "Creative and collaborative work environment",
        "Latest design tools and resources",
        "Conference and workshop attendance",
        "Flexible working hours",
      ],
    },
    {
      id: 3,
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description:
        "Build scalable features and improve our e-commerce platform.",
      responsibilities: [
        "Develop and maintain web applications",
        "Write clean, maintainable code",
        "Collaborate with cross-functional teams",
        "Participate in code reviews and technical discussions",
      ],
      requirements: [
        "3+ years of full stack development experience",
        "Proficiency in React, Node.js, and databases",
        "Experience with cloud platforms (AWS/Azure)",
        "Strong problem-solving skills",
      ],
      benefits: [
        "Remote work flexibility",
        "Competitive compensation",
        "Latest tech stack and tools",
        "Career growth opportunities",
      ],
    },
    {
      id: 4,
      title: "Digital Marketing Manager",
      department: "Marketing",
      location: "Delhi, India",
      type: "Full-time",
      description:
        "Drive customer acquisition and brand awareness through digital channels.",
      responsibilities: [
        "Plan and execute digital marketing campaigns",
        "Manage social media presence and content",
        "Analyze campaign performance and optimize ROI",
        "Collaborate with creative and product teams",
      ],
      requirements: [
        "4+ years in digital marketing",
        "Experience with SEO, SEM, and social media",
        "Data-driven mindset with analytics skills",
        "Creative thinking and strategic planning",
      ],
      benefits: [
        "Dynamic and fast-paced environment",
        "Marketing tools and platforms access",
        "Performance bonuses",
        "Team events and workshops",
      ],
    },
    {
      id: 5,
      title: "Customer Success Specialist",
      department: "Customer Support",
      location: "Pune, India",
      type: "Full-time",
      description:
        "Ensure exceptional customer experiences and build lasting relationships.",
      responsibilities: [
        "Handle customer inquiries and resolve issues",
        "Provide product guidance and support",
        "Gather customer feedback for improvements",
        "Maintain high customer satisfaction scores",
      ],
      requirements: [
        "2+ years in customer service or support",
        "Excellent communication skills",
        "Problem-solving mindset",
        "Empathy and patience with customers",
      ],
      benefits: [
        "Comprehensive training program",
        "Career advancement opportunities",
        "Employee recognition programs",
        "Friendly team culture",
      ],
    },
    {
      id: 6,
      title: "Supply Chain Analyst",
      department: "Operations",
      location: "Mumbai, India",
      type: "Full-time",
      description:
        "Optimize logistics and inventory management for efficient operations.",
      responsibilities: [
        "Analyze supply chain data and identify improvements",
        "Coordinate with vendors and logistics partners",
        "Monitor inventory levels and forecast demand",
        "Implement process improvements",
      ],
      requirements: [
        "3+ years in supply chain or operations",
        "Strong analytical and Excel skills",
        "Experience with ERP systems",
        "Attention to detail and organization",
      ],
      benefits: [
        "Impactful role in growing company",
        "Professional development opportunities",
        "Collaborative work environment",
        "Competitive benefits package",
      ],
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health Insurance",
      description: "Comprehensive coverage for you and your family",
    },
    {
      icon: GraduationCap,
      title: "Learning Budget",
      description: "Annual budget for courses, books, and conferences",
    },
    {
      icon: Coffee,
      title: "Flexible Hours",
      description: "Work-life balance with flexible scheduling",
    },
    {
      icon: Globe,
      title: "Remote Options",
      description: "Work from anywhere for eligible positions",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Clear paths for advancement and mentorship",
    },
    {
      icon: Users,
      title: "Team Events",
      description: "Regular team building and social activities",
    },
  ];

  const values = [
    {
      icon: Award,
      title: "Innovation",
      description: "We embrace creativity and new ideas",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Our customers are at the heart of everything",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We achieve more when we work together",
    },
    {
      icon: CheckCircle,
      title: "Integrity",
      description: "We do the right thing, always",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Product Designer",
      quote:
        "Ciyatake has given me the freedom to innovate and grow. The team culture is incredibly supportive and collaborative.",
      image: "👩‍💼",
    },
    {
      name: "Rahul Verma",
      role: "Senior Developer",
      quote:
        "Working here means being part of something meaningful. The projects are challenging and the people are amazing.",
      image: "👨‍💻",
    },
    {
      name: "Ananya Patel",
      role: "Marketing Lead",
      quote:
        "The work-life balance and growth opportunities at Ciyatake are unmatched. I love coming to work every day.",
      image: "👩‍🎨",
    },
  ];

  const faqs = [
    {
      question: "How do I apply for a position?",
      answer:
        'Click on "Apply Now" for any open position, fill out the application form with your details, and upload your resume. Our team will review your application and contact you if there\'s a match.',
    },
    {
      question: "Do you offer internship opportunities?",
      answer:
        "Yes! We regularly offer internships across various departments. Check our job listings for current internship openings or send your resume to careers@ciyatake.com.",
    },
    {
      question: "Can I apply for multiple positions?",
      answer:
        "Absolutely! If you believe you're a good fit for multiple roles, feel free to apply for each position that interests you.",
    },
    {
      question: "What is the interview process like?",
      answer:
        "Our interview process typically includes an initial phone screening, followed by technical or role-specific interviews, and a final round with the team. We aim to make it conversational and comfortable.",
    },
    {
      question: "Do you offer remote work options?",
      answer:
        "Many of our positions offer remote or hybrid work arrangements. Specific details are mentioned in each job listing.",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would submit this to your backend
    console.log("Application submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowApplicationForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        coverLetter: "",
        resume: null,
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
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 font-semibold transition-all duration-200 border-2 border-white rounded-lg shadow-md sm:mb-8 hover:text-black hover:shadow-xl hover:scale-105 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Briefcase className="w-16 h-16" />
          </div>
          <h1 className="mb-6 text-5xl font-bold">Join the Ciyatake Team</h1>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed opacity-90">
            At Ciyatake, we're building more than just an e-commerce platform.
            We're creating a community where innovation meets passion, and every
            team member plays a vital role in helping our customers celebrate
            life's everyday moments in style.
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#6b5847] text-center mb-12">
            Why Work With Us
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-8 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
              >
                <benefit.icon className="w-12 h-12 text-[#8b7355] mb-4" />
                <h3 className="text-xl font-semibold text-[#6b5847] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[#8b7355]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#6b5847] text-center mb-4">
            Our Values
          </h2>
          <p className="text-center text-[#8b7355] mb-12 max-w-2xl mx-auto">
            These principles guide everything we do and shape our culture
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f5f1ed] rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-[#8b7355]" />
                </div>
                <h3 className="text-xl font-semibold text-[#6b5847] mb-2">
                  {value.title}
                </h3>
                <p className="text-[#8b7355]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#6b5847] text-center mb-4">
            Open Positions
          </h2>
          <p className="text-center text-[#8b7355] mb-12 max-w-2xl mx-auto">
            Discover your next career opportunity with us
          </p>
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-[#6b5847] mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-[#8b7355] mb-3">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                    <p className="text-[#8b7355]">{job.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="bg-[#8b7355] text-white px-6 py-3 rounded-lg hover:bg-[#6b5847] transition-colors flex items-center gap-2 justify-center"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#6b5847] text-center mb-4">
            Meet Our Team
          </h2>
          <p className="text-center text-[#8b7355] mb-12 max-w-2xl mx-auto">
            Hear from the people who make Ciyatake special
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#f5f1ed] p-8 rounded-lg">
                <div className="mb-4 text-6xl">{testimonial.image}</div>
                <p className="text-[#6b5847] mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-[#6b5847]">
                    {testimonial.name}
                  </p>
                  <p className="text-[#8b7355] text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#6b5847] text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-[#6b5847] mb-3">
                  {faq.question}
                </h3>
                <p className="text-[#8b7355] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#8b7355] to-[#6b5847] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">Ready to Join Us?</h2>
          <p className="mb-8 text-xl opacity-90">
            Don't see a position that fits? Send us your resume anyway. We're
            always looking for talented people.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 mb-8 sm:flex-row">
            <a
              href="mailto:careers@ciyatake.com"
              className="flex items-center gap-2 text-lg"
            >
              <Mail className="w-5 h-5" />
              careers@ciyatake.com
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-lg"
            >
              <Phone className="w-5 h-5" />
              +91 98765 43210
            </a>
          </div>
          <button
            onClick={() => setShowApplicationForm(true)}
            className="bg-white text-[#6b5847] px-8 py-4 rounded-lg hover:bg-[#f5f1ed] transition-colors font-semibold text-lg inline-flex items-center gap-2"
          >
            Apply Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-start justify-between p-6 bg-white border-b border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-[#6b5847] mb-2">
                  {selectedJob.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-[#8b7355]">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {selectedJob.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedJob.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-[#8b7355] hover:text-[#6b5847] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#6b5847] mb-3">
                  About the Role
                </h3>
                <p className="text-[#8b7355] leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#6b5847] mb-3">
                  Responsibilities
                </h3>
                <ul className="space-y-2">
                  {selectedJob.responsibilities.map((resp, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-[#8b7355]"
                    >
                      <CheckCircle className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#6b5847] mb-3">
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-[#8b7355]"
                    >
                      <CheckCircle className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#6b5847] mb-3">
                  What We Offer
                </h3>
                <ul className="space-y-2">
                  {selectedJob.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-[#8b7355]"
                    >
                      <CheckCircle className="w-5 h-5 text-[#8b7355] flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setFormData({ ...formData, position: selectedJob.title });
                    setShowApplicationForm(true);
                    setSelectedJob(null);
                  }}
                  className="w-full bg-[#8b7355] text-white px-6 py-4 rounded-lg hover:bg-[#6b5847] transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                >
                  Apply for this Position
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 bg-white border-b border-gray-200">
              <h2 className="text-3xl font-bold text-[#6b5847]">Apply Now</h2>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-[#8b7355] hover:text-[#6b5847] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-semibold text-[#6b5847] mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-[#8b7355]">
                    Thank you for applying. We'll review your application and
                    get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Position Applying For *
                    </label>
                    <select
                      id="position"
                      name="position"
                      required
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                    >
                      <option value="">Select a position</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.title}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="resume"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Resume / CV *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#8b7355] transition-colors">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        required
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      <label htmlFor="resume" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-[#8b7355] mx-auto mb-2" />
                        <p className="text-[#8b7355] font-semibold mb-1">
                          {formData.resume
                            ? formData.resume.name
                            : "Click to upload your resume"}
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF, DOC, or DOCX (Max 5MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="coverLetter"
                      className="block text-[#6b5847] font-semibold mb-2"
                    >
                      Cover Letter
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b7355]"
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#8b7355] text-white px-6 py-4 rounded-lg hover:bg-[#6b5847] transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                  >
                    Submit Application
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
