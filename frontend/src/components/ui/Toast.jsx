// src/components/ui/Toast.jsx
import React, { useEffect } from "react";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi";

const Toast = ({ type = "info", message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <HiCheckCircle className="text-green-500" size={20} />,
    error: <HiXCircle className="text-red-500" size={20} />,
    info: <HiInformationCircle className="text-blue-500" size={20} />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg ${bgColors[type]}`}
    >
      <div className="flex items-center">
        {icons[type]}
        <p className="ml-3 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
