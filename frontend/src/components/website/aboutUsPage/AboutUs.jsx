import React from "react";
import HeaderBg from "../headerText/HeaderBg";

const Section = ({ title, children }) => {
  return (
    <div className="my-10 text-left">
      <h2 className="text-3xl font-bold bg-gradient-custom bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="mt-4 font-medium text-dark">{children}</p>
    </div>
  );
};

function AboutUs() {
  return (
    <div className="w-full flex flex-col justify-center items-center h-fit pb-3 pt-6 lgss:py-20 mb-10">
      <HeaderBg headerText={"about us"} />
      <div className="w-[85%] text-center flex lgss:flex-row flex-col justify-between gap-6">
        <div className="lgss:w-[45%]">
          <Section title="Our Story">
            TaskMe was born out of the collective frustration of a group of
            passionate individuals who felt overwhelmed by the complexity of
            task management tools available in the market. We believe there had
            to be a better way, a simpler, more intuitive solution that could
            help individuals stay organized, productive and focused on what
            matters most.
          </Section>
          <Section title="Our Approach">
            We're not just another task management tool, we're your trusted
            partner in productivity. Our approach is simple yet powerful; we
            combine cutting-edge technology with intuitive design to create a
            seamless task management experience. With TaskMe, you can break down
            projects into manageable tasks and track your progress in real time.
          </Section>
        </div>
        <div className="mt-[4rem] w-[2px] rounded-full bg-primary lgss:flex hidden"></div>
        <div className="lgss:w-[45%] flex flex-col">
        <Section title="Our Mission">
          Our mission is clear; to empower individuals to achieve their goals
          with ease and efficiency. We believe that everyone deserves access to
          tools that simplify their workflow and ultimately drives success.
        </Section>
        <Section title="Our Values">
          Transparency, simplicity and user-centricity are at the core of
          everything we do. We're committed to providing a product that's not
          only easy to use, but also a joy to use.
        </Section>
      </div>
      </div>
    </div>
  );
}

export default AboutUs;
