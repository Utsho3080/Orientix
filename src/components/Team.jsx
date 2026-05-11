import React from 'react';
import { Linkedin } from 'lucide-react';
import './Team.css';

const Team = () => {
  const teamMembers = [
    // {
    //   role: 'Lead Developer',
    //   name: 'Utsho Saha',
    //   image: '/Utsho Saha.png',
    //   description: 'Full-stack architect building scalable, high-performance applications, specializing in MERN, Python, and AI-driven solutions.',
    //   socials: { linkedin: 'https://www.linkedin.com/in/utsho-saha-14485b219' }
    // },
    {
      role: 'Marketing Head',
      name: 'Sujit Saha',
      image: '/sujit.jpeg',
      description: 'UI Designer & Marketing Head with 6+ years of experience. Expert in WordPress, Wix, and e-commerce design. Focused on quality work and driving business growth.',
      socials: { linkedin: 'https://www.linkedin.com/in/sujit-saha-814299251/' }
    }
  ];

  return (
    <section className="team" id="team">
      <div className="team-header">
        <h2 className="team-title">
          Meet The <em>Experts</em>
        </h2>
        <p className="team-subtitle">Driven by passion. Defined by results. Obsessed with excellence.</p>
      </div>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card reveal">
            <div className="card-image-wrapper">
              <img src={member.image} alt={member.name} className="team-image" />

            </div>

            <div className="card-content">
              <div className="member-info">
                <span className="role-badge">{member.role}</span>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-desc">{member.description}</p>
              </div>

              <div className="social-links">
                {member.socials.linkedin && <a href={member.socials.linkedin} className="social-icon" aria-label="LinkedIn"><Linkedin size={18} /></a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
