"use client";

import React, { useState } from 'react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Got questions? We've got answers.</p>
        
        <div className="faq-list">
          <div className="faq-item">
            <button 
              className="faq-question" 
              aria-expanded={openIndex === 0}
              onClick={() => toggleFaq(0)}
            >
              How does pricing work?
              <svg className="faq-icon" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {openIndex === 0 && (
              <div className="faq-answer">
                <p>Our pricing is tier-based depending on the number of projects and features you need. You can start with our $19/mo plan and upgrade at any time. There are no hidden fees or long-term contracts.</p>
              </div>
            )}
          </div>
          
          <div className="faq-item">
            <button 
              className="faq-question" 
              aria-expanded={openIndex === 1}
              onClick={() => toggleFaq(1)}
            >
              Can I cancel my subscription at any time?
              <svg className="faq-icon" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {openIndex === 1 && (
              <div className="faq-answer">
                <p>Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to your plan until the end of your billing cycle.</p>
              </div>
            )}
          </div>
          
          <div className="faq-item">
            <button 
              className="faq-question" 
              aria-expanded={openIndex === 2}
              onClick={() => toggleFaq(2)}
            >
              Do you offer a free trial?
              <svg className="faq-icon" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {openIndex === 2 && (
              <div className="faq-answer">
                <p>We don't offer a free trial, but we do have a 14-day money-back guarantee. If you're not satisfied with AIFlow within the first 14 days, we'll give you a full refund.</p>
              </div>
            )}
          </div>
          
          <div className="faq-item">
            <button 
              className="faq-question" 
              aria-expanded={openIndex === 3}
              onClick={() => toggleFaq(3)}
            >
              What kind of support do you provide?
              <svg className="faq-icon" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {openIndex === 3 && (
              <div className="faq-answer">
                <p>All plans include email support. The Professional plan includes faster response times, and our Enterprise plan includes a dedicated account manager and 24/7 phone support.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
