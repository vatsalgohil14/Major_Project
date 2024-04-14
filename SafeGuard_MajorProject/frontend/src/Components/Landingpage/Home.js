import React from "react";
import BannerBackground from "../../Assets/home-banner.png";
import BannerImage from "../../Assets/home_BG.png";
import About from "./About.js";
import Work from "./Work.js";
import Testimonial from "./Testimonial.js";
import Contact from "./Contact.js";
import Footer from "./Footer.js";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* <Navbar /> */}
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Ensuring a Safe Digital Space for All
          </h1>
          <p className="primary-text">
            Advanced ML model for Hate Speech and NSFW Image Detection -
            Protecting Your Online Experience
          </p>

          <button
            className="secondary-button"
            onClick={() => navigate("/inputpage")}
          >
            Start Now <FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
      <About />
      <Work />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
