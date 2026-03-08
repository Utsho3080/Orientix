import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: 'E-commerce Redesign',
      category: 'Development & Marketing',
      image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800&h=500',
      description: 'A complete platform overhaul resulting in a 40% increase in conversions and dramatically improved UX.'
    },
    {
      title: 'SaaS Analytics Dashboard',
      category: 'Web Development',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500',
      description: 'High-performance data dashboard built for scale with real-time analytics, custom charts, and clean React architecture.'
    },
    {
      title: 'Global Growth Campaign',
      category: 'Digital Marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=500',
      description: 'Omnichannel campaign hitting 2M+ users, boosting brand awareness 65% and tripling qualified inbound leads.'
    }
  ];

  return (
    <section className="projects" id="projects">
      <div className="section-heading text-center">
        <span className="section-badge">Our Work</span>
        <h2 className="title">Featured <span className="text-accent">Projects</span></h2>
        <p className="subtitle">A curated selection of results-driven work.</p>
        <div className="glow-divider"></div>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card reveal">
            <div className="project-image-container">
              <img src={project.image} alt={project.title} className="project-image" />
              <div className="project-overlay">
                <a href="#" className="project-link"><ExternalLink size={22} /></a>
                <a href="#" className="project-link"><Github size={22} /></a>
              </div>
            </div>
            <div className="project-info">
              <span className="project-category">{project.category}</span>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
