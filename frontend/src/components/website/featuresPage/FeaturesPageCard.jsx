import React from "react";

const FeaturesPageCard = ({ title, description, imageUrl, className }) => {
  return (
    <div className="bg-white shadow-custom-xl shadow-gray-300/50 h-fit max-w-[350px] w-[90%] rounded-[8px] flex flex-col justify-center items-start text-center py-10 pl-7 pr-3">
      {imageUrl && (
        <div className={`${className} p-3 rounded-[16px] bg-[#DDEEDF] mb-6`}>
          <img src={imageUrl} alt={title} className="h-10 w-10 object-cover" />
        </div>
      )}
      <h2 className="text-xl text-red font-bold my-3 text-primary">{title}</h2>
      <p className="text-left text-gray-700 pt-2 font-medium">{description}</p>
    </div>
  );
};

export default FeaturesPageCard;
