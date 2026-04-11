import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Clock2, Mail, MapIcon, MessageCircle, Phone, Send } from 'lucide-react';
import './Contact.css';

const EMAILJS_SERVICE_ID = 'service_av39uow';
const EMAILJS_TEMPLATE_ID = 'template_5hzu9nq';
const EMAILJS_PUBLIC_KEY = '7Juya_vy218l5zOG0';

const EMAIL = 'support.orientix@gmail.com';
const PHONE = '+91 81007 30178';
const background = '/contact_bg.png';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          from_phone: form.phone,
          message: form.message,
          to_email: EMAIL,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-header">
        <h2 className="contact-title">Let's <br />Get In <em>Touch</em></h2>
      </div>

      <div className="contact-card-wrapper reveal">
        <div className="contact-sidebar">
          <h3 className="sidebar-title">Quick Contact</h3>

          <div className="sidebar-info">
            <div className="sidebar-item">


            </div>

            <a href={`mailto:${EMAIL}`} className="sidebar-item link">
              <div className="sidebar-icon">
                <Mail size={22} />
              </div>
              <div className="sidebar-text">
                <p>{EMAIL}</p>
              </div>
            </a>

            <a
              href="https://wa.me/918100730178?text=Hi%2C%20I%20visited%20your%20website%20and%20would%20like%20to%20discuss%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-item link"
            >
              <div className="sidebar-icon">
                <img src="https://img.icons8.com/?size=100&id=16712&format=png&color=FFFFFFFF" alt="" />
              </div>
              <div className="sidebar-text">
                <p>Chat on WhatsApp</p>
              </div>
            </a>

            <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="sidebar-item link">
              <div className="sidebar-icon">
                <Phone size={22} />
              </div>
              <div className="sidebar-text">
                <p>{PHONE}</p>
              </div>
            </a>
            <a className="sidebar-item link">
              <div className="sidebar-icon">
                <MapIcon size={22} />
              </div>
              <div className="sidebar-text">
                <p>Operated from Kolkata</p>
              </div>
            </a>
            <a className="sidebar-item link">
              <div className="sidebar-icon">
                <Clock2 size={22} />
              </div>
              <div className="sidebar-text">
                <p>Monday to Saturday,<br />10:00 AM to 7:00 PM</p>
              </div>
            </a>


          </div>
        </div>

        <div className="contact-main">
          <div className="main-header">
            <h2 className="main-title">Contact Us Today</h2>
            <p className="main-subtitle">If You Have Questions Or Special Requests, Just Drop Us A Line.</p>
          </div>

          <form className="contact-form-new" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                id="name"
                placeholder="Full Name"
                className="custom-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className="custom-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                id="phone"
                placeholder="Phone Number"
                className="custom-input"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <textarea
                id="message"
                placeholder="Message"
                className="custom-textarea"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>

            </div>

            <button
              type="submit"
              className="submit-btn-new"
              disabled={status === 'sending'}
            >
              <Send size={20} />
              {status === 'sending' ? 'SENDING...' : 'SUBMIT'}
            </button>

            {status === 'success' && (
              <p className="form-status success">✅ Message sent successfully!</p>
            )}
            {status === 'error' && (
              <p className="form-status error">❌ Error sending message. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
