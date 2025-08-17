// src/components/webApp/cards/HomeCard.jsx
import React from "react";

const HomeCard = ({ title, value, className, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 flex items-center gap-6 justify-center text-center min-h-[140px] w-full">
      {/* Icon */}
      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
        <img src={icon} alt="" />
      </div>

      <div className="flex flex-col items-start justify-center text-center">
        {/* Value */}
        <div
          className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 ${className}`}
        >
          {value || 0}
        </div>

        {/* Title */}
        <p className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">
          {title}
        </p>
      </div>
    </div>
  );
};

export default HomeCard;
