import React, { useState } from 'react';
import AppHeader from '../components/layout/AppHeader';
import { AppStateManager } from '../store/appState';
import { PLANS } from '../data/config';
import { formatDate } from '../utils/helpers';

export default function TriggersPage({ navigate, appState }) {
  const plan = appState.plan || AppStateManager.get("plan");
  const user = appState.user || AppStateManager.get("user");
  const claims = appState.claims || AppStateManager.get("claims") || [];
  const paramClaims = claims.filter(c => ["rain", "aqi", "heat", "wind"].includes(c.type)).reverse().slice(0, 5);
  const lastPayout = paramClaims[0];
  const payouts = PLANS[plan?.key]?.triggerPayouts || PLANS.smart.triggerPayouts;

  const TRIGGERS = [
    { type: "rain", icon: "🌧", bg: "#DBEAFE", name: "Rainfall Trigger", condition: "Activates when rainfall > 25mm in your zone", status: "TRIGGERED", statusClass: "badge-success", meta: "2 days ago" },
    { type: "aqi", icon: "🌫", bg: "#FEF3C7", name: "AQI Trigger", condition: "Activates when AQI > 300 in your zone", status: "MONITORING", statusClass: "badge-warning", meta: "AQI: 187 now" },
    { type: "heat", icon: "🌡", bg: "var(--error-light)", name: "Heat Trigger", condition: "Activates when temperature > 42°C", status: "INACTIVE", statusClass: "badge-default", meta: "Current: 35°C" },
    { type: "wind", icon: "💨", bg: "#F1F5F9", name: "Wind Trigger", condition: "Activates when wind speed > 60 km/h", status: "INACTIVE", statusClass: "badge-default", meta: "Current: 18 km/h" },
  ];

  return (
    <div style={{ background: "var(--bg)" }}>
      <AppHeader navigate={navigate} avatarLetter={user?.name?.[0]?.toUpperCase() || "?"} activePage="triggers" />
      <div style={{ paddingTop: 68 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 24px" }}>
          <div className="card" style={{ background: "linear-gradient(135deg,#1E3A8A,#1E1B4B)", color: "white", marginBottom: 28, textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌧</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Weather-based auto payouts</h2>
            <p style={{ opacity: 0.8, fontSize: 15 }}>When thresholds are breached, money hits your account automatically. No forms. No waiting.</p>
          </div>
          {!plan ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛡</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No active policy</div>
              <div style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: 14 }}>Get a policy first to see your triggers and auto-payouts.</div>
              <button className="btn btn-primary" onClick={() => navigate("register")}>Get Protected →</button>
            </div>
          ) : (
            <>
              {lastPayout ? (
                <div className="card" style={{ background: "var(--success-light)", borderColor: "#BBF7D0", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#166534" }}>Last payout: ₹{lastPayout.amount} on {formatDate(lastPayout.date)}</div>
                    <div style={{ fontSize: 13, color: "#15803D" }}>{lastPayout.desc}</div>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ background: "var(--blue-light)", borderColor: "#BFDBFE", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" stroke="white" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1D4ED8" }}>Monitoring your zone</div>
                    <div style={{ fontSize: 13, color: "#2563EB" }}>No payouts yet — we check triggers every 15 minutes</div>
                  </div>
                </div>
              )}
              <div className="dashboard-section-title">Active Triggers</div>
              {TRIGGERS.map(t => (
                <div key={t.type} className="trigger-card">
                  <div className="trigger-icon-wrap" style={{ background: t.bg, fontSize: 28 }}>{t.icon}</div>
                  <div className="trigger-info">
                    <div className="trigger-name">{t.name}</div>
                    <div className="trigger-condition">{t.condition}</div>
                    <div className="trigger-payout">Payout: ₹{payouts[t.type]} per trigger</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`badge ${t.statusClass}`}>{t.status}</span>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{t.meta}</div>
                  </div>
                </div>
              ))}
              {paramClaims.length > 0 && (
                <div style={{ marginTop: 32 }}>
                  <div className="dashboard-section-title">Recent Parametric Payouts</div>
                  <div className="card" style={{ padding: "0 24px" }}>
                    {paramClaims.map(c => (
                      <div key={c.id} className="claim-item">
                        <div className="claim-date">{formatDate(c.date)}</div>
                        <div className="claim-info">
                          <div className="claim-type">{{ rain: "🌧", aqi: "🌫", heat: "🌡", wind: "💨" }[c.type] || "🌧"} {c.title}</div>
                          <div className="claim-reason">{c.desc}</div>
                        </div>
                        <div className="claim-amount">+₹{c.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
