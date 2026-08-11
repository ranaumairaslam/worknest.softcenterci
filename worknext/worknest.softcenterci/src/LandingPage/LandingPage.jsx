import Navbar from "./Component/Navbar";
import HeroSection from "./Component/Home";

import Features from "./Component/Features";
import Solution from "./Component/Solution";
import About from "./Component/About";
import Contact from "./Component/Contact";



import Footer from "./Component/Footer";


export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Features />
      <Solution />
      <About />
      <Contact />
      <Footer />
      

    </>
  );
}