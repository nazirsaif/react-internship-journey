import React from 'react';

// Using static data directly here initially, to be moved to server-side rendering later
export const Pricing = () => {
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <h2 className="section-title">Simple, transparent pricing</h2>
        <p className="section-subtitle">Choose the plan that best fits your needs. No hidden fees.</p>
        
        <div className="pricing-grid">
          {/* Starter Plan */}
          <div className="card pricing-card reveal">
            <h3>Starter</h3>
            <div className="price"><span>$</span>19<span>/mo</span></div>
            <ul className="features-list">
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Up to 5 projects</li>
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Basic analytics</li>
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 24-hour support response time</li>
            </ul>
            <a href="#" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Choose Starter</a>
          </div>
          
          {/* Professional Plan */}
          <div className="card pricing-card popular reveal">
            <div className="popular-badge">Most Popular</div>
            <h3>Professional</h3>
            <div className="price"><span>$</span>49<span>/mo</span></div>
            <ul className="features-list">
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Unlimited projects</li>
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Advanced analytics & reports</li>
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 1-hour support response time</li>
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Custom domain</li>
            </ul>
            <a href="#" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Choose Professional</a>
          </div>
          
          {/* Enterprise Plan */}
          <div className="pricing-card card reveal">
            <h3>Enterprise</h3>
            <div className="price"><span>$</span>99<span>/mo</span></div>
            <ul className="features-list">
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Everything in Professional</li>
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Dedicated account manager</li>
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Phone support 24/7</li>
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Custom integration</li>
              <li><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> SLA</li>
            </ul>
            <a href="#" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
};
