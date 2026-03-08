import React from 'react';
import { MonitorSmartphone, TrendingUp, Settings } from 'lucide-react';
import './Services.css';

const Services = () => {
  const servicesData = [
    {
      icon: <MonitorSmartphone size={36} className="service-icon" />,
      title: 'Web Development',
      description: 'Modern, blazing-fast web applications tailored to your brand. We engineer with React, Next.js, and custom architectures for unmatched digital presence.'
    },
    {
      icon: <TrendingUp size={36} className="service-icon" />,
      title: 'Digital Marketing',
      description: 'Data-driven campaigns that convert. From SEO to performance marketing, we put your business in front of the right audience and drive measurable revenue.'
    },
    {
      icon: <Settings size={36} className="service-icon" />,
      title: 'Maintenance',
      description: 'Reliable uptime, security hardening, and performance optimization. We protect and enhance your systems so you can focus entirely on growth.'
    }
  ];

  return (
    <section className="services" id="services">
      <div className="section-heading text-center">
        <span className="section-badge">What We Do</span>
        <h2 className="title">Our <span className="text-accent">Services</span></h2>
        <p className="subtitle">End-to-end solutions for brands that refuse to settle.</p>
        <div className="glow-divider"></div>
      </div>

      <div className="services-grid">
        {servicesData.map((service, index) => (
          <div key={index} className="service-card reveal">
            <div className="icon-wrapper">
              {service.icon}
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-desc">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
