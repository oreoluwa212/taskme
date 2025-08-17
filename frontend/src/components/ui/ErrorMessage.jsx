// src/components/ui/ErrorMessage.jsx
import React from "react";
import { HiExclamationCircle } from "react-icons/hi";

const ErrorMessage = ({ message, onRetry, className = "" }) => {
  return (
    <div
      className={`flex items-center p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}
    >
      <HiExclamationCircle className="text-red-500 mr-3" size={20} />
      <div className="flex-1">
        <p className="text-red-700 text-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-3 text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
