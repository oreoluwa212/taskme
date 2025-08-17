// src/components/website/landingPage/HeroSection.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  hero1,
  hero2,
  hero3,
  heroCircle1,
  heroCircle2,
} from "../../../../public";
import Button from "../../ui/Button";

const HeroSection = () => {
  return (
    <section className="w-full min-h-screen flex flex-col pb-12 lg:pb-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-32 right-16 w-48 h-48 bg-blue-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Main Hero Content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch min-h-screen lg:min-h-[80vh] relative z-10">
        {/* Left Image - Desktop Only */}
        <div className="hidden lg:block lg:w-1/3 xl:w-1/4 relative group">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={hero1}
            alt="Hero illustration 1"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="relative">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up">
                Simplify your Workflow with AI
                <span className="text-primary block mt-2 relative">
                  Productivity Partner.
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary/0 via-primary/80 to-primary/0 rounded-full animate-pulse"></div>
                </span>
              </h1>
            </div>

            <p
              className="text-lg sm:text-xl text-gray-600 font-medium max-w-xl mx-auto animate-fade-in-up opacity-0"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              Break down project timelines into daily tasks with our AI project
              management solution.
            </p>

            <div
              className="pt-8 animate-fade-in-up opacity-0"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <Link
                to="/signup"
                className="inline-block w-full sm:w-auto group"
              >
                <Button
                  variant="primary"
                  size="xl"
                  className="w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group-hover:bg-primary-dark"
                >
                  <span className="flex items-center justify-center gap-2">
                    Get started now
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Image - Desktop Only */}
        <div className="hidden lg:block lg:w-1/3 xl:w-1/4 relative group">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={hero2}
            alt="Hero illustration 2"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>

      {/* Bottom Hero Image Section */}
      <div
        className="relative w-full flex justify-center items-center pt-8 lg:pt-16 animate-fade-in-up opacity-0"
        style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
      >
        {/* Decorative Circle 1 */}
        <img
          className="absolute bottom-4 left-4 sm:left-8 lg:left-[23%] w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 opacity-80 animate-float"
          src={heroCircle1}
          alt="Decorative circle"
        />

        {/* Main Hero Image */}
        <div className="relative z-10 w-full max-w-4xl px-4 group">
          <img
            className="w-full h-auto max-h-[40vh] sm:max-h-[50vh] lg:max-h-[60vh] object-contain mx-auto transition-transform duration-700 group-hover:scale-105 hover:drop-shadow-2xl"
            src={hero3}
            alt="TaskMe dashboard preview"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
        </div>

        {/* Decorative Circle 2 */}
        <img
          className="absolute top-4 right-4 sm:right-8 lg:right-[23%] w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 opacity-80 animate-float"
          src={heroCircle2}
          alt="Decorative circle"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
