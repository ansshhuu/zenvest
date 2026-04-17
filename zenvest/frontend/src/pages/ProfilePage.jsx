/**
 * ProfilePage.jsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Premium rider profile dashboard for Zenvest.
 * Data: fetchProfile() mock (swap with real API later)
 * Styles: Tailwind + subtle Framer Motion
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AppHeader from "../components/layout/AppHeader";

import {
  ShieldCheck,
  BadgeCheck,
  FileText,
  Download,
  RefreshCw,
  Pencil,
  ChevronRight,
  MapPin,
  Phone,
  Briefcase,
  Clock,
  Calendar,
  IdCard,
  Upload,
  Activity as ActivityIcon,
  Star,
} from "lucide-react";
import { fetchProfile } from "../data/mockProfile.js";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function formatINR(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return `₹${v.toLocaleString("en-IN")}`;
}

function formatDateShort(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getScoreTone(score) {
  if (score >= 85) return { label: "Excellent standing", color: "#16A34A", bg: "#F0FDF4", ring: "#22C55E" };
  if (score >= 70) return { label: "Good standing", color: "#2563EB", bg: "#EFF6FF", ring: "#3B82F6" };
  if (score >= 55) return { label: "Building trust", color: "#D97706", bg: "#FFFBEB", ring: "#F59E0B" };
  return { label: "Needs improvement", color: "#DC2626", bg: "#FEF2F2", ring: "#EF4444" };
}



function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div>
        {eyebrow && <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{eyebrow}</p>}
        <h2 className="text-[18px] sm:text-[20px] font-extrabold text-slate-900 tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function MiniStatCard({ label, value, tone = "default", icon: Icon }) {
  const tones = {
    default: "bg-white/10 border-white/15 text-white",
    green: "bg-green-400/15 border-green-400/20 text-green-200",
    blue: "bg-blue-300/15 border-blue-300/20 text-blue-100",
    purple: "bg-violet-300/15 border-violet-300/20 text-violet-100",
  };
  return (
    <div className={classNames("rounded-2xl border px-4 py-3 backdrop-blur-sm", tones[tone] ?? tones.default)}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</p>
          <p className="text-[18px] font-extrabold tracking-tight truncate">{value}</p>
        </div>
        {Icon ? (
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Icon size={16} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Badge({ children, variant = "default" }) {
  const map = {
    default: "bg-slate-50 text-slate-700 border-slate-200",
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={classNames("inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border", map[variant] ?? map.default)}>
      {children}
    </span>
  );
}

function ProfileHeroCard({ data, onEditProfile, onManageDocs, onViewPolicy, showPolicyBadges = true }) {
  const user = data?.user;
  const verification = data?.verification;
  const stats = data?.stats;
  const policy = data?.currentPolicy;

  const planName = policy?.planName ?? "No active plan";
  const isVerified = Boolean(verification?.aadhaarVerified) || verification?.kycStatus === "Verified";
  const isActivePolicy = policy?.status === "Active";

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-[26px] overflow-hidden border border-slate-100 shadow-[0_20px_60px_-14px_rgba(15,23,42,0.16)] bg-white"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#0EA5E9]" />
        <div className="absolute -top-24 -right-24 w-[340px] h-[340px] rounded-full bg-white/10 blur-[1px]" />
        <div className="absolute -bottom-24 -left-24 w-[340px] h-[340px] rounded-full bg-white/10 blur-[1px]" />

        <div className="relative p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center text-[18px] font-black shadow-sm">
                {user?.avatarInitial ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-widest text-white/70 mb-1">Rider Profile</p>
                <h1 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight leading-tight truncate">
                  {user?.fullName ?? "—"}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-[13px] font-semibold text-white/80">
                  <span className="inline-flex items-center gap-2">
                    <Phone size={14} className="text-white/70" />
                    {user?.phone ?? "—"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={14} className="text-white/70" />
                    {user?.city ?? "—"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={14} className="text-white/70" />
                    {planName}
                  </span>
                </div>

                {showPolicyBadges && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1.5 bg-white/12 border border-white/15 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                      <BadgeCheck size={14} className={classNames(isVerified ? "text-emerald-200" : "text-white/60")} />
                      {isVerified ? "Verified" : "Verification pending"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white/12 border border-white/15 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                      <span className={classNames("w-2 h-2 rounded-full", isActivePolicy ? "bg-green-300 animate-pulse" : "bg-white/40")} />
                      {isActivePolicy ? "Policy active" : "No active policy"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:justify-end">
              <button
                onClick={onEditProfile}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-black text-[13px] hover:bg-slate-100 transition-colors shadow-sm"
              >
                <Pencil size={14} />
                Edit profile
              </button>
              <button
                onClick={onManageDocs}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-black text-[13px] hover:bg-white/15 transition-colors"
              >
                <Upload size={14} />
                Documents
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <MiniStatCard
              label="Total payouts received"
              value={formatINR(stats?.totalReceived)}
              tone="green"
              icon={FileText}
            />
            <MiniStatCard
              label="Total claims"
              value={String(stats?.totalClaims ?? "—")}
              tone="blue"
              icon={ActivityIcon}
            />
            <MiniStatCard
              label="Trust score"
              value={String(stats?.trustScore ?? "—")}
              tone="purple"
              icon={Star}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={onViewPolicy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-black text-[13px] hover:bg-white/15 transition-colors"
            >
              View policy
              <ChevronRight size={14} />
            </button>
            <span className="text-[12px] font-semibold text-white/70">
              Your profile helps Zenvest personalize protection and payouts.
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function TrustRing({ score, size = 116, stroke = 10, color }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, Number(score) || 0));
  const dash = c - (pct / 100) * c;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#E2E8F0" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: dash }}
        transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function TrustScoreCard({ data, onUpdateWork }) {
  const score = Number(data?.stats?.trustScore ?? 0);
  const tone = getScoreTone(score);
  const label = data?.trust?.scoreLabel ?? tone.label;
  const tips = data?.trust?.tips ?? [];

  const explanation = useMemo(() => {
    if (score >= 85) return "Your payouts and renewals look stable — you’re eligible for better pricing and faster claims.";
    if (score >= 70) return "You’re in a healthy range. Keep renewals consistent to unlock faster settlements.";
    if (score >= 55) return "You’re improving — stabilize work patterns and keep documents updated to raise your score.";
    return "Let’s strengthen your profile. Renew on time and keep KYC updated for better coverage options.";
  }, [score]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.45 }}
      className="bg-white rounded-[22px] border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)] overflow-hidden"
    >
      <div className="p-6 sm:p-7">
        <SectionHeader
          eyebrow="Trust"
          title="Trust Score"
          action={
            <button
              onClick={onUpdateWork}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[12px] font-black text-slate-700 transition-colors"
            >
              <Pencil size={14} />
              Update work details
            </button>
          }
        />

        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full" style={{ background: `${tone.ring}18` }} />
            <TrustRing score={score} color={tone.ring} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[26px] font-extrabold text-slate-900 leading-none">{score}</p>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mt-1">out of 100</p>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={score >= 85 ? "success" : score >= 70 ? "info" : score >= 55 ? "warning" : "default"}>
                <span className="w-2 h-2 rounded-full" style={{ background: tone.ring }} />
                {label}
              </Badge>
              <Badge variant="default">
                Auto-updated
              </Badge>
            </div>

            <p className="mt-3 text-[13px] text-slate-600 font-medium leading-relaxed">{explanation}</p>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Tips to improve</p>
              <ul className="space-y-1.5">
                {tips.slice(0, 4).map((t) => (
                  <li key={t} className="text-[13px] text-slate-700 font-semibold flex items-start gap-2">
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 sm:hidden">
              <button
                onClick={onUpdateWork}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-black text-[13px] hover:bg-black transition-colors"
              >
                <Pencil size={14} />
                Update work details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function KeyValuePill({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_14px_-10px_rgba(15,23,42,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            {Icon ? <Icon size={14} className="text-slate-400" /> : null}
            {label}
          </p>
          <p className={classNames("text-[15px] font-extrabold text-slate-900 truncate", mono && "font-mono text-[13px]")}>
            {value ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function WorkProfileCard({ data, onUpdate }) {
  const wp = data?.workProfile;

  const items = [
    { icon: Briefcase, label: "Platform", value: wp?.platform },
    { icon: MapPin, label: "City", value: wp?.city },
    { icon: Clock, label: "Shift", value: wp?.shift },
    { icon: Calendar, label: "Experience", value: wp?.experience },
    { icon: Clock, label: "Hours per day", value: wp?.hoursPerDay != null ? `${wp.hoursPerDay} hrs` : "—" },
    { icon: Clock, label: "Weekly hours", value: wp?.weeklyHours != null ? `${wp.weeklyHours} hrs` : "—" },
    { icon: FileText, label: "Weekly earnings", value: wp?.earnings != null ? formatINR(wp.earnings) : "—" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.45 }}
      className="bg-white rounded-[22px] border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)]"
    >
      <div className="p-6 sm:p-7">
        <SectionHeader
          eyebrow="Work"
          title="Rider Work Profile"
          action={
            <button
              onClick={onUpdate}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[12px] font-black text-slate-700 transition-colors"
            >
              <Pencil size={14} />
              Update
            </button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((it) => (
            <KeyValuePill key={it.label} icon={it.icon} label={it.label} value={it.value} />
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={16} className="text-blue-700" />
          </div>
          <div>
            <p className="text-[13px] font-extrabold text-blue-900">Why we ask</p>
            <p className="text-[12px] font-semibold text-blue-800/80 leading-relaxed mt-0.5">
              Shift timing and weekly load help Zenvest tune triggers and premium fairness for riders.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function CurrentPolicyCard({ data, onView, onDownload, onRenew }) {
  const policy = data?.currentPolicy;

  if (!policy) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.45 }}
        className="bg-white rounded-[22px] border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)]"
      >
        <div className="p-6 sm:p-7">
          <SectionHeader eyebrow="Protection" title="Active Protection" />
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <p className="text-[16px] font-extrabold text-slate-800 mb-1">No active policy</p>
            <p className="text-[13px] text-slate-500 font-medium mb-5">
              Pick a plan to unlock triggers, auto-payouts, and claims cover.
            </p>
            <button
              onClick={onRenew}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-black text-[13px] hover:bg-black transition-colors"
            >
              Choose a plan
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </motion.section>
    );
  }

  const statusVariant = policy.status === "Active" ? "success" : "default";

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.45 }}
      className="bg-white rounded-[22px] border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)] overflow-hidden"
    >
      <div className="p-6 sm:p-7">
        <SectionHeader
          eyebrow="Protection"
          title="Active Protection"
          action={<Badge variant={statusVariant}>{policy.status}</Badge>}
        />

        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
              <p className="text-[22px] font-extrabold text-slate-900 tracking-tight">{policy.planName}</p>
              <p className="text-[13px] text-slate-600 font-semibold mt-1">
                Coverage: <span className="font-extrabold">{formatINR(policy.coverageAmount)}</span>
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly premium</p>
              <p className="text-[20px] font-extrabold text-slate-900">{formatINR(policy.weeklyPremium)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <KeyValuePill icon={Calendar} label="Renewal date" value={formatDateShort(policy.renewDate)} />
            <KeyValuePill icon={IdCard} label="Policy ID" value={policy.policyId} mono />
            <KeyValuePill icon={MapPin} label="Zone covered" value={policy.zone} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onView}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-black text-[13px] hover:bg-black transition-colors"
          >
            View details
            <ChevronRight size={14} />
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-black text-[13px] hover:bg-slate-50 transition-colors"
          >
            <Download size={14} />
            Download policy
          </button>
          <button
            onClick={onRenew}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-black text-[13px] hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={14} />
            Renew plan
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function VerificationStatusCard({ data, onManageDocs }) {
  const v = data?.verification;
  const aadhaar = Boolean(v?.aadhaarVerified);
  const kyc = v?.kycStatus ?? (aadhaar ? "Verified" : "Pending");
  const updated = v?.lastUpdated;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16, duration: 0.45 }}
      className="bg-white rounded-[22px] border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)]"
    >
      <div className="p-6 sm:p-7">
        <SectionHeader
          eyebrow="Verification"
          title="Documents & KYC"
          action={
            <button
              onClick={onManageDocs}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[12px] font-black text-slate-700 transition-colors"
            >
              <Upload size={14} />
              Upload / replace
            </button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KeyValuePill icon={BadgeCheck} label="Aadhaar" value={aadhaar ? "Verified" : "Pending"} />
          <KeyValuePill icon={ShieldCheck} label="KYC status" value={kyc} />
          <KeyValuePill icon={Calendar} label="Last updated" value={formatDateShort(updated)} />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900/5 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={16} className="text-slate-700" />
          </div>
          <div>
            <p className="text-[13px] font-extrabold text-slate-900">Faster claims with verified KYC</p>
            <p className="text-[12px] font-semibold text-slate-600 leading-relaxed mt-0.5">
              Keep documents current to reduce delays and improve trust score weight.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ActivityCard({ data, onGoToClaims }) {
  const activity = data?.activity ?? [];

  const iconFor = (type) => {
    if (type === "policy") return "🛡️";
    if (type === "claim") return "📋";
    if (type === "payout") return "💸";
    return "✨";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.45 }}
      className="bg-white rounded-[22px] border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)] overflow-hidden"
    >
      <div className="p-6 sm:p-7">
        <SectionHeader
          eyebrow="Activity"
          title="Claims & Events"
          action={
            <button
              onClick={onGoToClaims}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[12px] font-black text-slate-700 transition-colors"
            >
              <FileText size={14} />
              Open claims
            </button>
          }
        />

        <div className="rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
          {activity.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-[15px] font-extrabold text-slate-800 mb-1">No activity yet</p>
              <p className="text-[13px] text-slate-500 font-medium">
                Policy renewals, payouts and claim updates will show up here.
              </p>
            </div>
          ) : (
            activity.map((a) => (
              <div key={a.id} className="px-5 py-4 hover:bg-slate-50/70 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[18px] flex-shrink-0">
                  {iconFor(a.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-extrabold text-slate-900 truncate">{a.title}</p>
                  <p className="text-[12px] text-slate-600 font-medium truncate">{a.description}</p>
                  {(a.amount || a.status) && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {a.amount ? <Badge variant="success">{a.amount}</Badge> : null}
                      {a.status ? <Badge variant="default">{String(a.status).replace(/_/g, " ")}</Badge> : null}
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-black text-slate-400 flex-shrink-0">{a.time ?? ""}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.section>
  );
}

function SkeletonCard({ className }) {
  return (
    <div
      className={classNames(
        "bg-white rounded-[22px] border border-slate-100 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.12)] overflow-hidden",
        className
      )}
    >
      <div className="p-6 sm:p-7 space-y-4">
        <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="h-24 w-full bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export default function ProfilePage({ navigate, showToast, appState }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProfile(appState)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.message ?? "Failed to load profile");
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const avatarInitial = data?.user?.avatarInitial ?? "?";

  const actions = {
    editProfile: () => showToast("Edit profile flow coming soon", "info"),
    updateWork: () => showToast("Update work details flow coming soon", "info"),
    manageDocs: () => showToast("Document management coming soon", "info"),
    viewPolicy: () => (data?.currentPolicy ? showToast("Policy details view coming soon", "info") : navigate("plan-selection")),
    downloadPolicy: () => showToast("Policy PDF download coming soon", "info"),
    renewPolicy: () => navigate("plan-selection"),
    openClaims: () => navigate("claims"),
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-3">Profile unavailable</h2>
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <AppHeader navigate={navigate} avatarLetter={avatarInitial} activePage="profile" />


      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-7 pb-24">
        {loading ? (
          <div className="space-y-5">
            <SkeletonCard className="rounded-[26px]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonCard />
          </div>
        ) : (
          <div className="space-y-5">
            <ProfileHeroCard
              data={data}
              onEditProfile={actions.editProfile}
              onManageDocs={actions.manageDocs}
              onViewPolicy={actions.viewPolicy}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TrustScoreCard data={data} onUpdateWork={actions.updateWork} />
              <WorkProfileCard data={data} onUpdate={actions.updateWork} />
            </div>

            <CurrentPolicyCard
              data={data}
              onView={actions.viewPolicy}
              onDownload={actions.downloadPolicy}
              onRenew={actions.renewPolicy}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <VerificationStatusCard data={data} onManageDocs={actions.manageDocs} />
              <ActivityCard data={data} onGoToClaims={actions.openClaims} />
            </div>
          </div>
        )}
      </div>


    </div>
  );
}

