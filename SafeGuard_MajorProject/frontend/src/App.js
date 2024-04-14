import "./App.css";
import React from "react";
import Home from "./Components/Landingpage/Home.js";
import About from "./Components/Landingpage/About.js";
import Work from "./Components/Landingpage/Work.js";
import Testimonial from "./Components/Landingpage/Testimonial.js";
import Contact from "./Components/Landingpage/Contact.js";
import Navbar from "./Components/Landingpage/Navbar.js";
import InputPage from "./Components/Demopage/InputPage.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/testimonials" element={<Testimonial />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inputpage" element={<InputPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
