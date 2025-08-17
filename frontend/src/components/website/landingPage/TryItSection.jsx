// src/components/website/landingPage/TryItSection.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import H1Text from "../headerText/H1Text";
import { bluedot, greendot, hero2 } from "../../../../public";

const TryItSection = () => {
  return (
    <section className="relative bg-white w-full min-h-screen font-lato flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 lg:py-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-right opacity-5"
        style={{ backgroundImage: `url(${hero2})` }}
      />

      {/* Decorative Dots */}
      <div className="absolute top-8 sm:top-10 left-8 sm:left-10 w-4 h-4 sm:w-5 sm:h-5">
        <img src={bluedot} alt="" className="w-full h-full" />
      </div>

      <img
        src={greendot}
        alt=""
        className="absolute bottom-8 sm:bottom-10 right-8 sm:right-10 w-4 h-4 sm:w-5 sm:h-5"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Free Trial Badge */}
        <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-100 text-blue-800 font-semibold rounded-full text-sm sm:text-base">
          Free Trial
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <H1Text
            h2Text="Try TaskMe For Free Today"
            pText="Boost your productivity level with TaskMe today and never look back."
          />
        </div>

        {/* CTA Button */}
        <div className="pt-6">
          <Link to="/signup" className="inline-block">
            <button className="group bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-sm sm:text-base">
              Start your journey for free
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TryItSection;
