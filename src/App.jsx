import React, { useEffect, useState, createContext, useContext } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import ScrollToTop from './components/ScrollToTop';
import Faq from './components/Faq';
import Team from './components/Team';
import Projects from './components/Projects';
import Packages from './components/Packages';
import Logos from './components/Logos';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ParticleCanvas from './components/ParticleCanvas';
import Testimonials from './components/Testimonials';

function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = { root: null, threshold: 0.08 };
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const observe = () => {
      const elements = document.querySelectorAll('.reveal');
      elements.forEach(el => observer.observe(el));
    };

    observe();
    const timer = setTimeout(observe, 500);

    return () => {
      clearTimeout(timer);
      document.querySelectorAll('.reveal').forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="app-container">
      <ParticleCanvas />
      <Navbar />
      <ScrollToTop />
      <main>
        <Hero />
        <Services />

        <Projects />
        <Packages />

        <Team />
        <Testimonials />
        <Contact />
        <Logos />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

export default App;
