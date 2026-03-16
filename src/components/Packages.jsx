import React, { useState } from 'react';
import { Check, Phone, Star } from 'lucide-react';
import './Packages.css';

const PHONE = '+916290575057';

const MARKETING_PACKAGES = [
  {
    tier: 'Silver',
    price: '₹10K',
    period: 'Per month',
    tagline: 'Ideal for startups & local businesses — build presence & brand identity.',
    features: [
      '10 creative posts / month (static + carousel)',
      'Basic caption & hashtag strategy',
      'Design & content creation',
      'Monthly performance report',
      'Post scheduling & basic monitoring',
    ],
    goal: 'Build brand presence & establish online identity.',
    featured: false,
    accentColor: '#3b82f6',
  },
  {
    tier: 'Gold',
    price: '₹15K',
    period: 'Per month',
    tagline: 'Ideal for growing brands — stronger engagement & lead generation.',
    features: [
      '12 creative posts / month (reels, stories & static)',
      'Audience engagement (comments & replies)',
      'Ad campaign management & monthly insights',
      'Design, copywriting & content strategy',
      'Paid ad optimization (FB & IG)',
    ],
    goal: 'Grow audience, increase reach & generate quality leads.',
    featured: true,
    accentColor: '#f97316',
  },
  {
    tier: 'Diamond',
    price: '₹20K',
    period: 'Per month',
    tagline: 'Ideal for established brands — premium creative & ad performance.',
    features: [
      '15 premium creatives / month (reels, carousels, stories & static)',
      '1 high-quality video (monthly)',
      'Strategic ad campaigns for reach & conversion',
      'Monthly content calendar & consultation call',
      'Paid ads (FB & IG) + optimization & monthly growth analysis',
    ],
    goal: 'Dominate your niche with premium content & paid growth.',
    featured: false,
    accentColor: '#8b5cf6',
  },
];

const WEB_PACKAGES = [
  {
    tier: 'Silver',
    price: '₹25K',
    period: 'One-time',
    tagline: 'Perfect for startups & small businesses needing a strong online presence.',
    features: [
      'Up to 5 pages responsive website',
      'Modern UI/UX design',
      'Contact form integration',
      'Basic SEO setup',
      '1 month free support',
    ],
    goal: 'Get online fast with a clean, professional website.',
    featured: false,
    accentColor: '#3b82f6',
  },
  {
    tier: 'Gold',
    price: '₹45K',
    period: 'One-time',
    tagline: 'For businesses that need dynamic features & powerful integrations.',
    features: [
      'Up to 15 pages responsive website',
      'Custom animations & interactions',
      'CMS / Blog integration',
      'Advanced SEO & performance optimization',
      '3 months free support & maintenance',
    ],
    goal: 'Scale your business with a feature-rich web platform.',
    featured: true,
    accentColor: '#f97316',
  },
  {
    tier: 'Diamond',
    price: '₹80K',
    period: 'One-time',
    tagline: 'Full-scale web application built to grow with your business.',
    features: [
      'Unlimited pages + web app features',
      'Custom backend & database (Node.js + MongoDB)',
      'Admin dashboard & user authentication',
      'API integrations & third-party services',
      '6 months priority support & updates',
    ],
    goal: 'Build a complete digital ecosystem for your brand.',
    featured: false,
    accentColor: '#8b5cf6',
  },
];

const PriceCard = ({ pkg }) => {
  const [chosen, setChosen] = useState(false);

  const handleClick = () => {
    if (chosen) {
      window.location.href = `tel:${PHONE}`;
    } else {
      setChosen(true);
    }
  };

  return (
    <div className={`pkg-card ${pkg.featured ? 'featured' : ''}`} style={{ '--accent': pkg.accentColor }}>
      {pkg.featured && (
        <div className="pkg-badge" style={{ background: pkg.accentColor }}>
          <Star size={12} fill="white" /> Most Popular
        </div>
      )}

      <div className="pkg-header">
        <div>
          <span className="pkg-price">{pkg.price}</span>
          <span className="pkg-period">{pkg.period}</span>
        </div>
        <div className="pkg-tier-tag" style={{ background: pkg.accentColor }}>
          {pkg.tier} Package
        </div>
      </div>

      <p className="pkg-tagline">{pkg.tagline}</p>

      <div className="pkg-divider" />

      <ul className="pkg-features">
        {pkg.features.map((f, i) => (
          <li key={i}>
            <Check size={16} className="pkg-check" style={{ color: pkg.accentColor }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <p className="pkg-goal"><strong>Goal:</strong> {pkg.goal}</p>

      <button
        className={`pkg-cta ${chosen ? 'active' : ''}`}
        onClick={handleClick}
        style={chosen ? { background: pkg.accentColor } : {}}
      >
        {chosen ? (
          <>
            <Phone size={16} /> Contact Now
          </>
        ) : (
          'Choose Plan'
        )}
      </button>
    </div>
  );
};

const Packages = () => {
  const [activeTab, setActiveTab] = useState('marketing');
  const packages = activeTab === 'marketing' ? MARKETING_PACKAGES : WEB_PACKAGES;

  return (
    <section className="packages reveal" id="packages">
      <div className="packages-container">
        <div className="packages-header">
          <h2 className="packages-title">
            We've Offered <br />The Best <em>Pricing For You</em>
          </h2>

          <div className="pkg-tabs-wrapper">
            <div className="pkg-tabs">
              <button
                className={`pkg-tab ${activeTab === 'marketing' ? 'active' : ''}`}
                onClick={() => setActiveTab('marketing')}
              >
                Marketing Packages
              </button>
              <button
                className={`pkg-tab ${activeTab === 'web' ? 'active' : ''}`}
                onClick={() => setActiveTab('web')}
              >
                Website Packages
              </button>
            </div>
          </div>
        </div>

        <div className="pkg-grid">
          {packages.map((pkg) => (
            <PriceCard key={pkg.tier} pkg={pkg} />
          ))}
        </div>

        <div className="pkg-custom-cta">
          <p>Need something custom or have a unique requirement?{' '}
            <a href={`tel:${PHONE}`} className="pkg-call-btn">
              Call Us For Custom Packages
            </a></p>

        </div>
      </div>
    </section>
  );
};

export default Packages;
