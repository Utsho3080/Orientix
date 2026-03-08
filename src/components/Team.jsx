import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import './Team.css';

const Team = () => {
  const teamMembers = [
    {
      role: 'Lead Developer',
      name: 'Alex Rivera',
      image: 'https://images.unsplash.com/photo-1614180733173-d609e49be2f6?auto=format&fit=crop&q=80&w=600&h=700',
      description: 'Full-stack architect with 9 years building high-performance React ecosystems and complex cloud-native applications at scale.',
      skills: ['React / Next.js', 'Node.js', 'AWS'],
      socials: { github: '#', linkedin: '#', twitter: '#' }
    },
    {
      role: 'Marketing Director',
      name: 'Jordan Lee',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=700',
      description: 'Award-winning growth strategist specializing in measurable omnichannel campaigns, SEO mastery, and building brands people love.',
      skills: ['SEO & SEM', 'Brand Strategy', 'Analytics'],
      socials: { github: '#', linkedin: '#', twitter: '#' }
    }
  ];

  return (
    <section className="team" id="team">
      <div className="section-heading text-center">
        <span className="section-badge">The Team</span>
        <h2 className="title">Meet the <span className="text-accent">Experts</span></h2>
        <p className="subtitle">Driven by passion. Defined by results. Obsessed with excellence.</p>
        <div className="glow-divider"></div>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card reveal">
            <div className="card-image-wrapper">
              <img src={member.image} alt={member.name} className="team-image" />
              <div className="image-overlay"></div>
            </div>
            
            <div className="card-content">
              <span className="role-badge">{member.role}</span>
              <h3 className="member-name">{member.name}</h3>
              <p className="member-desc">{member.description}</p>
              
              <div className="member-skills">
                {member.skills.map((skill, i) => (
                  <span key={i} className="skill-chip">{skill}</span>
                ))}
              </div>
              
              <div className="social-links">
                {member.socials.github && <a href={member.socials.github} className="social-icon" aria-label="GitHub"><Github size={18} /></a>}
                {member.socials.linkedin && <a href={member.socials.linkedin} className="social-icon" aria-label="LinkedIn"><Linkedin size={18} /></a>}
                {member.socials.twitter && <a href={member.socials.twitter} className="social-icon" aria-label="Twitter"><Twitter size={18} /></a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
