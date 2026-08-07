import React from 'react';

export const Features = () => {
  return (
    <section className="section features" id="features">
      <div className="container">
        <h2 className="section-title">Everything you need to scale</h2>
        <p className="section-subtitle">Powerful features designed to help your team build and deploy faster.</p>
        
        <div className="features-grid">
          {/* Card 1 */}
          <div className="card feature-card reveal">
            <div className="feature-icon">
              <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3>AI Automation</h3>
            <p>Automate repetitive tasks and workflows with our advanced machine learning models.</p>
          </div>
          {/* Card 2 */}
          <div className="card feature-card reveal">
            <div className="feature-icon">
              <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
            </div>
            <h3>Cloud Infrastructure</h3>
            <p>Deploy globally with low latency. Our robust infrastructure scales automatically.</p>
          </div>
          {/* Card 3 */}
          <div className="card feature-card reveal">
            <div className="feature-icon">
              <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3>Analytics Dashboard</h3>
            <p>Get real-time insights into your app's performance with customizable metrics.</p>
          </div>
          {/* Card 4 */}
          <div className="card feature-card reveal">
            <div className="feature-icon">
              <svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3>Security</h3>
            <p>Enterprise-grade security features built-in to protect your sensitive data.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
