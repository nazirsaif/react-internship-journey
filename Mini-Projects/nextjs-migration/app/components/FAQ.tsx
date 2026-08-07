import React from 'react';
import { faqItems } from '../data/content';
import { FAQAccordion } from './FAQAccordion';

export const FAQ = () => {
  return (
    <section className="section faq" id="faq">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Got questions? We've got answers.</p>
        <FAQAccordion items={faqItems} />
      </div>
    </section>
  );
};
