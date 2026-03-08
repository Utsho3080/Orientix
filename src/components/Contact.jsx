import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="section-heading text-center">
        <h2 className="title">Let's <span className="text-accent">Connect</span></h2>
        <p className="subtitle">Ready to start your next big project?</p>
      </div>

      <div className="contact-container reveal">
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p>We'd love to hear from you. Fill out the form or reach out directly.</p>
          
          <div className="info-item">
            <Mail className="info-icon" />
            <span>hello@elevatex.agency</span>
          </div>
          <div className="info-item">
            <Phone className="info-icon" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="info-item">
            <MapPin className="info-icon" />
            <span>123 Tech Boulevard, SF, CA</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="john@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="4" placeholder="How can we help?" required></textarea>
          </div>
          <button type="submit" className="btn-primary w-full">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
