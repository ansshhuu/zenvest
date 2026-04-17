/**
 * PlanSelectionPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders available plans from the API response (appState.analysisResult).
 * Highlights the recommendedPlanId. Passes selected plan to PaymentPage.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';

const RISK_COLOR = {
  Low: '#16A34A', Medium: '#D97706', High: '#DC2626', 'Very High': '#9333EA',
};

function PlanCard({ plan, selected, onSelect, index }) {
  const isRecommended = plan.recommended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={() => onSelect(plan.id)}
      className={`
        relative cursor-pointer rounded-[20px] border-2 p-6 transition-all duration-200
        ${selected
          ? 'border-blue-500 bg-white shadow-[0_8px_30px_rgba(37,99,235,0.18)]'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
        }
        ${isRecommended ? 'pt-9' : ''}
      `}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
          ⭐ Recommended for you
        </div>
      )}

      {/* Selection indicator */}
      <div className={`
        absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
        ${selected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}
      `}>
        {selected && <Check size={13} className="text-white" strokeWidth={4} />}
      </div>

      {/* Plan header */}
      <div className="mb-5">
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{plan.badge}</div>
        <h3 className="text-[22px] font-extrabold text-slate-800 tracking-tight">{plan.name}</h3>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-[28px] font-black text-slate-900">₹{plan.weeklyPremium}</span>
          <span className="text-slate-400 text-[14px] font-semibold">/week</span>
        </div>
        <div className="text-[13px] text-slate-500 mt-1 font-medium">Coverage: <strong className="text-slate-700">{plan.coverage}</strong></div>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-6">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check size={10} className="text-green-600" strokeWidth={4} />
            </div>
            {f}
          </li>
        ))}
      </ul>

      {/* Trigger payouts */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
        <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2.5">
          <Zap size={11} className="inline mr-1 text-yellow-500" />
          Auto-payout per trigger
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {Object.entries(plan.triggerPayouts).map(([type, amount]) => (
            <div key={type} className="text-[12px] text-slate-600 font-semibold flex items-center gap-1.5">
              <span>{type === 'rain' ? '🌧' : type === 'aqi' ? '🌫' : type === 'heat' ? '🌡' : '💨'}</span>
              ₹{amount}
            </div>
          ))}
        </div>
      </div>

      {/* Select button */}
      <button className={`
        w-full mt-4 py-3 rounded-xl font-bold text-[14px] transition-all
        ${selected
          ? 'bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }
      `}>
        {selected ? 'Selected ✓' : 'Select Plan'}
      </button>
    </motion.div>
  );
}

export default function PlanSelectionPage({ navigate, appState, setAppState }) {
  const result = appState.analysisResult;
  const plans  = result?.availablePlans ?? [];
  const [selectedId, setSelectedId] = useState(result?.recommendedPlanId ?? plans[0]?.id ?? null);

  if (!result) { navigate('register'); return null; }

  const selectedPlan = plans.find(p => p.id === selectedId);
  const riskMeta = { color: RISK_COLOR[result.riskLabel] ?? '#D97706' };

  const handleContinue = () => {
    if (!selectedPlan) return;
    setAppState(s => ({ ...s, selectedPlan }));
    navigate('payment');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

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
        <button onClick={() => navigate('risk-result')} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          ← Back to Risk Report
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-10 pb-24">

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Step 2 of 3 · Plan Selection</div>
          <h1 className="text-[30px] font-extrabold text-slate-800 tracking-tight mb-3">Choose your coverage</h1>
          <p className="text-slate-500 text-[15px] max-w-md mx-auto leading-relaxed">
            Plans personalised to your{' '}
            <strong style={{ color: riskMeta.color }}>{result.riskLabel} Risk</strong> profile.
            Score: <strong>{result.riskScore}/100</strong>
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className={`grid gap-5 mb-10 ${plans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedId === plan.id}
              onSelect={setSelectedId}
              index={i}
            />
          ))}
        </div>

        {/* CTA bar */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.10)] flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Selected</p>
              <p className="text-[18px] font-black text-slate-800">{selectedPlan.name}</p>
              <p className="text-[13px] text-slate-500 font-medium">₹{selectedPlan.weeklyPremium}/week · {selectedPlan.coverage} coverage</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
              onClick={handleContinue}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(0,0,0,0.12)] transition-all group"
            >
              Proceed to Payment
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}

        <div className="flex items-center justify-center gap-2 mt-5 text-[12px] text-slate-400 font-medium">
          <ShieldCheck size={13} className="text-blue-500" />
          IRDAI regulated · Premiums include GST · Cancel anytime
        </div>
      </main>
    </div>
  );
}
