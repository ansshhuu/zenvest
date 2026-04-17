import React from 'react';
import RotatingText from '../components/animations/RotatingText';
import ScrollFloat from '../components/animations/ScrollFloat';


export default function Hero({ navigate }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="container">
        <div className="hero-content">
          <div style={{ animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
            <h1 className="hero-title">
              Insurance built for <RotatingText texts={["gig workers", "delivery riders", "your future"]} className="text-blue-600" /> on the go
            </h1>
            <ScrollFloat delay={0.1}>
              <p className="hero-subtitle">
                Parametric micro-insurance for delivery workers. Auto-payouts when it rains, AI-powered risk scoring, and plans from ₹99/week. No paperwork. No wait.
              </p>
            </ScrollFloat>

            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate("register")}>
                Start Free — Get Covered
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate("dashboard")}>
                View Demo Dashboard
              </button>
            </div>
          </div>
          <div className="hero-visual" style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>
            <div style={{ position: "relative" }}>
              <div className="floating-card top-left">
                <div className="fc-icon" style={{ background: "#F0FDF4" }}>🌧</div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Rain trigger</div>
                  <div style={{ color: "var(--success)" }}>+₹350 credited</div>
                </div>
              </div>
              <div className="hero-phone-mockup">
                <div className="phone-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="phone-avatar">R</div>
                    <div className="phone-greeting">
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Good morning</div>
                      <div className="name">Ravi Kumar</div>
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" stroke="var(--text-secondary)" strokeWidth="2" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                    <div style={{ position: "absolute", top: -4, right: -4, width: 10, height: 10, borderRadius: "50%", background: "var(--error)", border: "2px solid white" }} />
                  </div>
                </div>
                <div className="policy-card-mini">
                  <div className="plan-name">Smart Shield</div>
                  <div className="coverage">₹1,00,000</div>
                  <div className="meta"><span>ACTIVE</span><span>Renews Sunday</span></div>
                </div>
                <div className="mini-stats">
                  <div className="mini-stat"><div className="v">₹1,200</div><div className="l">Claims</div></div>
                  <div className="mini-stat"><div className="v">8 wks</div><div className="l">Active</div></div>
                  <div className="mini-stat"><div className="v">82</div><div className="l">Trust</div></div>
                </div>
              </div>
              <div className="floating-card bottom-right">
                <div className="fc-icon" style={{ background: "var(--blue-light)" }}>🛡</div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Risk score</div>
                  <div style={{ color: "var(--blue)" }}>72 · High</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
