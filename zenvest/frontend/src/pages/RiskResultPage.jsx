/**
 * RiskResultPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Consumes the RiskAnalysisResponse from appState.analysisResult and displays
 * a full-detail risk report: score, label, explanation, breakdown, suggestions.
 * All values are driven by props/state — nothing is hardcoded.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, TrendingUp, Lightbulb, Lock } from 'lucide-react';

// Risk display metadata — keyed by API riskLabel string
const RISK_META = {
  Low:      { color: '#16A34A', bg: '#DCFCE7', ring: '#BBF7D0', emoji: '🟢', badge: 'LOW RISK',       gauge: 26 },
  Medium:   { color: '#D97706', bg: '#FEF3C7', ring: '#FDE68A', emoji: '🟡', badge: 'MEDIUM RISK',    gauge: 54 },
  High:     { color: '#DC2626', bg: '#FEE2E2', ring: '#FECACA', emoji: '🔴', badge: 'HIGH RISK',      gauge: 80 },
  'Very High': { color: '#9333EA', bg: '#F3E8FF', ring: '#E9D5FF', emoji: '🟣', badge: 'VERY HIGH RISK', gauge: 92 },
};

function getRiskMeta(label) {
  return RISK_META[label] ?? RISK_META.Medium;
}

// ── Animated gauge ─────────────────────────────────────────────────────────────
function GaugeRing({ score, color }) {
  const CIRC   = 2 * Math.PI * 70; // radius 70
  const offset = CIRC - (score / 100) * CIRC;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r="70" fill="none" stroke="#E2E8F0" strokeWidth="12" />
        <motion.circle
          cx="90" cy="90" r="70"
          fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="absolute text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="text-[38px] font-black text-slate-800 leading-none"
        >
          {score}
        </motion.div>
        <div className="text-[12px] text-slate-500 font-bold mt-1">/ 100</div>
      </div>
    </div>
  );
}

// ── Score factor bar ───────────────────────────────────────────────────────────
function FactorBar({ name, pct, description, delay }) {
  const barColor = pct >= 70 ? '#DC2626' : pct >= 50 ? '#D97706' : '#16A34A';
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-bold text-slate-700">{name}</span>
        <span className="text-[13px] font-black" style={{ color: barColor }}>{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
        />
      </div>
      <p className="text-[11px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
        {description}
      </p>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function RiskResultPage({ navigate, appState }) {
  const result = appState.analysisResult;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!result) { navigate('register'); return; }
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [result, navigate]);

  if (!result) return null;

  const meta = getRiskMeta(result.riskLabel);

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-x-hidden">

      {/* Ambient */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: meta.color + '18' }} />

      {/* Header */}
      <header className="h-[68px] bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-extrabold text-[22px] tracking-tight text-slate-800">Zenvest</span>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full tracking-wide uppercase">
          AI Analysis Complete
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-10 pb-24">

        {/* ── Hero section ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="text-[13px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Your risk profile is ready</div>
          <h1 className="text-[32px] font-extrabold text-slate-800 tracking-tight mb-3">AI Risk Analysis Report</h1>
          <p className="text-slate-500 text-[15px] leading-relaxed max-w-sm mx-auto">{result.explanation}</p>
        </motion.div>

        {/* ── Risk gauge card ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.95 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-[24px] border border-slate-100 shadow-[0_16px_50px_-12px_rgba(15,23,42,0.08)] p-8 mb-6 relative overflow-hidden"
        >
          {/* Colour blob */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
            style={{ backgroundColor: meta.color + '25' }} />

          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Gauge */}
            <GaugeRing score={result.riskScore} color={meta.color} />

            {/* Labels */}
            <div className="flex-1 text-center sm:text-left">
              <div
                className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-3"
                style={{ backgroundColor: meta.bg, color: meta.color, border: `1.5px solid ${meta.ring}` }}
              >
                <span>{meta.emoji}</span>
                <span>{meta.badge}</span>
              </div>
              <h2 className="text-[28px] font-extrabold text-slate-800 mb-1 tracking-tight">
                {result.riskLabel} Risk
              </h2>
              <p className="text-slate-500 text-[14px] mb-5 leading-relaxed">{result.explanation}</p>

              {/* Trust score pill */}
              <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                <ShieldCheck size={16} className="text-blue-600" />
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Trust Score</div>
                  <div className="text-[18px] font-black text-slate-800 leading-tight">{result.trustScore} <span className="text-[13px] text-slate-400">/100</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Score breakdown ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.06)] p-7 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-blue-600" />
            <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-wide">Score Breakdown</h3>
          </div>
          <div className="space-y-5">
            {result.scoreBreakdown?.map((f, i) => (
              <FactorBar key={f.name} name={f.name} pct={f.pct} description={f.description} delay={0.3 + i * 0.08} />
            ))}
          </div>
        </motion.div>

        {/* ── Suggestions ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.06)] p-7 mb-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb size={18} className="text-amber-500" />
            <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-wide">Personalised Suggestions</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {result.suggestions?.map(s => (
              <div key={s} className="text-[13px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                💡 {s}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('plan-selection')}
            className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-[16px] flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all group"
          >
            View Recommended Plans
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
          </motion.button>

          <div className="flex items-center justify-center gap-2 text-[12px] text-slate-400 font-medium">
            <Lock size={12} />
            Your risk data is encrypted and shared only for policy generation
          </div>
        </motion.div>
      </main>
    </div>
  );
}
