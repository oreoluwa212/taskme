// src/components/website/landingPage/FeaturesSection.jsx
import React from "react";
import { Zap, BarChart3, Smile } from "lucide-react";
import FeaturesCard from "../cards/FeaturesCard";
import { icon1, icon2, icon3 } from "../../../../public";
import HeaderBg from "../headerText/HeaderBg";
import H1Text from "../headerText/H1Text";

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Task Breakdown",
      description:
        "Input your project and let TaskMe break it down into manageable daily tasks.",
      imageUrl: icon1,
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description:
        "Track your progress daily and stay on top of your deadlines.",
      imageUrl: icon2,
    },
    {
      icon: Smile,
      title: "User Friendly Interface",
      description:
        "Enjoy an intuitive and user friendly interface designed for efficiency.",
      imageUrl: icon3,
    },
  ];

  return (
    <section className="bg-blueBg w-full min-h-screen font-lato flex flex-col py-16 lg:py-20 items-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-16 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-24 right-20 w-56 h-56 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="text-center px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
        <div className="mb-8 animate-fade-in-up">
          <HeaderBg headerText="features" />
        </div>

        <div
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        >
          <H1Text
            h2Text="Unleash the Power of TaskMe"
            pText="Dive into the features that make TaskMe a game changer."
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex justify-center h-full animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${0.4 + index * 0.2}s`,
                animationFillMode: "forwards",
              }}
            >
              <div className="group h-full hover:scale-105 transition-transform duration-300 hover:drop-shadow-lg">
                <FeaturesCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  imageUrl={feature.imageUrl}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
