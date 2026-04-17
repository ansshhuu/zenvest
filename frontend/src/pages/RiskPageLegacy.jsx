import React, { useState, useEffect } from 'react';
import RegisterHeader from '../components/layout/RegisterHeader';
import { AppStateManager } from '../store/appState';
import { RiskService } from '../services/riskService';

export default function RiskPageLegacy({ navigate, showToast, appState, setAppState }) {
  const [loading, setLoading] = useState(true);
  const [loadText, setLoadText] = useState("Analysing your zone...");
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    const user = AppStateManager.get("user") || {};
    const msgs = ["Analysing your zone...", "Checking shift patterns...", "Running AI risk model...", "Reviewing earnings stability...", "Finalising your risk score..."];
    let i = 0;
    const iv = setInterval(() => { setLoadText(msgs[i % msgs.length]); i++; }, 700);

    RiskService.calculateRisk(user).then(data => {
      clearInterval(iv); setLoading(false); setRiskData(data);
      AppStateManager.set("riskScore", data);
      AppStateManager.set("trustScore", data.trustScore || 70);
      setAppState(s => ({ ...s, riskScore: data, trustScore: data.trustScore || 70 }));
    });
    return () => clearInterval(iv);
  }, []);

  const gaugeOffset = riskData ? 502 - (riskData.score / 100) * 502 : 502;
  const gaugeColor = riskData ? (riskData.score >= 70 ? "#DC2626" : riskData.score >= 50 ? "#F59E0B" : "#16A34A") : "#E2E8F0";

  return (
    <div>
      <RegisterHeader navigate={navigate} right={<span className="badge badge-info">AI Analysis</span>} />
      {loading ? (
        <div className="risk-loading">
          <div className="risk-logo-pulse">
            <svg width="36" height="36" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Analysing your profile</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>{loadText}</p>
          <div className="loading-dots"><div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" /></div>
        </div>
      ) : riskData && (
        <div className="risk-result" style={{ animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="risk-gauge-wrap">
            <svg className="gauge-svg" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#E2E8F0" strokeWidth="12" />
              <circle cx="100" cy="100" r="80" fill="none" stroke={gaugeColor} strokeWidth="12" strokeLinecap="round" strokeDasharray="502" strokeDashoffset={gaugeOffset} transform="rotate(-90 100 100)" style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)" }} />
              <text x="100" y="95" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="44" fontWeight="700" fill="#0F172A">{riskData.score}</text>
              <text x="100" y="118" textAnchor="middle" fontFamily="'DM Sans',sans-serif" fontSize="13" fill="#64748B">{riskData.label} Risk</text>
            </svg>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 4 }}>
              <span className={`badge badge-${riskData.score >= 70 ? "error" : riskData.score >= 50 ? "warning" : "success"}`}>{riskData.label?.toUpperCase()} RISK</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", textAlign: "center", marginTop: 12, maxWidth: 440, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>{riskData.summary}</p>
          </div>
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 20 }}>Risk Breakdown</div>
            <div className="risk-breakdown">
              {riskData.factors?.map((f, idx) => {
                const color = f.pct >= 70 ? "var(--error)" : f.pct >= 50 ? "var(--warning)" : "var(--success)";
                return (
                  <div key={idx} className="risk-bar-item">
                    <div className="risk-bar-header"><span className="risk-bar-name">{f.name}</span><span className="risk-bar-pct" style={{ color }}>{f.pct}%</span></div>
                    <div className="risk-bar-track"><div className="risk-bar-fill" style={{ width: `${f.pct}%`, background: color, transition: "width 0.8s ease" }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ background: "var(--blue-light)", border: "1px solid #BFDBFE", borderRadius: "var(--radius-md)", padding: "14px 18px", marginBottom: 24, fontSize: 14, color: "var(--blue-dark)", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
            <span>{riskData.summary}</span>
          </div>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Personalised suggestions</div>
            <div className="suggestion-chips">{riskData.suggestions?.map(s => <div key={s} className="suggestion-chip">{s}</div>)}</div>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={() => navigate("plans")}>See My Recommended Plan →</button>
        </div>
      )}
    </div>
  );
}
