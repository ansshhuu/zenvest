// ─── PLANS CONFIG ──────────────────────────────────────────────────────────────
// Source of truth for all plan data. Replace with API call to /api/plans
export const PLANS = {
  starter: {
    name: "Starter Shield",
    base: 99,
    coverage: "₹50,000",
    coverageNum: 50000,
    triggerPayouts: { rain: 200, aqi: 150, heat: 150, wind: 150 },
  },
  smart: {
    name: "Smart Shield",
    base: 149,
    coverage: "₹1,00,000",
    coverageNum: 100000,
    triggerPayouts: { rain: 350, aqi: 250, heat: 200, wind: 300 },
  },
  pro: {
    name: "Pro Shield",
    base: 249,
    coverage: "₹2,00,000",
    coverageNum: 200000,
    triggerPayouts: { rain: 500, aqi: 400, heat: 350, wind: 450 },
  },
};

// ─── CITY RISK MAPPING ─────────────────────────────────────────────────────────
// Replace with API call to /api/city-risk or ML model endpoint
export const CITY_RISK = {
  Mumbai: "high", Delhi: "medium", Bengaluru: "high", Hyderabad: "medium",
  Chennai: "low", Kolkata: "medium", Pune: "low", Ahmedabad: "low",
  Jaipur: "medium", Surat: "low", Lucknow: "medium", Kanpur: "medium",
  Nagpur: "medium", Indore: "low", Thane: "high", Bhopal: "low",
  Visakhapatnam: "medium", Patna: "high", Vadodara: "low", Ghaziabad: "high",
};

export const CITIES = Object.keys(CITY_RISK);

// ─── DEMO VIDEO ────────────────────────────────────────────────────────────────
export const DEMO_YOUTUBE_ID = "l7bX-58E-7g";

// ─── HOME PAGE — FEATURES GRID ─────────────────────────────────────────────────
// Replace with CMS or API call to /api/features
export const FEATURES = [
  {
    title: "Parametric Auto-Payouts",
    color: "blue",
    desc: "Rain over 25mm, AQI above 300, temperature over 42°C — triggers auto-credit to your account. Zero claims process.",
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" stroke="var(--blue)" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  {
    title: "AI Risk Profiling",
    color: "purple",
    desc: "Our model analyses your zone, shift timing, experience, and traffic patterns to calculate your personalised risk score.",
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" stroke="var(--purple)" stroke-width="2" fill="none"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/></svg>`,
  },
  {
    title: "Aadhaar-Verified Trust Score",
    color: "green",
    desc: "Build your Trust Score over time. Higher trust = lower premiums, higher coverage limits, faster claims.",
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" stroke="var(--success)" stroke-width="2" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  },
  {
    title: "Weekly Micro-Premiums",
    color: "amber",
    desc: "Pay as little as ₹99/week — less than a coffee. Renew every Sunday. Cancel anytime. No lock-in period.",
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" stroke="var(--warning)" stroke-width="2" fill="none"><path d="M12 22V12m0 0L6 6m6 6l6-6"/><circle cx="12" cy="4" r="2"/><path d="M4 20h16"/></svg>`,
  },
  {
    title: "Live Weather Monitoring",
    color: "red",
    desc: "Real-time tracking of AQI, rainfall, temperature, and wind across your delivery zone. 24/7 automated monitoring.",
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" stroke="var(--error)" stroke-width="2" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  },
  {
    title: "Instant Digital Claims",
    color: "blue",
    desc: "Manual claims processed in under 4 hours. Upload photo proof, get approval on WhatsApp, money in 24h.",
    iconSvg: `<svg width="24" height="24" viewBox="0 0 24 24" stroke="var(--blue)" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  },
];

// ─── HOME PAGE — HOW IT WORKS ──────────────────────────────────────────────────
export const STEPS_HOW = [
  { title: "Sign Up", desc: "Enter your mobile number and verify with OTP. Quick Aadhaar verification for identity proof." },
  { title: "AI Profiling", desc: "Our engine analyses your work profile, zone risk, shift hours, and experience to compute your risk score." },
  { title: "Pick a Plan", desc: "Choose from Starter, Smart, or Pro. Premium calculated transparently based on your risk profile." },
  { title: "Stay Protected", desc: "Ride confidently. Auto-payouts activate on weather triggers. Claims settled in hours, not weeks." },
];

// ─── HOME PAGE — PLAN PREVIEWS ─────────────────────────────────────────────────
export const PLAN_PREVIEWS = [
  { key: "starter", name: "STARTER", price: 99, coverage: "₹50,000", features: ["Accident cover", "Basic hospitalisation", "24/7 helpline"] },
  { key: "smart", name: "SMART", price: 149, coverage: "₹1,00,000", featured: true, features: ["Everything in Starter", "Parametric weather cover", "Equipment cover", "Rain auto-payout"] },
  { key: "pro", name: "PRO", price: 249, coverage: "₹2,00,000", features: ["Everything in Smart", "Critical illness cover", "Income protection", "Priority claims"] },
];

// ─── HOME PAGE — FOOTER LINKS ──────────────────────────────────────────────────
export const FOOTER_LINKS = [
  { title: "Product", links: ["Features", "Plans", "How it works", "Triggers"] },
  { title: "Company", links: ["About us", "Blog", "Careers", "Press"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "IRDAI Registration", "Grievances"] },
];

// ─── DASHBOARD — QUICK ACTIONS ─────────────────────────────────────────────────
export const QUICK_ACTIONS = [
  { label: "Triggers", page: "triggers", bg: "#EFF6FF", iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" stroke="var(--blue)" stroke-width="2" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
  { label: "Claims", page: "claims", bg: "var(--success-light)", iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" stroke="var(--success)" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
  { label: "Profile", page: "profile", bg: "var(--purple-light)", iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" stroke="var(--purple)" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
  { label: "Help", toast: "Help centre opening soon...", bg: "var(--warning-light)", iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" stroke="var(--warning)" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` },
];

// ─── PROFILE PAGE — NOTIFICATION SETTINGS ─────────────────────────────────────
export const NOTIFICATION_SETTINGS = [
  { key: "weather", label: "Weather Alerts", desc: "Get notified before triggers activate" },
  { key: "payout", label: "Payout Notifications", desc: "Instant SMS + app push when paid" },
  { key: "renewal", label: "Renewal Reminders", desc: "Remind 2 days before renewal" },
  { key: "marketing", label: "Marketing Messages", desc: "Product updates and offers" },
];

// ─── ADMIN PAGE DATA ───────────────────────────────────────────────────────────
// Replace with API call to /api/admin/stats
export const ADMIN_STATS = [
  { label: "Active Policies", value: "12,418", trend: "↑ +324 this week", trendColor: "var(--success)" },
  { label: "Premiums Collected", value: "₹18.5L", trend: "↑ +12% MoM", trendColor: "var(--success)" },
  { label: "Total Payouts", value: "₹2.1 Cr", trend: "All-time", trendColor: "var(--text-muted)" },
  { label: "Fraud Alerts", value: "2", trend: "⚠ Requires action", trendColor: "var(--error)" },
];

export const ADMIN_ZONES = [
  { name: "Mumbai", level: "HIGH", bg: "#FEE2E2", color: "#991B1B" },
  { name: "Delhi", level: "MED", bg: "#FEF3C7", color: "#92400E" },
  { name: "Bengaluru", level: "HIGH", bg: "#FEE2E2", color: "#991B1B" },
  { name: "Pune", level: "LOW", bg: "#DCFCE7", color: "#166534" },
  { name: "Hyderabad", level: "MED", bg: "#FEF3C7", color: "#92400E" },
  { name: "Chennai", level: "LOW", bg: "#DCFCE7", color: "#166534" },
  { name: "Kolkata", level: "MED", bg: "#FEF3C7", color: "#92400E" },
  { name: "Ahmedabad", level: "LOW", bg: "#DCFCE7", color: "#166534" },
  { name: "Noida", level: "HIGH", bg: "#FEE2E2", color: "#991B1B" },
  { name: "Jaipur", level: "MED", bg: "#FEF3C7", color: "#92400E" },
  { name: "Surat", level: "LOW", bg: "#DCFCE7", color: "#166534" },
  { name: "Lucknow", level: "MED", bg: "#FEF3C7", color: "#92400E" },
];

export const ADMIN_FRAUD = [
  { id: "ZV-8832", title: "Suspicious claims pattern — Policy #ZV-8832", desc: "3 manual claims in 8 days — same zone, unusual timing" },
  { id: "ZV-5104", title: "Location mismatch — Policy #ZV-5104", desc: "Registered in Mumbai, claims from Pune 3 times" },
];

export const ADMIN_RISK_TABLE = [
  { zone: "Mumbai", risk: "High", riskClass: "error", policies: "2,840", payouts: "₹4.2L", payoutColor: "var(--error)", alert: "Monsoon", alertClass: "warning" },
  { zone: "Delhi NCR", risk: "Medium", riskClass: "warning", policies: "3,120", payouts: "₹2.1L", payoutColor: "var(--warning)", alert: "Heatwave", alertClass: "warning" },
  { zone: "Bengaluru", risk: "High", riskClass: "error", policies: "1,980", payouts: "₹3.1L", payoutColor: "var(--error)", alert: "Heavy Rain", alertClass: "error" },
  { zone: "Pune", risk: "Low", riskClass: "success", policies: "980", payouts: "₹0.4L", payoutColor: "var(--success)", alert: "Clear", alertClass: "default" },
  { zone: "Hyderabad", risk: "Medium", riskClass: "warning", policies: "1,240", payouts: "₹1.2L", payoutColor: "var(--warning)", alert: "AQI Alert", alertClass: "warning" },
];
