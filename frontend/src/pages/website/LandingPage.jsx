import React from "react";
import { Fragment } from "react";
import NavBar from "../../components/website/NavBar";
import HeroSection from "../../components/website/landingPage/HeroSection";
import FeaturesSection from "../../components/website/landingPage/FeaturesSection";
import HowItWorks from "../../components/website/landingPage/HowItWorks";
import Footer from "../../components/website/Footer";
import TryItSection from "../../components/website/landingPage/TryItSection";

const LandingPage = () => {
  return (
    <Fragment>
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <TryItSection />
      <Footer />
    </Fragment>
  );
};

export default LandingPage;
