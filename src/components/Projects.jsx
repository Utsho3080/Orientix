import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './Projects.css';

const PROJECTS = [
  {
    title: 'sproutwelldecor',
    category: 'Web Development',
    coverImage: '/project/sproutwelldecor.jpeg',
    images: ['/project/sproutwelldecor2.png'],
    description: 'A complete e-commerce platform overhaul resulting in a 40% increase in conversions and dramatically improved UX.',
    liveUrl: 'https://sproutwelldecor.com.au/',
  },
  {
    title: 'Fashion app UI Design',
    category: 'App Design',
    coverImage: '/project/fashion app design.jpeg',
    images: [
      '/project/fashion app design 2.jpeg',
      '/project/fashion app design 5.png',
    ],
    description: 'High-performance data dashboard with real-time analytics, custom charts, and a clean scalable React architecture.',
    liveUrl: '#',
  },
  {
    title: 'Educational Consultant website',
    category: 'Web Development',
    coverImage: '/project/educational website.jpeg',
    images: ['/project/educational website 2.jpeg'],
    description: 'Omnichannel campaign hitting 2M+ users, boosting brand awareness 65% and tripling qualified inbound leads.',
    liveUrl: '#',
  },
  {
    title: 'Beer App UI Design',
    category: 'App Design',
    coverImage: '/project/beer_website.jpeg',
    images: [
      'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=1200&h=700',
      'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=1200&h=700',
    ],
    description: 'A modern mobile app UI for a premium beer delivery service — intuitive browse, cart, and checkout experience.',
    liveUrl: '#',
  },
  {
    title: 'Seemy',
    category: 'website design',
    coverImage: '/project/seemy.jpeg',
    images: ['/project/seemy 2.jpeg'],
    description: 'Full brand identity design including logo, color palette, typography system, and comprehensive brand guidelines.',
    liveUrl: '#',
  },
  {
    title: 'Absolute Publisher',
    category: 'Website Development',
    coverImage: '/project/book publisher.jpeg',
    images: ['/project/book publisher 2.jpeg'],
    description: 'Full brand identity design including logo, color palette, typography system, and comprehensive brand guidelines.',
    liveUrl: '#',
  },
  {
    title: 'Doctor Mitchell',
    category: 'Website Development',
    coverImage: '/project/doctor website.jpg',
    images: ['/project/doctor website 2.jpeg'],
    description: 'a complete website for a doctor with all the features of a modern website with appoinment booking system and many more features',
    liveUrl: '#',
  },
];

// ── Popup Modal ──
const ProjectModal = ({ project, onClose }) => {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  const prev = () => setImgIdx(i => (i - 1 + project.images.length) % project.images.length);
  const next = () => setImgIdx(i => (i + 1) % project.images.length);

  return (
    <div className="proj-modal-backdrop" onClick={onClose}>
      <div className="proj-modal" onClick={e => e.stopPropagation()}>
        <button className="proj-modal-close" onClick={onClose}><X size={20} /></button>

        {/* Image Slider */}
        <div className="proj-modal-gallery">
          <img src={project.images[imgIdx]} alt={project.title} className="proj-modal-img" />
          {project.images.length > 1 && (
            <>
              <button className="proj-modal-nav left" onClick={prev}><ChevronLeft size={24} /></button>
              <button className="proj-modal-nav right" onClick={next}><ChevronRight size={24} /></button>
              <div className="proj-modal-dots">
                {project.images.map((_, i) => (
                  <button key={i} className={`proj-dot ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="proj-modal-info">
          <div>
            <span className="proj-modal-cat">{project.category}</span>
            <h3 className="proj-modal-title">{project.title}</h3>
            <p className="proj-modal-desc">{project.description}</p>
          </div>
          {project.liveUrl && project.liveUrl !== '#' && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="proj-live-btn">
              <ExternalLink size={18} /> View Live Project
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Component ──
const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const tickerWrapperRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftAnchor = useRef(0);

  const handleSelect = (proj) => {
    setSelectedProject(proj);
  };

  const onMouseDown = (e) => {
    if (selectedProject) return;
    isDown.current = true;
    startX.current = e.pageX - tickerWrapperRef.current.offsetLeft;
    scrollLeftAnchor.current = tickerWrapperRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
    setIsPaused(false);
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e) => {
    if (!isDown.current || selectedProject) return;
    e.preventDefault();
    const x = e.pageX - tickerWrapperRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Drag speed modifier
    tickerWrapperRef.current.scrollLeft = scrollLeftAnchor.current - walk;
  };

  // Pure JS Auto-Scroll Loop
  useEffect(() => {
    const el = tickerWrapperRef.current;
    let animationId;

    const playTicker = () => {
      // Stops the ticker if paused by hover, being dragged, or if modal is open
      if (!isPaused && !isDown.current && !selectedProject && el) {
        el.scrollLeft += 1; // Adjust this number for scrolling speed

        const singleSetWidth = el.scrollWidth / 10;

        // Infinite Loop Reset Logic
        if (el.scrollLeft >= singleSetWidth * 6) {
          el.scrollLeft = singleSetWidth * 2;
        } else if (el.scrollLeft <= singleSetWidth) {
          el.scrollLeft = singleSetWidth * 5;
        }
      }
      animationId = requestAnimationFrame(playTicker);
    };

    animationId = requestAnimationFrame(playTicker);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, selectedProject]);

  // Initial scroll setup so we start in the middle of our clones
  useEffect(() => {
    if (tickerWrapperRef.current) {
      const el = tickerWrapperRef.current;
      el.scrollLeft = (el.scrollWidth / 10) * 4;
    }
  }, []);

  const scrollBy = (dir) => {
    const el = tickerWrapperRef.current;
    if (el) {
      const scrollAmount = window.innerWidth / 3;
      el.scrollTo({
        left: el.scrollLeft + (dir === 'next' ? scrollAmount : -scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        <div className="projects-header">
          <div>
            <h2 className="projects-title">
              We Have <em>Build</em>
            </h2>
            <p className="projects-subtitle">
              We go beyond traditional marketing. We deliver value with cutting-edge, data-driven strategies.
            </p>
          </div>
        </div>

        {/* <button className="proj-edge-btn left" onClick={() => scrollBy('prev')}>
          <ChevronLeft size={32} />
        </button>
        <button className="proj-edge-btn right" onClick={() => scrollBy('next')}>
          <ChevronRight size={32} />
        </button> */}

        <div
          className="proj-ticker-wrapper"
          ref={tickerWrapperRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          <div className="proj-ticker-track">
            {[...Array(10)].map((_, idx) => (
              <React.Fragment key={idx}>
                {PROJECTS.map((proj, i) => (
                  <button
                    key={`${i}-${idx}`}
                    className="proj-card"
                    onClick={() => handleSelect(proj)}
                  >
                    <div className="proj-card-img-wrap">
                      <img src={proj.coverImage} alt={proj.title} className="proj-card-img" />
                      <div className="proj-card-overlay">
                        <span className="proj-card-open">View Project</span>
                      </div>
                    </div>
                    <div className="proj-card-body">
                      <span className="proj-card-cat">{proj.category}</span>
                      <h3 className="proj-card-title">{proj.title}</h3>
                    </div>
                  </button>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

export default Projects;