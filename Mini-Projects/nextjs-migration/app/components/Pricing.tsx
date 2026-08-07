import React from 'react';
import { pricingPlans } from '../data/content';

export const Pricing = () => {
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <h2 className="section-title">Simple, transparent pricing</h2>
        <p className="section-subtitle">Choose the plan that best fits your needs. No hidden fees.</p>
        
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`card pricing-card reveal ${plan.isPopular ? 'popular' : ''}`}>
              {plan.isPopular && <div className="popular-badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="price"><span>$</span>{plan.price}<span>/mo</span></div>
              <ul className="features-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="#" className={`btn btn-${plan.buttonVariant}`} style={{ width: '100%', textAlign: 'center' }}>
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
