import React, { useState, useEffect } from 'react';
import { Menu, X, Code2 } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  /* Removed useTheme usage */

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Packages', href: '#packages' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#home" className="logo">
          <Code2 className="logo-icon" size={28} />
          <span>Orien<span className="text-accent">tix</span></span>
        </a>

        <div className="desktop-links">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">{link.name}</a>
          ))}
        </div>

        <div className="nav-right">
          <a href="#contact" className="btn-primary">Contact Us</a>

          <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="mobile-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

