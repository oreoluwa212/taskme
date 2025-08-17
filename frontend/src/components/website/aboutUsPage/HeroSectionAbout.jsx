import React from "react";
import { heroAbout } from "../../../../public";

function HeroSectionAbout() {
  return (
    <div
      className="w-full flex items-center justify-center bg-cover bg-center bg-no-repeat  h-[90vh]"
      style={{ backgroundImage: `url(${heroAbout})` }}
    >
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-white lgss:text-left text-center font-bold text-2xl lg:text-4xl px-4 lgss:w-[50%]">
          On a mission to revolutionize how people manage their tasks and
          projects with the help of AI.
        </h1>
      </div>
    </div>
  );
}

export default HeroSectionAbout;