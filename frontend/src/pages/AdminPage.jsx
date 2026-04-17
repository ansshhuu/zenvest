import React from 'react';
import Logo from '../components/layout/Logo';
import { ADMIN_STATS, ADMIN_ZONES, ADMIN_FRAUD, ADMIN_RISK_TABLE } from '../data/config';

export default function AdminPage({ navigate }) {
  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="app-header">
        <Logo onClick={() => navigate("home")} />
        <button className="btn btn-ghost" onClick={() => navigate("home")}>← Back to site</button>
      </div>
      <div style={{ paddingTop: 68 }}>
        <div className="admin-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Admin View — Zenvest Operations Dashboard
          <span className="badge badge-warning" style={{ marginLeft: 8 }}>Internal Only</span>
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 32px" }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Operations Overview</h2>
            <p style={{ color: "var(--text-secondary)" }}>Week of 31 Mar – 6 Apr 2025</p>
          </div>
          <div className="admin-grid">
            {ADMIN_STATS.map(s => (
              <div key={s.label} className="admin-stat">
                <div className="stat-number">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-trend" style={{ color: s.trendColor }}>{s.trend}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Zone Heatmap</div>
              <span className="badge badge-default">Risk intensity</span>
            </div>
            <div className="zone-heatmap">
              {ADMIN_ZONES.map(z => (
                <div key={z.name} className="zone-cell" style={{ background: z.bg, color: z.color }}>{z.name}<br /><small>{z.level}</small></div>
              ))}
            </div>
          </div>
          <div className="card" style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Fraud Alerts</div>
              <span className="badge badge-error">{ADMIN_FRAUD.length} Active</span>
            </div>
            {ADMIN_FRAUD.map(f => (
              <div key={f.id} className="fraud-item">
                <svg width="20" height="20" viewBox="0 0 24 24" stroke="var(--error)" strokeWidth="2" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#991B1B" }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "#B91C1C" }}>{f.desc}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-destructive">Flag</button>
                  <button className="btn btn-sm btn-secondary">Review</button>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Next-Week Risk Predictions</div>
              <span className="badge badge-info">AI Model v2.1</span>
            </div>
            <table className="risk-table">
              <thead><tr><th>Zone</th><th>Predicted Risk</th><th>Active Policies</th><th>Expected Payouts</th><th>Weather Alert</th></tr></thead>
              <tbody>
                {ADMIN_RISK_TABLE.map(r => (
                  <tr key={r.zone}>
                    <td><strong>{r.zone}</strong></td>
                    <td><span className={`badge badge-${r.riskClass}`}>{r.risk}</span></td>
                    <td>{r.policies}</td>
                    <td style={{ color: r.payoutColor, fontWeight: 700 }}>{r.payouts}</td>
                    <td><span className={`badge badge-${r.alertClass}`}>{r.alert}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
