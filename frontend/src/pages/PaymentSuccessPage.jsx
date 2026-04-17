/**
 * PaymentSuccessPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shown after successful payment completion.
 * Displays: transaction ID, policy ID, plan summary, coverage, and next steps.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, ArrowRight, Download, Share2 } from 'lucide-react';

function ConfettiDot({ style }) {
  return (
    <motion.div
      className="absolute w-2.5 h-2.5 rounded-full"
      style={style}
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 240, opacity: 0, rotate: 360 }}
      transition={{ duration: 1.8 + Math.random(), ease: 'easeOut', delay: Math.random() * 0.4 }}
    />
  );
}

const CONFETTI_COLORS = ['#3B82F6','#10B981','#F59E0B','#8B5CF6','#EF4444','#EC4899'];

export default function PaymentSuccessPage({ txn, plan, total, navigate }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(t);
  }, []);

  const confettiDots = Array.from({ length: 24 }, (_, i) => ({
    left:  `${5 + Math.random() * 90}%`,
    top:   `${Math.random() * 30}%`,
    backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  const policyId   = txn?.policyId ?? 'ZV-XXXXX';
  const txnId      = txn?.transactionId ?? 'TXN-XXXXX';
  const renewDate  = new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiDots.map((style, i) => (
            <ConfettiDot key={i} style={style} />
          ))}
        </div>
      )}

      <div className="w-full max-w-md relative z-10">

        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-[0_16px_48px_rgba(16,185,129,0.4)]">
              <Check size={44} className="text-white" strokeWidth={3} />
            </div>
            {/* Ring */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute inset-0 rounded-full border-4 border-green-400"
            />
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="text-center mb-8"
        >
          <h1 className="text-[30px] font-extrabold text-slate-800 mb-2 tracking-tight">Payment Successful!</h1>
          <p className="text-slate-500 text-[15px] leading-relaxed">
            Your policy is now active. Stay covered every week automatically.
          </p>
        </motion.div>

        {/* Policy card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-slate-900 text-white rounded-[22px] p-6 mb-5 relative overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
        >
          {/* Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-400/25 rounded-full blur-[50px]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1">Active Policy</p>
                <h3 className="text-[20px] font-extrabold">{plan?.name ?? 'Your Plan'}</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-bold text-green-400">ACTIVE</span>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Policy ID',   value: policyId, mono: true },
                { label: 'Coverage',    value: plan?.coverage ?? '—' },
                { label: 'Weekly Prem.', value: `₹${total ?? plan?.weeklyPremium}` },
                { label: 'Renews',      value: renewDate },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
                  <p className={`text-[14px] font-bold text-white ${mono ? 'font-mono text-[12px]' : ''}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transaction info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white border border-slate-200 rounded-[18px] p-5 mb-5 shadow-sm"
        >
          <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-3">Transaction Details</h4>
          <div className="space-y-2.5">
            {[
              { label: 'Transaction ID', value: txnId },
              { label: 'Amount Paid',    value: `₹${total}` },
              { label: 'Date & Time',    value: new Date(txn?.timestamp ?? Date.now()).toLocaleString('en-IN') },
              { label: 'Status',         value: '✅ Confirmed' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-[13px]">
                <span className="text-slate-500 font-medium">{label}</span>
                <span className="text-slate-800 font-bold">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
          className="bg-blue-50 border border-blue-100 rounded-[18px] p-5 mb-6"
        >
          <h4 className="text-[12px] font-black text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <ShieldCheck size={14} /> What Happens Next
          </h4>
          <ul className="space-y-2.5">
            {[
              'Policy document sent to your registered mobile',
              'Weather triggers go live within 15 minutes',
              'Auto-renewal every Sunday — no action needed',
              'Claims can be filed instantly from your dashboard',
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-blue-700 font-medium">
                <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('dashboard')}
            className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-[15px] flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all group"
          >
            Go to Dashboard
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              <Download size={15} /> Download PDF
            </button>
            <button className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              <Share2 size={15} /> Share
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
