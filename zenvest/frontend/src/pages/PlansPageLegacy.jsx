import React, { useState } from 'react';
import RegisterHeader from '../components/layout/RegisterHeader';
import { AppStateManager } from '../store/appState';
import { PLANS } from '../data/config';

export default function PlansPageLegacy({ navigate, showToast, appState, setAppState }) {
  const riskData = AppStateManager.get("riskScore");
  const getRecommended = () => {
    if (!riskData) return "smart";
    if (riskData.score >= 85) return "pro";
    if (riskData.score >= 70) return "smart";
    if (riskData.score < 45) return "starter";
    return "smart";
  };
  const [selected, setSelected] = useState(getRecommended);

  const p = PLANS[selected];
  const user = AppStateManager.get("user");
  const zone = Math.round(p.base * 0.15);
  const night = user?.shift === "night" ? Math.round(p.base * 0.08) : 0;
  const total = p.base + zone + night;

  const confirmPlan = () => {
    const plan = { key: selected, name: p.name, coverage: p.coverage, premium: total, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), policyId: "ZV-" + Math.floor(Math.random() * 9000 + 1000) };
    AppStateManager.set("plan", plan);
    setAppState(s => ({ ...s, plan }));
    showToast("Plan activated! Taking you to your dashboard...", "success");
    setTimeout(() => navigate("dashboard"), 1200);
  };

  return (
    <div>
      <RegisterHeader navigate={navigate} right={<button className="btn btn-ghost btn-sm" onClick={() => navigate("risk")}>← Back</button>} />
      <div className="plans-content">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label" style={{ justifyContent: "center", marginBottom: 12 }}>Step 3 of 3</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 8 }}>Choose your coverage</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>Personalised plans based on your risk score — <span>based on risk score of {riskData?.score || "—"} ({riskData?.label || "—"})</span></p>
        </div>
        <div className="plans-cards">
          {[
            { key: "starter", features: ["Accident cover", "Basic hospitalisation", "24/7 helpline"] },
            { key: "smart", recommended: true, features: ["Everything in Starter", "Parametric weather cover", "Equipment cover (₹10,000)", "Rain auto-payout", "AQI trigger protection"] },
            { key: "pro", bestValue: true, features: ["Everything in Smart", "Critical illness cover", "Income protection (14 days)", "Priority claims (2h)", "Family accident cover"] },
          ].map(({ key, recommended, bestValue, features }) => {
            const plan = PLANS[key];
            return (
              <div key={key} className={`plan-card${selected === key ? " selected" : ""}`} id={`pc-${key}`} onClick={() => setSelected(key)} style={recommended ? { paddingTop: 40 } : {}}>
                {recommended && <div className="plan-recommended-badge">⭐ Recommended for you</div>}
                <div className="plan-check"><svg viewBox="0 0 24 24" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12" /></svg></div>
                {bestValue && <div style={{ position: "absolute", top: 16, right: 52 }}><span className="badge badge-purple" style={{ fontSize: 10 }}>BEST VALUE</span></div>}
                <div className="plan-name">{plan.name.split(" ")[0].toUpperCase()}</div>
                <div className="plan-price">₹{plan.base}</div>
                <div className="plan-period">per week</div>
                <div className="plan-coverage">Coverage: <strong>{plan.coverage}</strong></div>
                <ul className="plan-features">{features.map(f => <li key={f}>{f}</li>)}</ul>
              </div>
            );
          })}
        </div>
        <div className="premium-breakdown">
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Premium Breakdown — {p.name}</div>
          {[
            { label: "Base premium", value: `₹${p.base}`, icon: null },
            { label: "Zone risk adjustment (+15%)", value: `+₹${zone}`, icon: "warning" },
            { label: "Night shift surcharge (+8%)", value: night > 0 ? `+₹${night}` : "₹0", icon: "clock" },
            { label: "Loyalty discount (–0%)", value: "–₹0", icon: "star", valueColor: "var(--success)" },
          ].map(row => (
            <div key={row.label} className="premium-row">
              <span className="label">{row.label}</span>
              <span className="value" style={row.valueColor ? { color: row.valueColor } : {}}>{row.value}</span>
            </div>
          ))}
          <div className="premium-row premium-total">
            <span className="label">Final weekly premium</span>
            <span className="value">₹{total}</span>
          </div>
        </div>
        <button className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 24 }} onClick={confirmPlan}>Continue with {p.name} →</button>
      </div>
    </div>
  );
}
