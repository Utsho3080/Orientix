import React from 'react';
import { Code2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <a href="#home" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 900 }}>
            <Code2 style={{ color: 'var(--accent-blue)', width: 26, height: 26 }} />
            <span>Elevate<span className="text-accent">X</span></span>
          </a>
          <p>Empowering ambitious businesses through cutting-edge technology, data-driven marketing, and ironclad reliability.</p>
        </div>
        
        <div className="footer-links">
          <h4>Company</h4>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#team">Team</a>
          <a href="#contact">Contact</a>
        </div>
        
        <div className="footer-legal">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ElevateX Agency. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
          <a href="#">Dribbble</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
