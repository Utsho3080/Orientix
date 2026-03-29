import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap, Phone, Target, ArrowRight, ChevronDown, X } from 'lucide-react';
import './Services.css';

const SERVICES = [
  {
    id: 'web-dev-design',
    name: 'Web Design & Development',
    img: '/icon/Website UI-UX design & development.png',
    color: '#6366f1',
    iconBg: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
    desc: 'High-performance websites for business growth',
    steps: [
      {
        id: 1,
        title: 'UI/UX Planning',
        desc: 'Designing user-friendly layouts aligned with your brand and audience behavior.',
        color: '#6366f1'
      },
      {
        id: 2,
        title: 'Development & Integration',
        desc: 'Building responsive websites with CMS, contact forms, and modern technologies.',
        color: '#6366f1'
      },
      {
        id: 3,
        title: 'SEO & Optimization',
        desc: 'Optimizing speed, SEO structure, and deploying secure, scalable websites.',
        color: '#6366f1'
      }
    ]
  },
  {
    id: 'app-design-dev',
    name: 'App Design & Development',
    img: '/icon/App Design& development.png',
    color: '#a855f7',
    iconBg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    desc: 'Scalable mobile apps for seamless performance',
    steps: [
      {
        id: 1,
        title: 'App Strategy & UX',
        desc: 'Planning app structure, user journey, and selecting the right technology stack.',
        color: '#a855f7'
      },
      {
        id: 2,
        title: 'UI Design & Development',
        desc: 'Creating intuitive designs and developing cross-platform apps (iOS & Android).',
        color: '#a855f7'
      },
      {
        id: 3,
        title: 'Testing & Launch',
        desc: 'Ensuring performance, security, and smooth deployment with ongoing scalability.',
        color: '#a855f7'
      }
    ]
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    img: '/icon/Digital Marketing.png',
    color: '#f97316',
    iconBg: 'linear-gradient(135deg, #fff7ed 0%, #ffefe0 100%)',
    desc: 'Strategic digital marketing to grow your brand, audience, and revenue.',
    steps: [
      {
        id: 1,
        title: 'Social Media Management',
        desc: 'Managing and growing your presence across Facebook, Instagram, LinkedIn & X.',
        color: '#f97316'
      },
      {
        id: 2,
        title: 'Performance Marketing',
        desc: 'Running targeted ad campaigns focused on lead generation and ROI.',
        color: '#f97316'
      },
      {
        id: 3,
        title: 'SEO & Google Ads',
        desc: 'Improving search rankings, visibility, and online reputation.',
        color: '#f97316'
      }
    ]
  },
  {
    id: 'digital-design',
    name: 'Digital Media Design',
    img: '/icon/Digital Media design.png',
    color: '#10b981',
    iconBg: 'linear-gradient(135deg, #f0fff7 0%, #e0fef0 100%)',
    desc: 'Creative visuals that boost brand engagement',
    steps: [
      {
        id: 1,
        title: 'Social Media Creatives',
        desc: 'Designing engaging posts and visuals tailored for digital platforms.',
        color: '#10b981'
      },
      {
        id: 2,
        title: 'Ad & Banner Design',
        desc: 'High-converting creatives for ads, campaigns, and promotions.',
        color: '#10b981'
      },
      {
        id: 3,
        title: 'Motion Graphics',
        desc: 'Animated visuals that enhance engagement and brand storytelling.',
        color: '#10b981'
      }
    ]
  },
  {
    id: 'print-design',
    name: 'Print Media Design',
    img: '/icon/Print Media design.png',
    color: '#6366f1',
    iconBg: 'linear-gradient(135deg, #f3f5ff 0%, #eef1ff 100%)',
    desc: 'Professional print materials that elevate your brand offline.',
    steps: [
      {
        id: 1,
        title: 'Marketing Collateral',
        desc: 'Designing brochures, flyers, and corporate profiles.',
        color: '#6366f1'
      },
      {
        id: 2,
        title: 'Packaging & Ads',
        desc: 'Creative packaging and print advertisements that stand out.',
        color: '#6366f1'
      },
      {
        id: 3,
        title: 'Outdoor Branding',
        desc: 'Designing hoardings, flex, and signage for maximum visibility.',
        color: '#6366f1'
      }
    ]
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    img: '/icon/Graphic design.png',
    color: '#f43f5e',
    iconBg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
    desc: 'Creative graphic solutions that communicate your brand effectively.',
    steps: [
      {
        id: 1,
        title: 'Logo & Identity Design',
        desc: 'Creating unique logos and complete brand identity systems.',
        color: '#f43f5e'
      },
      {
        id: 2,
        title: 'Marketing Designs',
        desc: 'Designing posters, banners, and promotional creatives.',
        color: '#f43f5e'
      },
      {
        id: 3,
        title: 'Business & Packaging Design',
        desc: 'Business cards, brochures, catalogues, and packaging solutions.',
        color: '#f43f5e'
      }
    ]
  }
];

const Services = () => {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const tickerWrapperRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftAnchor = useRef(0);

  const handleSelect = (svc) => {
    if (selected?.id === svc.id) {
      setSelected(null);
    } else {
      setSelected(svc);
      setExpanded(0);
    }
  };

  const onMouseDown = (e) => {
    if (selected) return;
    isDown.current = true;
    setIsPaused(true);
    startX.current = e.pageX - tickerWrapperRef.current.offsetLeft;
    scrollLeftAnchor.current = tickerWrapperRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
    if (!selected) setIsPaused(false);
  };

  const onMouseUp = () => {
    isDown.current = false;
    if (!selected) setIsPaused(false);
  };

  const onMouseMove = (e) => {
    if (!isDown.current || selected) return;
    e.preventDefault();
    const x = e.pageX - tickerWrapperRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    tickerWrapperRef.current.scrollLeft = scrollLeftAnchor.current - walk;
  };

  // Robust Infinite Scroll Loop Logic for Manual Scrolling
  useEffect(() => {
    const handleScroll = () => {
      const el = tickerWrapperRef.current;
      if (!el || selected) return;

      const { scrollLeft, scrollWidth } = el;
      const singleSetWidth = scrollWidth / 10; // 10 sets now

      // If user drags too far left (towards 0), jump to a middle set
      if (scrollLeft < singleSetWidth * 2) {
        el.scrollLeft += singleSetWidth * 4;
      }
      // If user drags too far right (towards end), jump back to a middle set
      else if (scrollLeft > singleSetWidth * 6) {
        el.scrollLeft -= singleSetWidth * 4;
      }
    };

    const el = tickerWrapperRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      // Initialize in the exact center of the 10 sets
      const singleSetWidth = el.scrollWidth / 10;
      el.scrollLeft = singleSetWidth * 4.5;
    }
    return () => el?.removeEventListener('scroll', handleScroll);
  }, [selected]);

  return (
    <section className="services" id="services">
      {/* ── Header ── */}
      <div className="services-header">
        <div>
          <h2 className="services-title">
            Smart <em>Service</em><br />
            <em>That</em> Real Impact.
          </h2>
        </div>
      </div>

      {/* ── Infinite Scrolling Ticker (Draggable) ── */}
      {!selected && (
        <div
          className={`ticker-wrapper ${isPaused ? 'dragging' : ''}`}
          ref={tickerWrapperRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          <div className={`ticker-track ${isPaused ? 'paused' : ''}`}>
            {/* Duplicating 10 times for a huge infinite buffer zone */}
            {[...Array(10)].map((_, idx) => (
              <React.Fragment key={idx}>
                {SERVICES.map((svc, i) => (
                  <button
                    key={`${svc.id}-${idx}-${i}`}
                    className="svc-card ticker-card"
                    onClick={() => handleSelect(svc)}
                  >
                    <div className="svc-icon-wrap" style={{ background: svc.iconBg }}>
                      <img src={svc.img} alt={svc.name} className="svc-img-3d" />
                    </div>
                    <h3 className="svc-name">{svc.name}</h3>
                    <p className="svc-desc">{svc.desc}</p>
                  </button>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ── Expanded detail view ── */}
      {selected && (
        <div className="svc-expanded reveal active">
          {/* Top: mini service list */}
          <div className="svc-mini-bar">
            {SERVICES.map((svc) => (
              <button
                key={svc.id}
                className={`mini-chip ${selected.id === svc.id ? 'active' : ''}`}
                onClick={() => { setSelected(svc); setExpanded(0); }}
                style={selected.id === svc.id ? { borderColor: svc.color, color: svc.color } : {}}
              >
                <img src={svc.img} alt={svc.name} className="mini-img" />
                {svc.name}
              </button>
            ))}
          </div>

          <div className="svc-detail-panel">
            <div className="detail-icon-card" style={{ background: selected.iconBg }}>
              <div className="detail-img-glow" style={{ '--glow-color': selected.color }}>
                <img src={selected.img} alt={selected.name} className="detail-img-3d" />
              </div>
              <div className="detail-rating">
                <span className="rating-dot" style={{ background: selected.color }} />
                <span>4.9 <em>Rated agency</em></span>
              </div>
            </div>

            <div className="detail-steps">
              <button className="svc-close" onClick={() => setSelected(null)} aria-label="Close">
                <X size={20} />
              </button>

              <h3 className="detail-steps-title">
                {selected.name} in <em>quick 3</em><br />
                <em>Simple</em> Steps
              </h3>

              <div className="steps-list">
                {selected.steps.map((step, i) => (
                  <div
                    key={i}
                    className={`step-item ${expanded === i ? 'open' : ''}`}
                    onClick={() => setExpanded(expanded === i ? -1 : i)}
                  >
                    <div className="step-header">
                      <div className="step-count" style={{ background: selected.color + '15', color: selected.color }}>
                        0{i + 1}
                      </div>
                      <span className="step-title">{step.title}</span>
                      <ChevronDown size={18} className="step-chevron" />
                    </div>
                    {expanded === i && (
                      <p className="step-desc">{step.desc}</p>
                    )}
                  </div>
                ))}
              </div>

              <a href="#contact" className="btn-primary detail-cta-btn">
                Send Inquiry <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;


