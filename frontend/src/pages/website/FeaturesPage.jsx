import React from "react";
import { Fragment } from "react";
import NavBar from "../../components/website/NavBar";
import Footer from "../../components/website/Footer";
import HeroFeaturesPage from "../../components/website/featuresPage/HeroFeaturesPage";

const FeaturesPage = () => {
  return (
    <Fragment>
      <NavBar />
      <HeroFeaturesPage/>
      <Footer />
    </Fragment>
  );
};

export default FeaturesPage;