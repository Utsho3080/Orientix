import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap, Phone, Target, ArrowRight, ChevronDown, X } from 'lucide-react';
import './Services.css';

const SERVICES = [
  {
    id: 'web-dev',
    name: 'Web Development',
    img: '/icon/web_dev_3d_icon_1773515814250.png',
    color: '#3b82f6',
    iconBg: 'linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%)',
    desc: 'High-performance websites built for speed, scale, and conversion.',
    steps: [
      { id: 1, title: 'Strategic Architecture Planning', desc: 'We map out the technical blue-print for scalability and performance.', color: '#3b82f6' },
      { id: 2, title: 'Full-Stack Development', desc: 'Robust backends and pixel-perfect frontends using modern frameworks.', color: '#3b82f6' },
      { id: 3, title: 'Optimization & Deployment', desc: 'Rigorous testing and cloud-native deployment for maximum uptime.', color: '#3b82f6' }
    ]
  },
  {
    id: 'web-design',
    name: 'Web Design',
    img: '/icon/web_design_3d_icon_1773515832448.png',
    color: '#8b5cf6',
    iconBg: 'linear-gradient(135deg, #f5f2ff 0%, #ede7ff 100%)',
    desc: 'Stunning UI/UX that captivates visitors and drives engagement.',
    steps: [
      { id: 1, title: 'Visual Research & Analysis', desc: 'Deep-diving into your industry to find unique visual opportunities.', color: '#8b5cf6' },
      { id: 2, title: 'Wireframing & Prototyping', desc: 'Iterative design process to perfect user flows and interactions.', color: '#8b5cf6' },
      { id: 3, title: 'UI System Development', desc: 'Creating a cohesive and scalable design language for your brand.', color: '#8b5cf6' }
    ]
  },
  {
    id: 'app-design',
    name: 'App Design',
    img: '/icon/app_design_3d_icon_1773515851221.png',
    color: '#ec4899',
    iconBg: 'linear-gradient(135deg, #fff0f7 0%, #ffebf5 100%)',
    desc: 'Beautiful mobile experiences users love to interact with.',
    steps: [
      { id: 1, title: 'Mobile UX Strategy', desc: 'Optimizing interfaces for small screens and thumb-driven interaction.', color: '#ec4899' },
      { id: 2, title: 'Micro-Animation Design', desc: 'Adding delightful details that enhance usability and focus.', color: '#ec4899' },
      { id: 3, title: 'High-Fidelity Mockups', desc: 'Production-ready designs with detailed specifications for dev.', color: '#ec4899' }
    ]
  },
  {
    id: 'app-dev',
    name: 'App Development',
    img: '/icon/app_dev_3d_icon_1773515871042.png',
    color: '#06b6d4',
    iconBg: 'linear-gradient(135deg, #f0fdff 0%, #e0faff 100%)',
    desc: 'Cross-platform apps built with cutting-edge frameworks.',
    steps: [
      { id: 1, title: 'Native & Hybrid Strategy', desc: 'Choosing the right stack for your performance and budget needs.', color: '#06b6d4' },
      { id: 2, title: 'Real-time Integrations', desc: 'Seamlessly connecting with APIs and external data services.', color: '#06b6d4' },
      { id: 3, title: 'Performance Engineering', desc: 'Optimization for fast load times and battery efficiency.', color: '#06b6d4' }
    ]
  },
  {
    id: 'digital-marketing',
    name: 'Digital Media Marketing',
    img: '/icon/marketing_3d_icon_1773515887487.png',
    color: '#f97316',
    iconBg: 'linear-gradient(135deg, #fff7ed 0%, #ffefe0 100%)',
    desc: 'Data-driven campaigns that grow your audience and revenue.',
    steps: [
      { id: 1, title: 'Precision Ad Targeting', desc: 'Finding your exact audience on every major digital platform.', color: '#f97316' },
      { id: 2, title: 'Viral Content Strategy', desc: 'Engineering content designed to be shared and remembered.', color: '#f97316' },
      { id: 3, title: 'Conversion Optimization', desc: 'A/B testing and funnel tuning to maximize your ROI.', color: '#f97316' }
    ]
  },
  {
    id: 'digital-design',
    name: 'Digital Design',
    img: '/icon/digital_design_3d_icon_1773515902527.png',
    color: '#10b981',
    iconBg: 'linear-gradient(135deg, #f0fff7 0%, #e0fef0 100%)',
    desc: 'Eye-catching digital assets that make your brand unforgettable.',
    steps: [
      { id: 1, title: 'Social Media Dynamics', desc: 'Designing assets tailored for the constraints of every platform.', color: '#10b981' },
      { id: 2, title: 'Banner & Ad Creative', desc: 'High-impact visuals designed to grab attention and drive clicks.', color: '#10b981' },
      { id: 3, title: 'Motion Graphic Assets', desc: 'Bringing designs to life with smooth, professional animation.', color: '#10b981' }
    ]
  },
  {
    id: 'print-design',
    name: 'Print Media Design',
    img: '/icon/print_design_3d_icon_1773515922054.png',
    color: '#6366f1',
    iconBg: 'linear-gradient(135deg, #f3f5ff 0%, #eef1ff 100%)',
    desc: 'Premium print collateral — from business cards to billboards.',
    steps: [
      { id: 1, title: 'Material Research', desc: 'Selecting the perfect paper, ink, and finishes for your project.', color: '#6366f1' },
      { id: 2, title: 'Typography-Driven Layouts', desc: 'Expert typesetting for maximum readability and class.', color: '#6366f1' },
      { id: 3, title: 'Pre-flight & Production', desc: 'Ensuring every file is technician-perfect for the printer.', color: '#6366f1' }
    ]
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    img: '/icon/graphic_design_3d_icon_1773515937946.png',
    color: '#f43f5e',
    iconBg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
    desc: 'Creative visuals that communicate your message powerfully.',
    steps: [
      { id: 1, title: 'Bespoke Illustration', desc: 'Custom artwork that gives your brand a unique voice.', color: '#f43f5e' },
      { id: 2, title: 'Complex Vector Graphics', desc: 'Scalable visuals that look perfect from business cards to planes.', color: '#f43f5e' },
      { id: 3, title: 'Visual Storytelling', desc: 'Crafting imagery that conveys your values instantly.', color: '#f43f5e' }
    ]
  },
  {
    id: 'branding',
    name: 'Branding',
    img: '/icon/branding_3d_icon_1773515955328.png',
    color: '#a855f7',
    iconBg: 'linear-gradient(135deg, #f9f5ff 0%, #f3ebff 100%)',
    desc: 'A complete brand identity that tells your story and builds trust.',
    steps: [
      { id: 1, title: 'Brand Identity Audit', desc: 'Defining your brand voice, values, and core positioning.', color: '#a855f7' },
      { id: 2, title: 'Visual Identity Design', desc: 'Building logos and color palettes that represent your future.', color: '#a855f7' },
      { id: 3, title: 'Brand Guidelines Kit', desc: 'A roadmap for consistency across all your team members.', color: '#a855f7' }
    ]
  },
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


