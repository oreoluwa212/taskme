// components/webApp/PageHeader.jsx
import React from "react";
import { FaPlus, FaBars, FaTimes } from "react-icons/fa";
import HeaderTexts from "./HeaderTexts";

const PageHeader = ({
  title,
  subtitle,
  onCreateProject,
  isMobileMenuOpen,
  setMobileMenuOpen,
  showMobileMenu = false,
}) => {
  return (
    <div className="w-full pt-4 pb-8">
      {/* Mobile Menu Toggle */}
      {showMobileMenu && (
        <div className="lgss:hidden pt-5 px-[5%] flex w-full justify-end">
          {isMobileMenuOpen ? (
            <FaTimes
              onClick={() => setMobileMenuOpen(false)}
              className="cursor-pointer text-secondary text-xl"
            />
          ) : (
            <FaBars
              onClick={() => setMobileMenuOpen(true)}
              className="cursor-pointer text-secondary text-xl"
            />
          )}
        </div>
      )}

      {/* Header Section */}
      <div className="flex pt-6 flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-4">
        <HeaderTexts h2={title} p={subtitle} />
        <div className="flex items-center gap-3">
          <CreateProjectButton onClick={onCreateProject} />
        </div>
      </div>
    </div>
  );
};

const CreateProjectButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    <FaPlus size={14} />
    <span>Add Project</span>
  </button>
);

export default PageHeader;
