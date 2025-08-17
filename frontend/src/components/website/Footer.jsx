// src/components/website/Footer.jsx
import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    main: [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Features", path: "/features" },
    ],
    legal: [
      { label: "Contact", path: "/contact" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Use", path: "/terms" },
    ],
    social: [
      { label: "Instagram", icon: Instagram, path: "https://instagram.com" },
      { label: "Twitter", icon: Twitter, path: "https://twitter.com" },
      { label: "LinkedIn", icon: Linkedin, path: "https://linkedin.com" },
    ],
  };

  return (
    <footer className="bg-secondary text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">TaskMe</h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Helping you boost your productivity level with intelligent task
              management and AI-powered solutions.
            </p>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Navigation</h3>
              <ul className="space-y-2">
                {footerLinks.main.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
              <ul className="space-y-2">
                {footerLinks.social.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.path}>
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
                      >
                        <IconComponent className="h-4 w-4" />
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-600 mt-8 lg:mt-12 pt-6 lg:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm text-center sm:text-left">
              © 2025 TaskMe. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy
              </Link>
              <span className="text-gray-500">•</span>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
