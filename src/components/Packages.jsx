import React, { useState } from 'react';
import { Check, Phone, Star } from 'lucide-react';
import './Packages.css';

const PHONE = '+916290575057';

const MARKETING_PACKAGES = [
  {
    tier: 'Silver',
    price: '₹7K',
    period: 'Per month',
    tagline: 'Ideal for startups & local businesses — build presence & brand identity.',
    features: [
      '10 creative posts per month (static + carousel mix).',
      'Basic ad campaign setup (FB + IG)',
      'Caption & hashtag strategy',
      'Monthly performance report',
      'Design & Content Creation',
      'Account Optimization',
      'Post Scheduling & Monitoring',
    ],
    goal: 'Build brand presence & establish online identity.',
    featured: false,
    accentColor: '#3b82f6',
  },
  {
    tier: 'Gold',
    price: '₹10K',
    period: 'Per month',
    tagline: 'Ideal for growing brands — stronger engagement & lead generation.',
    features: [
      '12 creative posts per month (mix of reels, stories & static posts).',
      'Audience engagement management (comments/replies).',
      'Ad campaign management & monthly insights.',
      'Design, Copywriting & Content Strategy',
      'Paid Ad Optimization.',
      'Analytics & Growth Reporting',

    ],
    goal: 'Grow audience, increase reach & generate quality leads.',
    featured: true,
    accentColor: '#f97316',
  },
  {
    tier: 'Diamond',
    price: '₹12K',
    period: 'Per month',
    tagline: 'Ideal for established brands — premium creative & ad performance.',
    features: [
      '15 premium creatives (reels, carousels, stories & static).',
      '1 high-quality video per month.',
      'Strategic ad campaigns for reach & conversion.',
      'Monthly content calendar & consultation call.',
      'Creative Design + Content Strategy.',
      'Paid Ads (FB & IG) + Optimization.',
      'Monthly Growth Analysis & Strategy Review.',
    ],
    goal: 'Dominate your niche with premium content & paid growth.',
    featured: false,
    accentColor: '#8b5cf6',
  },
];

const WEB_PACKAGES = [
  {
    tier: 'Starter',
    price: '₹15K',
    period: 'One-time',
    tagline: 'Early-stage businesses establishing an online presence',
    features: [
      'Up to 5 Website Pages (e.g., Home, About, Services, Contact)',
      'Responsive Design (Mobile, Tablet, Desktop)',
      'Clean UI aligned with brand identity',
      'Contact Form Integration (Email & WhatsApp)',
      'Basic Search Engine Optimization (On-page structure)',
      'Social Media Integration',
      '1 Year Hosting Support',
    ],
    goal: 'Get online fast with a clean, professional website.',
    featured: false,
    accentColor: '#3b82f6',
  },
  {
    tier: 'Growth',
    price: '₹25K',
    period: 'One-time',
    tagline: 'Growing businesses focused on lead generation and brand positioning',
    features: [
      'Up to 10 Website Pages',
      'Custom UI/UX Design (Modern, Conversion-oriented)',
      'Contact Form Integration (Email & WhatsApp)',
      'Basic Content Management System (CMS) ',
      'Performance, Speed & SEO Optimization  ',
      'Responsive Design (Mobile, Tablet, Desktop)',
      'Social Media Integration',
      '15 days Free Marketing',
      '1 Year Free Hosting ',
      '30 Days Free Post-Launch Support & Maintanence',
    ],
    goal: 'Scale your business with a feature-rich web platform.',
    featured: true,
    accentColor: '#f97316',
  },
  {
    tier: 'Business',
    price: '₹50K',
    period: 'One-time',
    tagline: 'Full-scale web application built to grow with your business.',
    features: [
      'Custom Website / Web Application Development',
      'Scalable Architecture',
      'Admin Dashboard & CMS Functionality',
      'Custom UI/UX Design (Figma Prototyping Included)',
      'Advanced Animations & Interactive Elements',
      'Technical SEO, Performance & Speed Optimization',
      'Analytics Integration',
      'Security Configuration (SSL, basic protection setup)',
      '30 days Free Marketing',
      '6 Months Free Post-Launch Support & Maintenance',
      '1 Year Free Hosting ',
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
      <div className="pkg-header">
        <div className="pkg-price-block">
          <span className="pkg-price">{pkg.price}</span>
          <span className="pkg-period">{pkg.period}</span>
          <div className="pkg-tier-tag" style={{ background: pkg.accentColor }}>
            {pkg.featured && <Star size={12} fill="white" style={{ marginRight: '4px' }} />}
            {pkg.tier} Package
          </div>
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
  const [activeTab, setActiveTab] = useState('web');
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
                className={`pkg-tab ${activeTab === 'web' ? 'active' : ''}`}
                onClick={() => setActiveTab('web')}
              >
                Website Packages
              </button>
              <button
                className={`pkg-tab ${activeTab === 'marketing' ? 'active' : ''}`}
                onClick={() => setActiveTab('marketing')}
              >
                Marketing Packages
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
