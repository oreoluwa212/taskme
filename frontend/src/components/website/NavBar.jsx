// src/components/website/NavBar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";
import { logo } from "../../../public";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navigationItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Features", path: "/features" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="w-full relative">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
            : "bg-white shadow-lg py-4 lg:py-7"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-[5%] w-full">
          {/* Logo Section */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-2 h-2 rounded-full bg-primary bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300 transform group-hover:scale-110"></div>
            <Link to="/" className="group">
              <img
                className={`w-auto transition-all duration-300 group-hover:scale-105 ${
                  scrolled ? "h-8" : "h-8 sm:h-10"
                }`}
                src={logo}
                alt="TaskMe Logo"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-6 items-center font-semibold text-gray-700">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`relative group transition-colors duration-200 ${
                      location.pathname === item.path
                        ? "text-primary"
                        : "text-gray-700 hover:text-primary"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        location.pathname === item.path
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="font-semibold hover:text-primary"
              >
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                variant="primary"
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            aria-label="Toggle navigation menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 h-6 w-6 text-gray-700 transition-all duration-300 ${
                  isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <X
                className={`absolute inset-0 h-6 w-6 text-gray-700 transition-all duration-300 ${
                  isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div
        className={`${
          scrolled ? "h-16" : "h-20 lg:h-24"
        } transition-all duration-300`}
      ></div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      >
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 flex flex-col transition-all duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Link to="/" onClick={closeMenu}>
              <img className="h-8 w-auto" src={logo} alt="TaskMe Logo" />
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close navigation menu"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Mobile Navigation Content */}
          <div className="flex-1 flex flex-col px-6 py-8">
            <nav className="flex-1">
              <ul className="space-y-1 mb-8">
                {navigationItems.map((item, index) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className={`block px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:translate-x-2 ${
                        location.pathname === item.path
                          ? "text-primary bg-gray-100"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile Auth Actions */}
              <div className="space-y-4">
                <Link to="/signup" onClick={closeMenu} className="block">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/login" onClick={closeMenu} className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    Log In
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
