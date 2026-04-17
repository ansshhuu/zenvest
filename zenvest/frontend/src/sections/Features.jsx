import React from 'react';
import { FEATURES } from '../data/config';

export default function Features() {
  return (
    <section className="section" id="features" style={{ background: "white" }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div style={{ maxWidth: 600 }}>
          <div className="section-label group">
            <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" fill="none" className="group-hover:rotate-12 transition-transform"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            Why Zenvest
          </div>
          <h2 className="section-title">Insurance that actually works for you</h2>
          <p className="section-subtitle">Built ground-up for India's 15 million gig delivery workers. Auto-payouts. No forms. No rejections.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`feature-card animate-in animate-in-delay-${i + 1}`}>
              <div className={`feature-icon ${f.color}`} dangerouslySetInnerHTML={{ __html: f.iconSvg }} />
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
