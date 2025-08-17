// src/components/layout/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "../webApp/Sidebar";
import Header from "../webApp/Header";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar open/close
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop sidebar collapse
  const [screenSize, setScreenSize] = useState("desktop"); // Track screen size

  // Enhanced responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newScreenSize = "desktop";

      if (width < 1024) {
        newScreenSize = "mobile";
      } else if (width < 1280) {
        newScreenSize = "tablet";
      }

      // Only update if screen size category actually changed
      if (newScreenSize !== screenSize) {
        setScreenSize(newScreenSize);

        if (newScreenSize === "mobile") {
          // On mobile, always close the overlay sidebar
          setIsOpen(false);
        } else if (newScreenSize === "tablet") {
          // On tablet/small desktop, auto-collapse sidebar to save space
          setIsCollapsed(true);
          setIsOpen(false);
        } else {
          // On large desktop, you can choose to keep current state or expand
          // For now, keeping whatever state was set by user
          setIsOpen(false); // Ensure mobile overlay is closed
        }
      }
    };

    // Set initial state
    handleResize();

    // Add event listener with debounce to prevent excessive calls
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [screenSize]);

  // Handle sidebar state changes with smooth transitions
  const handleSidebarToggle = (newIsOpen) => {
    setIsOpen(newIsOpen);
  };

  const handleSidebarCollapse = (newIsCollapsed) => {
    setIsCollapsed(newIsCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={handleSidebarToggle}
        isCollapsed={isCollapsed}
        setIsCollapsed={handleSidebarCollapse}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header - Only show hamburger menu and title */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center fixed top-0 left-0 right-0 z-40">
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          <button
            onClick={() => handleSidebarToggle(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Desktop Header - Sticky positioned */}
        <div className="hidden lg:block sticky top-0 z-30">
          <Header isCollapsed={isCollapsed} />
        </div>

        {/* Mobile Header Content (Search, notifications, etc.) - Fixed positioned */}
        <div className="lg:hidden fixed top-16 left-0 right-0 z-30">
          <Header isCollapsed={false} isMobile={true} />
        </div>

        {/* Main Content Area with proper spacing */}
        <main className="flex-1 overflow-auto pt-32 lg:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
