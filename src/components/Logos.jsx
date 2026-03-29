import React from 'react';
import './Logos.css';

// Using SimpleIcons CDN URLs & other reliable sources for tech logos
const TOOLS = [
  { name: 'Figma', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'Illustrator', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-original.svg' },
  { name: 'Photoshop', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg' },
  { name: 'XD', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg' },
  { name: 'Canva', img: ' https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
  { name: 'WordPress', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg' },
  { name: 'React', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'MongoDB', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Express', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'Python', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'PHP', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
];

const Logos = () => {
  // Duplicate for seamless infinite scroll (same pattern as Services ticker)
  const DUPLICATED = [...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS,
  ...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS];

  return (
    <section className="logos-section" id="logos">
      <div className="logos-header">
        <p className="logos-label">Tools & Technologies We Work With</p>
      </div>
      <div className="logos-ticker-wrapper">
        <div className="logos-ticker-track">
          {DUPLICATED.map((tool, i) => (
            <div className="logo-chip" key={i} title={tool.name}>
              <img
                src={tool.img}
                alt={tool.name}
                className="logo-img"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="logo-name">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Logos;
