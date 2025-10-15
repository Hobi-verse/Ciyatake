import { Link } from "react-router-dom";
import Button from "../../common/Button";

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "Women", to: "/women" },
      { label: "Men", to: "/men" },
      { label: "Kids", to: "/kids" },
      { label: "Accessories", to: "/accessories" },
      { label: "Home & Living", to: "/home-living" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Track Order", to: "/orders" },
      { label: "Returns & Refunds", to: "/returns" },
      { label: "Shipping", to: "/shipping" },
      { label: "FAQs", to: "/faqs" },
      { label: "Size Guide", to: "/size-guide" },
    ],
  },
  {
    title: "About Ciyatake",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Sustainability", to: "/sustainability" },
      { label: "Careers", to: "/careers" },
      { label: "Press", to: "/press" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const policyLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Cookies", to: "/cookies" },
];

const newsletterInputClasses =
  "flex-1 rounded-full border border-[#DCECE9] bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#b8985b] focus:outline-none focus:ring-2 focus:ring-[#b8985b]/30";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#DCECE9] bg-[#f5f2ee] text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/ciyatakeLogo.png"
                alt="Ciyatake"
                className="h-10 w-auto"
              />
              <span className="text-lg font-semibold tracking-tight text-[#b8985b]">
                Ciyatake
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-600">
              Thoughtfully curated fashion and lifestyle essentials to help you
              celebrate everyday moments in style.
            </p>

            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">Email:</span>{" "}
                <a
                  href="mailto:care@ciyatake.com"
                  className="text-[#b8985b] transition hover:text-[#a9894f]"
                >
                  care@ciyatake.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-slate-700">Phone:</span>{" "}
                <a
                  href="tel:+919876543210"
                  className="text-[#b8985b] transition hover:text-[#a9894f]"
                >
                  +91 98765 43210
                </a>
              </p>
              <p className="text-sm text-slate-500">
                Monday to Saturday, 9:00 AM – 6:00 PM IST
              </p>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="transition hover:text-[#b8985b]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#DCECE9] pt-6 text-xs text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© {currentYear} Ciyatake. All rights reserved.</p>
          <div className="mt-3 flex flex-wrap gap-4 sm:mt-0">
            {policyLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="transition hover:text-[#b8985b]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
