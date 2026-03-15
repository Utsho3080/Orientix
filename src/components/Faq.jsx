import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import './Faq.css';

const FAQ_DATA = [
  {
    question: "I already have a website, but it looks outdated. Can you redesign it for export buyers?",
    answer: "Yes, we specialize in high-conversion redesigns. We'll analyze your current site and rebuild it with modern aesthetics and a focus on capturing the attention of international buyers."
  },
  {
    question: "How long does it take to design and launch an export website?",
    answer: "Typically, a complete professional project takes between 3 to 6 weeks, depending on the complexity and features required (like catalogs or multilingual support)."
  },
  {
    question: "How much does it cost?",
    answer: "Our pricing is tailored to the project's specific needs. We offer different tiers based on whether you need a simple landing page or a full-scale corporate platform. Contact us for a custom quote."
  },
  {
    question: "I don't have a company profile or product catalogue. Can you help with that too?",
    answer: "Absolutely! Our team includes content strategists and designers who can help you draft a professional company profile and organize your product data into a stunning digital catalogue."
  },
  {
    question: "What if I'm not sure what type of website or design I need?",
    answer: "Don't worry—most of our clients start there. We'll consult with you to understand your target market and goals, then recommend the most effective strategy for your specific business."
  },
  {
    question: "Do you also handle domain, hosting, and email setup?",
    answer: "Yes, we provide end-to-end management. From securing your domain name to setting up secure hosting and professional business emails, we handle all the technical details."
  },
  {
    question: "Can I update my website later by myself?",
    answer: "Yes! We build using intuitive CMS platforms that allow you to easily edit text, add new products, or update your blog without needing any technical knowledge."
  },
  {
    question: "What makes you different from other website designers?",
    answer: "We don't just 'design websites.' We build business tools. Our focus on user psychology, cutting-edge 3D visuals, and speed optimization ensures your site is a powerful driver for your sales."
  }
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq reveal" id="faq">
      <div className="faq-container">
        <div className="faq-header">
          {/*<span className="section-badge">Got Questions?</span>*/}
          <h2 className="faq-title">Frequently <br />Asked <em>Questions</em></h2>
        </div>

        <div className="faq-list">
          {FAQ_DATA.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFaq(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{item.question}</span>
                <div className={`faq-icon ${activeIndex === index ? 'open' : ''}`}>
                  {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
