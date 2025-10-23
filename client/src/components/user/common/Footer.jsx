import {
  ShoppingBag,
  Mail,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#f5f1e8] text-gray-800">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-8 h-8 text-[#8b7355]" />
              <h3 className="text-2xl font-semibold text-[#8b7355]">Ciyatake</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              Thoughtfully curated fashion and lifestyle essentials to help you
              celebrate everyday moments in style.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:care@ciyatake.com"
                className="flex items-center text-sm text-[#a08968] hover:text-[#8b7355] transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                care@ciyatake.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center text-sm text-[#a08968] hover:text-[#8b7355] transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                +91 98765 43210
              </a>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Monday to Saturday, 9:00 AM – 6:00 PM IST
              </div>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#8b7355]">SHOP</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop/women"
                  onClick={handleLinkClick}
                  className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/men"
                  onClick={handleLinkClick}
                  className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/kids"
                  onClick={handleLinkClick}
                  className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
                >
                  Kids
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/accessories"
                  onClick={handleLinkClick}
                  className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/home-living"
                  onClick={handleLinkClick}
                  className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
                >
                  Home & Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#8b7355]">
              HELP & SUPPORT
            </h4>
            <ul className="flex flex-col space-y-2">
              <Link
                to="/track-order"
                onClick={handleLinkClick}
                className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
              >
                Track Order
              </Link>
              <Link
                to="/return-policy"
                onClick={handleLinkClick}
                className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
              >
                Return Policy
              </Link>
              <Link
                to="/refund-policy"
                onClick={handleLinkClick}
                className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
              >
                Refunds Policy
              </Link>
              <Link
                to="/shipping-policy"
                onClick={handleLinkClick}
                className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
              >
                Shipping Policy
              </Link>
              <Link
                to="/FAQs"
                onClick={handleLinkClick}
                className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
              >
                FAQs
              </Link>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#8b7355]">
              COMPANY
            </h4>
            <ul className="flex flex-col space-y-2">
              <Link
                to="/our-story"
                onClick={handleLinkClick}
                className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
              >
                Our Story
              </Link>
              <Link
                to="/career-page"
                onClick={handleLinkClick}
                className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
              >
                Careers
              </Link>
              <Link
                to="/press"
                onClick={handleLinkClick}
                className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
              >
                Press
              </Link>
              <Link
                to="/contact-us"
                onClick={handleLinkClick}
                className="text-sm text-gray-700 hover:text-[#8b7355] transition-colors"
              >
                Contact
              </Link>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-gray-300">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#a08968] hover:bg-[#8b7355] hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#a08968] hover:bg-[#8b7355] hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#a08968] hover:bg-[#8b7355] hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#a08968] hover:bg-[#8b7355] hover:text-white transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 md:justify-end">
              <Link
                to="/privacy-policy"
                onClick={handleLinkClick}
                className="hover:text-[#8b7355] transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link
                to="/terms-of-service"
                onClick={handleLinkClick}
                className="hover:text-[#8b7355] transition-colors"
              >
                Terms of Service
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link
                to="/cookie-policy"
                onClick={handleLinkClick}
                className="hover:text-[#8b7355] transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-sm text-center text-gray-600">
            © {new Date().getFullYear()} Ciyatake. All rights reserved.
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#8b7355] text-white shadow-lg hover:bg-[#a08968] transition-all flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
