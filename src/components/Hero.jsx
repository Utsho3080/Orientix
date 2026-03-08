import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import './Hero.css';

const WORDS = ['Web Development', 'Bold Marketing', 'Seamless Maintenance'];

const Hero = () => {
  const wordRef = useRef(null);
  const indexRef = useRef(0);
  const charIndexRef = useRef(0);
  const deletingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const type = () => {
      const word = WORDS[indexRef.current];
      const el = wordRef.current;
      if (!el) return;

      if (!deletingRef.current) {
        charIndexRef.current++;
        el.textContent = word.slice(0, charIndexRef.current);
        if (charIndexRef.current === word.length) {
          deletingRef.current = true;
          timerRef.current = setTimeout(type, 2000);
          return;
        }
      } else {
        charIndexRef.current--;
        el.textContent = word.slice(0, charIndexRef.current);
        if (charIndexRef.current === 0) {
          deletingRef.current = false;
          indexRef.current = (indexRef.current + 1) % WORDS.length;
        }
      }
      timerRef.current = setTimeout(type, deletingRef.current ? 55 : 90);
    };

    timerRef.current = setTimeout(type, 600);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge" style={{ animation: 'fadeUp 0.7s ease 0.1s both' }}>
          <Sparkles size={14} />
          Premium Digital Agency
        </div>

        <h1 className="hero-title" style={{ animation: 'fadeUp 0.7s ease 0.25s both' }}>
          We Power Your<br />
          <span className="typewriter-wrap">
            <span className="typewriter-text text-gradient" ref={wordRef}></span>
            <span className="typewriter-cursor"></span>
          </span>
        </h1>

        <p className="hero-subtitle" style={{ animation: 'fadeUp 0.7s ease 0.45s both' }}>
          High-performance websites, revenue-driving marketing & rock-solid maintenance — all under one roof to scale your brand fearlessly.
        </p>

        {/* <div className="hero-stats" style={{ animation: 'fadeUp 0.7s ease 0.55s both' }}>
          <div className="stat-item"><span className="stat-num">150+</span><span className="stat-label">Projects</span></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><span className="stat-num">98%</span><span className="stat-label">Satisfaction</span></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><span className="stat-num">7+</span><span className="stat-label">Years</span></div>
        </div> */}

        <div className="hero-actions" style={{ animation: 'fadeUp 0.7s ease 0.65s both' }}>
          <a href="#services" className="btn-primary hero-btn">
            Explore Services <ArrowRight size={18} />
          </a>
          <a href="#projects" className="btn-secondary hero-btn">
            View Our Work
          </a>
        </div>
      </div>

      <a href="#services" className="scroll-indicator" aria-label="Scroll down">
        <ChevronDown size={28} />
      </a>
    </section>
  );
};

export default Hero;
