import React from "react";
import { Link } from "react-router-dom";

function ProjectDetailCard({
  projectId,
  projectName,
  dueDate,
  dueDays,
  startDate,
  progress,
}) {
  return (
    <div className="bg-white w-[350px] rounded-[12px] shadow-custom-xl px-4 py-6 font-lato flex-shrink-0">
      <ul className="flex flex-col gap-3 text-[#484B4E] text-sm">
        <li className="font-semibold text-black text-[17px]">
          Project Name: {projectName}
        </li>
        <li className="font-medium">Timeline: {dueDays} Days</li>
        <li className="font-medium">Start Date: {startDate}</li>
        <li className="font-medium">Due Date: {dueDate}</li>
      </ul>
      <div className="flex gap-9 items-center mt-8">
        <div className="flex-grow bg-gray-300 rounded-full h-2.5 mr-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-gray-700">{progress}%</span>
      </div>
      <div className="text-right text-sm mt-2">
        <Link to={`/project/${projectId}/details`}>
          <button className="text-blue-600 hover:underline">
            View Project
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ProjectDetailCard;
