import React from 'react';
import { STEPS_HOW } from '../data/config';

export default function HowItWorks() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 60px" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>How it works</div>
          <h2 className="section-title">Get covered in under 5 minutes</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>From registration to active policy — everything digital, no office visits needed.</p>
        </div>
        <div className="steps-row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {STEPS_HOW.map((s, i) => (
            <div key={s.title} className={`step-item${i === 0 ? " active" : ""}`} style={{ flex: '1 1 0', minWidth: '200px', display: 'flex', alignItems: 'flex-start', gap: '16px', textAlign: 'left' }}>
              <div className="step-number" style={{ flexShrink: 0, margin: 0 }}>{i + 1}</div>
              <div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc" style={{ margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
