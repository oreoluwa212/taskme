import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ projectId, projectName, percent, dueDate }) => {
  return (
    <div className="w-full rounded-[20px] bg-white h-fit py-5 shadow-custom-xl flex justify-between px-7 items-center text-sm">
      <div className="flex flex-col gap-2 w-[25%] border-r-2 border-primary text-left">
        <h3 className="text-grey font-medium">Project Name</h3>
        <p>{projectName}</p>
      </div>
      <div className="flex flex-col gap-2 w-[20%] border-r-2 border-primary ">
        <h3>Progress</h3>
        <p>{percent}% Complete</p>
      </div>
      <div className="flex flex-col gap-2 w-[20%] border-r-2 border-primary ">
        <h3>Deadline</h3>
        <p>{dueDate}</p>
      </div>
      <Link
        to={`/project/${projectId}/details`}
        className="text-primary font-semibold hover:underline"
      >
        View Project
      </Link>
    </div>
  );
};

export default ProjectCard;
