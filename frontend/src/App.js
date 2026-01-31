import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

/* USER SITE */
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Overview from "./components/Overview";
import WhatToExpect from "./components/WhatToExpect";
import TrainingEnvironment from "./components/TrainingEnvironment";
import Programs from "./components/Programs";
import TrainingVideos from "./components/TrainingVideos";
import Membership from "./components/Membership";
import Trainers from "./components/Trainers";
import Contact from "./components/Contact";
import Review from "./components/Review";

/* PAGES */
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";

/* 🔧 GLOBAL HASH SCROLL HANDLER */
function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return null;
}

/* USER SITE LAYOUT */
function UserSite() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <Hero />
      <Overview />
      <WhatToExpect />
      <TrainingEnvironment />
      <Programs />
      <TrainingVideos />
      <Membership />
      <Trainers />
      <Contact />
      <Review />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollHandler />

      <Routes>
        <Route path="/" element={<UserSite />} />

        <Route
          path="/gallery"
          element={
            <div className="bg-black text-white min-h-screen">
              <Navbar />
              <Gallery />
            </div>
          }
        />

        <Route
          path="/testimonials"
          element={
            <div className="bg-black text-white min-h-screen">
              <Navbar />
              <Testimonials />
            </div>
          }
        />
      </Routes>
    </>
  );
}
