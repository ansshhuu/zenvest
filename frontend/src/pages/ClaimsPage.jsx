import React, { useState } from 'react';
import AppHeader from '../components/layout/AppHeader';
import { AppStateManager } from '../store/appState';
import { formatDate } from '../utils/helpers';

export default function ClaimsPage({ navigate, showToast, appState, setAppState }) {
  const plan = appState.plan || AppStateManager.get("plan");
  const [claims, setClaims] = useState(appState.claims || AppStateManager.get("claims") || []);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [claimType, setClaimType] = useState("Accident");
  const [claimDesc, setClaimDesc] = useState("");
  const [claimAmount, setClaimAmount] = useState("");

  const totalPaid = claims.filter(c => c.status === "paid").reduce((s, c) => s + c.amount, 0);
  const filtered = filter === "parametric" ? claims.filter(c => ["rain", "aqi", "heat", "wind"].includes(c.type))
    : filter === "manual" ? claims.filter(c => c.type === "manual") : claims;

  const submitClaim = () => {
    if (!claimDesc.trim()) { showToast("Please describe the incident", "error"); return; }
    const amount = parseInt(claimAmount) || 0;
    if (amount < 100) { showToast("Amount must be at least ₹100", "error"); return; }
    const claim = { id: "CLM-" + Date.now(), type: "manual", title: claimType, desc: claimDesc, amount, date: new Date().toISOString(), status: "pending" };
    const updated = [...claims, claim];
    setClaims(updated);
    AppStateManager.set("claims", updated);
    setAppState(s => ({ ...s, claims: updated }));
    setModalOpen(false); setClaimDesc(""); setClaimAmount("");
    showToast("Claim filed! Under review — usually within 4 hours.", "success");
  };

  const icons = { rain: "🌧", aqi: "🌫", heat: "🌡", wind: "💨", manual: "📋" };
  const statusBadge = { paid: "badge-success", pending: "badge-warning", rejected: "badge-error", auto_approved: "badge-success" };
  const statusLabel = { paid: "PAID", pending: "PENDING", rejected: "REJECTED", auto_approved: "AUTO-PAID" };

  return (
    <div style={{ background: "var(--bg)" }}>
      <AppHeader navigate={navigate} avatarLetter={appState.user?.name?.[0]?.toUpperCase() || "?"} activePage="claims" />
      <div style={{ paddingTop: 68 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", marginBottom: 6 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700 }}>Claims & Payouts</h2>
            <button className="btn btn-primary btn-sm" onClick={() => plan ? setModalOpen(true) : showToast("Please get a policy first", "error")}>+ File a Claim</button>
          </div>
          <p style={{ color: "var(--text-secondary)", marginBottom: 28 }}>Your complete claims history</p>
          {!plan ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛡</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No active policy</div>
              <div style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: 14 }}>You need an active policy to file claims or receive parametric payouts.</div>
              <button className="btn btn-primary" onClick={() => navigate("register")}>Get Protected →</button>
            </div>
          ) : (
            <>
              <div className="card" style={{ background: "linear-gradient(135deg,var(--blue),var(--purple))", color: "white", marginBottom: 28, display: "flex", gap: 32, flexWrap: "wrap" }}>
                {[["Total received", `₹${totalPaid.toLocaleString("en-IN")}`], ["Payouts", claims.filter(c => c.status === "paid").length], ["Manual claims", claims.filter(c => c.type === "manual").length]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
                    <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-1px" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="filter-tabs">
                {[["all", "All"], ["parametric", "Parametric"], ["manual", "Manual"]].map(([k, l]) => (
                  <div key={k} className={`filter-tab${filter === k ? " active" : ""}`} onClick={() => setFilter(k)}>{l}</div>
                ))}
              </div>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", marginTop: 8 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{filter === "manual" ? "📋" : "☀️"}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{filter === "manual" ? "No manual claims yet" : filter === "parametric" ? "No parametric payouts yet" : "No claims yet"}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 300, margin: "0 auto 24px", lineHeight: 1.6 }}>
                    {filter === "manual" ? "Manual claims are for accidents and illness." : filter === "parametric" ? "Parametric payouts trigger automatically on weather events." : "Your claims and auto-payouts will appear here once your policy is active."}
                  </div>
                  {filter !== "parametric" && <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ File a Manual Claim</button>}
                </div>
              ) : (
                <div className="card" style={{ padding: "0 24px", minHeight: 80 }}>
                  {[...filtered].reverse().map(c => (
                    <div key={c.id} className="claim-item">
                      <div className="claim-date">{formatDate(c.date)}</div>
                      <div className="claim-info">
                        <div className="claim-type">{icons[c.type] || "📋"} {c.title}</div>
                        <div className="claim-reason">{c.desc}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className={`badge ${statusBadge[c.status] || "badge-success"}`}>{statusLabel[c.status] || "PAID"}</span>
                        <div className="claim-amount" style={{ marginTop: 4 }}>+₹{c.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {modalOpen && (
        <div style={{ display: "flex", position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "white", borderRadius: "var(--radius-xl)", padding: 36, maxWidth: 480, width: "100%", boxShadow: "var(--shadow-xl)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>File a Manual Claim</div>
              <button onClick={() => setModalOpen(false)} style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="input-group">
                <label className="input-label">Claim Type</label>
                <select className="input" value={claimType} onChange={e => setClaimType(e.target.value)}>
                  <option>🚗 Road Accident</option><option>🏥 Hospitalisation</option><option>🛵 Equipment / Vehicle Damage</option><option>💸 Income Loss</option><option>📋 Other</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input" rows={3} placeholder="Briefly describe the incident..." value={claimDesc} onChange={e => setClaimDesc(e.target.value)} style={{ height: "auto", padding: "12px 16px", resize: "none" }} />
              </div>
              <div className="input-group">
                <label className="input-label">Claim Amount (₹)</label>
                <input className="input" type="number" placeholder="e.g. 5000" min={100} value={claimAmount} onChange={e => setClaimAmount(e.target.value)} />
              </div>
              <div style={{ background: "var(--warning-light)", border: "1px solid #FDE68A", borderRadius: "var(--radius-md)", padding: 14, fontSize: 13, color: "#92400E" }}>⚡ Claims are reviewed within 4 hours. Keep supporting documents (photos, bills) ready.</div>
              <button className="btn btn-primary" style={{ width: "100%", height: 48 }} onClick={submitClaim}>Submit Claim →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
