// src/components/ui/Modal.jsx
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useModal } from "../../hooks/useModal";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnOverlayClick = true,
  size = "md", // 'sm', 'md', 'lg', 'xl', 'full'
  className = "",
  overlayClassName = "",
}) => {
  // Use the modal hook to handle body scroll lock
  useModal(isOpen);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full mx-4",
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-overlay bg-black bg-opacity-50 ${overlayClassName}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <div
          className={`modal-content w-full ${sizeClasses[size]} ${className}`}
        >
          {/* Header with close button */}
          {(title || showCloseButton) && (
            <div className="modal-header-sticky flex items-center justify-between p-4 pb-2">
              {title && (
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
