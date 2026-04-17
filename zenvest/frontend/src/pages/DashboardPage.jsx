/**
 * DashboardPage.jsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Full-featured, polished Zenvest dashboard for delivery partners.
 *
 * Sections:
 *   1.  Top navigation bar (sticky, glassmorphism)
 *   2.  Greeting header (dynamic, time-aware)
 *   3.  Active policy hero card (deep-blue gradient, premium)
 *   4.  Stats grid (4 cards: claims, weeks active, trust score, risk label)
 *   5.  Quick actions row
 *   6.  Alert banner (weather / trigger alerts)
 *   7.  Recent activity feed
 *   8.  Coverage summary + renewal reminder
 *
 * Data: fetched from fetchDashboard() (mock API → real endpoint later)
 * Styles: 100% Tailwind — no dependency on legacy CSS classes
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Bell, ChevronRight, TrendingUp,
  Zap, FileText, User, HelpCircle, AlertTriangle,
  CheckCircle2, CreditCard, Star, Calendar, BarChart2,
} from 'lucide-react';
import { fetchDashboard } from '../data/mockDashboard.js';
import { getGreeting } from '../utils/helpers.js';
import AppHeader from '../components/layout/AppHeader';
import RotatingText from '../components/animations/RotatingText';
import ScrollFloat from '../components/animations/ScrollFloat';


// ── Icon map for stat cards ────────────────────────────────────────────────────
const STAT_ICONS = {
  rupee:    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  star:     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />,
  shield:   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};

const QA_ICONS = {
  claim:    FileText,
  triggers: Zap,
  profile:  User,
  help:     HelpCircle,
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Skeleton loader ─────────────────────────────────────────────────────────
function SkeletonBlock({ className }) {
  return (
    <div
      className={`bg-slate-200 rounded-xl animate-pulse ${className}`}
      style={{ backgroundImage: 'linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%)', backgroundSize: '200%', animation: 'shimmer 1.4s infinite' }}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24 space-y-6">
      <SkeletonBlock className="h-8 w-48" />
      <SkeletonBlock className="h-[180px] w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <SkeletonBlock key={i} className="h-28" />)}
      </div>
      <SkeletonBlock className="h-20 w-full" />
      <SkeletonBlock className="h-48 w-full" />
    </div>
  );
}



// ── Greeting ────────────────────────────────────────────────────────────────
function GreetingHeader({ firstName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">{getGreeting()}, {firstName ?? 'Rider'}</p>
        <h1 className="text-[28px] sm:text-[36px] font-black text-slate-900 tracking-tighter leading-[1.1] flex flex-wrap items-center gap-x-2">
          Smart protection for 
          <RotatingText 
            texts={["Delivery Partners", "Gig Workers", "Your Income"]} 
            className="text-blue-600"
            duration={2.8}
          />
        </h1>
        <ScrollFloat delay={0.2}>
          <p className="text-slate-500 text-[15px] sm:text-[17px] font-medium leading-relaxed max-w-2xl mt-1">
            Real-time protection powered by AI signals. Weather. AQI. Risk. Covered.
          </p>
        </ScrollFloat>
      </div>
    </motion.div>
  );
}


// ── Active Policy Hero Card ─────────────────────────────────────────────────
function ActivePolicyCard({ policy, navigate }) {
  if (!policy) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[22px] p-7 mb-6 relative overflow-hidden shadow-[0_20px_60px_-10px_rgba(15,23,42,0.25)] text-center"
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]" />
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🛡️</div>
        <h3 className="text-white text-[20px] font-extrabold mb-2">No active policy yet</h3>
        <p className="text-slate-400 text-[14px] mb-6 max-w-[280px] mx-auto leading-relaxed">
          Complete your onboarding to activate income protection.
        </p>
        <button
          onClick={() => navigate('register')}
          className="bg-white text-slate-900 font-black text-[14px] px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Get Protected →
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#1D4ED8] rounded-[22px] p-6 sm:p-8 mb-6 relative overflow-hidden shadow-[0_20px_60px_-10px_rgba(30,58,138,0.45)]"
    >
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-12 -left-8   w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-8 w-24 h-24 bg-blue-300/10 rounded-full pointer-events-none" />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-blue-300 text-[11px] font-black uppercase tracking-widest mb-1.5">Active Policy</p>
            <h2 className="text-white text-[26px] sm:text-[30px] font-extrabold tracking-tight leading-none mb-1">
              {policy.planName}
            </h2>
            <p className="text-blue-200 text-[14px] font-medium">{policy.coverageAmount} coverage</p>
          </div>
          <div className="flex items-center gap-2 bg-green-400/20 border border-green-400/30 rounded-full px-3 py-1.5 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-300 text-[11px] font-black uppercase tracking-wider">Active</span>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Weekly Premium', value: `₹${policy.weeklyPremium}` },
            { label: 'Renews',          value: policy.renewDate },
            { label: 'Zone',            value: policy.zone },
            { label: 'Policy ID',       value: policy.policyId, mono: true },
          ].map(m => (
            <div key={m.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <p className="text-blue-300 text-[10px] font-black uppercase tracking-wider mb-1">{m.label}</p>
              <p className={`text-white font-bold leading-tight ${m.mono ? 'text-[12px] font-mono' : 'text-[15px]'}`}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <button
          onClick={() => navigate('triggers')}
          className="mt-5 flex items-center gap-1.5 text-blue-200 hover:text-white text-[13px] font-bold transition-colors group"
        >
          View triggers &amp; payouts
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06 }}
      whileHover={{ y: -3, boxShadow: '0 12px 30px -8px rgba(15,23,42,0.12)' }}
      className="bg-white rounded-[18px] border border-slate-100 p-5 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] cursor-default transition-all"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: stat.bgColor }}>
        <svg width="20" height="20" viewBox="0 0 24 24" stroke={stat.color} strokeWidth="2" fill="none">
          {STAT_ICONS[stat.icon]}
        </svg>
      </div>
      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-1">{stat.label}</p>
      <p className="text-[26px] font-extrabold text-slate-900 leading-none mb-1.5">{stat.value}</p>
      <p className="text-[12px] text-slate-400 font-medium">{stat.subtext}</p>
    </motion.div>
  );
}

// ── Quick Actions ────────────────────────────────────────────────────────────
function QuickActions({ actions, navigate, showToast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mb-6"
    >
      <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, i) => {
          const Icon = QA_ICONS[action.id] ?? HelpCircle;
          return (
            <motion.button
              key={action.id}
              whileHover={{ y: -2, boxShadow: '0 8px 24px -6px rgba(15,23,42,0.12)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => action.page ? navigate(action.page) : showToast('Coming soon!', 'info')}
              className="bg-white border border-slate-100 rounded-[16px] p-4 flex flex-col items-center gap-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-blue-200 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors flex items-center justify-center">
                <Icon size={20} className="text-blue-600" strokeWidth={2} />
              </div>
              <span className="text-[13px] font-bold text-slate-700">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Alert Banner ─────────────────────────────────────────────────────────────
function AlertsSection({ alerts }) {
  if (!alerts?.length) return null;

  const COLOR_MAP = {
    warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', icon: AlertTriangle, iconColor: '#D97706' },
    info:    { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', icon: Bell,           iconColor: '#2563EB' },
    success: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', icon: CheckCircle2,   iconColor: '#16A34A' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-6 space-y-3"
    >
      <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-widest mb-4">Alerts</h3>
      {alerts.map(alert => {
        const style  = COLOR_MAP[alert.type] ?? COLOR_MAP.info;
        const Icon   = style.icon;
        return (
          <div
            key={alert.id}
            className="flex items-start gap-4 p-4 rounded-[16px] border"
            style={{ backgroundColor: style.bg, borderColor: style.border }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: style.iconColor + '18' }}>
              <Icon size={18} style={{ color: style.iconColor }} />
            </div>
            <div>
              <p className="text-[14px] font-bold" style={{ color: style.text }}>{alert.title}</p>
              <p className="text-[13px] font-medium mt-0.5" style={{ color: style.text + 'CC' }}>{alert.description}</p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

// ── Recent Activity ──────────────────────────────────────────────────────────
function RecentActivity({ activity }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.58 }}
      className="mb-6"
    >
      <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-widest mb-4">Recent Activity</h3>
      <div className="bg-white rounded-[18px] border border-slate-100 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] divide-y divide-slate-50 overflow-hidden">
        {!activity?.length ? (
          <div className="flex flex-col items-center py-12 text-center px-6">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-[15px] font-bold text-slate-700 mb-2">No activity yet</p>
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-[240px]">
              Policy payouts, premium records, and claim activity will appear here.
            </p>
          </div>
        ) : (
          activity.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.06 }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[20px] flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-slate-800 truncate">{item.title}</p>
                <p className="text-[12px] text-slate-500 font-medium truncate">{item.description}</p>
              </div>
              <span className="text-[11px] font-bold text-slate-400 flex-shrink-0">{item.time}</span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ── Coverage summary + renewal reminder sidebar ────────────────────────────
function CoverageSummary({ policy, navigate }) {
  if (!policy) return null;

  const TRIGGERS = [
    { icon: '🌧️', label: 'Rain trigger',  status: 'Active',      color: '#16A34A' },
    { icon: '🌫️', label: 'AQI trigger',   status: 'Monitoring',  color: '#D97706' },
    { icon: '🌡️', label: 'Heat trigger',  status: 'Inactive',    color: '#94A3B8' },
    { icon: '💨',  label: 'Wind trigger',  status: 'Inactive',    color: '#94A3B8' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
    >
      <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-widest mb-4">Trigger Status</h3>
      <div className="bg-white rounded-[18px] border border-slate-100 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.06)] p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={15} className="text-yellow-500" />
          <span className="text-[13px] font-black text-slate-700 uppercase tracking-wide">Parametric Triggers</span>
        </div>
        <div className="space-y-3">
          {TRIGGERS.map(t => (
            <div key={t.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                <span>{t.icon}</span> {t.label}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-[12px] font-bold" style={{ color: t.color }}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('triggers')}
          className="w-full mt-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[13px] font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
        >
          View all triggers <ChevronRight size={14} />
        </button>
      </div>

      {/* Renewal reminder */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[18px] p-5 text-white relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <Calendar size={15} className="text-blue-200" />
          <span className="text-[11px] font-black text-blue-200 uppercase tracking-wider">Next Renewal</span>
        </div>
        <p className="text-white font-extrabold text-[16px] mb-1 relative z-10">{policy.renewDate}</p>
        <p className="text-blue-200 text-[12px] font-medium relative z-10">Auto-renewal enabled · ₹{policy.weeklyPremium}/week</p>
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between relative z-10">
          <span className="text-blue-200 text-[12px] font-semibold">Policy: {policy.policyId}</span>
          <ShieldCheck size={16} className="text-blue-200" />
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage({ navigate, showToast, appState }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchDashboard(appState)
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const avatarInitial = data?.user?.avatarInitial ?? '?';

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-3">Dashboard unavailable</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans">
      <AppHeader navigate={navigate} avatarLetter={avatarInitial} activePage="dashboard" />

      {/* Shimmer keyframe (injected globally once) */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24">

          {/* ── Greeting ────────────────────────────────────────────── */}
          <GreetingHeader firstName={data?.user?.firstName} />

          {/* ── Two-column layout on lg ──────────────────────────────── */}
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">

            {/* LEFT COLUMN */}
            <div>
              {/* Hero policy card */}
              <ActivePolicyCard policy={data?.activePolicy} navigate={navigate} />

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
                {data?.stats?.map((stat, i) => (
                  <StatCard key={stat.id} stat={stat} index={i} />
                ))}
              </div>

              {/* Quick actions */}
              <QuickActions actions={data?.quickActions ?? []} navigate={navigate} showToast={showToast} />

              {/* Alerts */}
              <AlertsSection alerts={data?.alerts} />

              {/* Recent activity */}
              <RecentActivity activity={data?.recentActivity} />
            </div>

            {/* RIGHT COLUMN (sidebar on lg) */}
            <div className="mt-0 lg:mt-0">
              <CoverageSummary policy={data?.activePolicy} navigate={navigate} />
            </div>
          </div>

          {/* ── Bottom trust strip ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-6 mt-4 border-t border-slate-200"
          >
            {[
              { icon: <ShieldCheck size={13} />, label: 'IRDAI Regulated' },
              { icon: <BarChart2   size={13} />, label: 'AI-Powered Scoring' },
              { icon: <Zap         size={13} />, label: 'Auto-Payouts Active' },
              { icon: <Star        size={13} />, label: '24/7 Support' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400">
                {item.icon} {item.label}
              </div>
            ))}
          </motion.div>
        </div>
      )}

    </div>
  );
}

