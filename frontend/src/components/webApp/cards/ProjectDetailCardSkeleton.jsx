// components/webApp/cards/ProjectDetailCardSkeleton.jsx
import React from "react";

const ProjectDetailCardSkeleton = () => {
  return (
    <div className="bg-white w-[350px] rounded-[12px] shadow-custom-xl px-4 py-6 font-lato flex-shrink-0 animate-pulse">
      <ul className="flex flex-col gap-3 text-sm">
        {/* Project Name Skeleton */}
        <li className="flex items-start">
          <div className="h-5 bg-gray-200 rounded w-24 mr-2"></div>
          <div className="h-5 bg-gray-300 rounded flex-1"></div>
        </li>

        {/* Timeline Skeleton */}
        <li className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-16 mr-2"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </li>

        {/* Start Date Skeleton */}
        <li className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-20 mr-2"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </li>

        {/* Due Date Skeleton */}
        <li className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-18 mr-2"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </li>
      </ul>

      {/* Progress Bar Skeleton */}
      <div className="flex gap-9 items-center mt-8">
        <div className="flex-grow bg-gray-200 rounded-full h-2.5 mr-2"></div>
        <div className="h-4 bg-gray-300 rounded w-10"></div>
      </div>

      {/* View Project Button Skeleton */}
      <div className="text-right text-sm mt-2">
        <div className="h-4 bg-gray-300 rounded w-20 ml-auto"></div>
      </div>
    </div>
  );
};

export default ProjectDetailCardSkeleton;
