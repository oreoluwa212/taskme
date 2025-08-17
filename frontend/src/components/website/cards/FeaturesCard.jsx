import React from "react";

const FeaturesCard = ({ title, description, imageUrl, className }) => {
  return (
    <div className="bg-white shadow-lg shadow-gray-300/50 h-full max-w-[380px] w-[90%] rounded-[8px] flex flex-col justify-between items-start text-center py-10 px-8">
      {imageUrl && (
        <div className={`${className} p-3 rounded-[16px] bg-[#E6F0FF] mb-6`}>
          <img src={imageUrl} alt={title} className="h-10 w-10 object-cover" />
        </div>
      )}
      <h2 className="text-xl text-red font-bold my-3">{title}</h2>
      <p className="text-left text-gray-700 pt-2 font-semibold">
        {description}
      </p>
    </div>
  );
};

export default FeaturesCard;
