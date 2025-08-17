import React from "react";

const HeaderTexts = ({ h2, p, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {h2}
      </h2>
      <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
        {p}
      </p>
    </div>
  );
};

export default HeaderTexts;
