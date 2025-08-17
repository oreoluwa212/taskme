// src/components/website/landingPage/HowItWorks.jsx
import React from "react";
import H1Text from "../headerText/H1Text";
import HeaderBg from "../headerText/HeaderBg";
import HowItWorksCard from "../cards/HowItWorksCard";
import { greendot, hero1 } from "../../../../public";
import { ArrowRight } from "lucide-react";

function HowItWorks() {
  const steps = [
    {
      step: "Step 1",
      title: "Input Your Project",
      description:
        "Enter the details of your project, including the timeline and the key milestones.",
    },
    {
      step: "Step 2",
      title: "Get Daily Tasks",
      description:
        "TaskMe will break down your project into manageable daily tasks, ensuring progress.",
    },
    {
      step: "Step 3",
      title: "Track Your Progress",
      description:
        "Monitor your progress, adjust tasks as needed and stay on top of your deadlines.",
    },
  ];

  return (
    <div className="relative bg-white w-full min-h-screen font-lato flex flex-col py-16 lg:py-20 items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-left opacity-5"
        style={{ backgroundImage: `url(${hero1})` }}
      ></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-32 right-16 w-48 h-48 bg-green-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Decorative Dot */}
      <img
        src={greendot}
        alt="Green Dot"
        className="absolute top-10 right-10 w-5 h-5 animate-bounce"
      />

      {/* Header Section */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 mb-12">
        <div className="mb-8 animate-fade-in-up">
          <HeaderBg headerText={"How it works"} />
        </div>

        <div
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          <H1Text
            h2Text={"Inside TaskMe's Engine"}
            pText={"Explore our very seamless process."}
          />
        </div>
      </div>

      {/* Steps Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-center items-stretch gap-8 xl:gap-12">
          {steps.map((step, index) => (
            <React.Fragment key={step.step}>
              <div
                className="animate-fade-in-up opacity-0 group h-full"
                style={{
                  animationDelay: `${0.4 + index * 0.3}s`,
                  animationFillMode: "forwards",
                }}
              >
                <HowItWorksCard
                  step={step.step}
                  h3={step.title}
                  p={step.description}
                />
              </div>

              {index < steps.length - 1 && (
                <div
                  className="animate-fade-in-up opacity-0 flex items-center justify-center"
                  style={{
                    animationDelay: `${0.6 + index * 0.3}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="bg-primary rounded-full p-3 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group">
                    <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden flex-col items-center space-y-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.step}>
              <div
                className="w-full max-w-md animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${0.4 + index * 0.2}s`,
                  animationFillMode: "forwards",
                }}
              >
                <HowItWorksCard
                  step={step.step}
                  h3={step.title}
                  p={step.description}
                />
              </div>

              {index < steps.length - 1 && (
                <div
                  className="animate-fade-in-up opacity-0 flex items-center justify-center"
                  style={{
                    animationDelay: `${0.5 + index * 0.2}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="bg-primary rounded-full p-3 text-white shadow-lg transform rotate-90 hover:scale-110 transition-all duration-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
