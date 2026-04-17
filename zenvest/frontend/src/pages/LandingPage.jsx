import React, { useState, useEffect } from 'react';
import Logo from '../components/layout/Logo';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import Plans from '../sections/Plans';
import HowItWorks from '../sections/HowItWorks';
import Footer from '../sections/Footer';
import ScrollFloat from '../components/animations/ScrollFloat';


export default function LandingPage({ navigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="bg-[#FDFDFF]">
      {/* Navbar */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="main-navbar">
        <Logo onClick={() => navigate("home")} />
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#plans">Plans</a>
          <a href="#how-it-works">How it works</a>
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={() => navigate("auth")}>Sign in</button>
          <button className="btn btn-primary" onClick={() => navigate("register")}>Get Protected →</button>
        </div>
      </nav>

      <Hero navigate={navigate} />
      
      <ScrollFloat>
        <Features />
      </ScrollFloat>
      
      <ScrollFloat>
        <Plans navigate={navigate} />
      </ScrollFloat>
      
      <ScrollFloat>
        <HowItWorks />
      </ScrollFloat>

      <Footer navigate={navigate} />

    </div>
  );
}
