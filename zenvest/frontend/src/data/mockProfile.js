/**
 * mockProfile.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Mock profile payload for the rider "Profile" dashboard.
 * Replace with: GET /api/profile → ProfileResponse
 * ──────────────────────────────────────────────────────────────────────────────
 */

const BASE_PROFILE = {
  user: {
    fullName: "Anshu",
    firstName: "Anshu",
    avatarInitial: "A",
    phone: "+91 21222 22435",
    city: "Delhi",
  },
  verification: {
    aadhaarVerified: true,
    kycStatus: "Verified",
    lastUpdated: "2026-04-16",
  },
  stats: {
    totalReceived: 0,
    totalClaims: 0,
    trustScore: 75,
  },
  trust: {
    scoreLabel: "Good standing",
    tips: [
      "Renew on time (+5 pts)",
      "Upload complete documents (+6 pts)",
      "Maintain stable shift pattern (+8 pts)",
      "Reduce zone risk exposure where possible (+10 pts)",
    ],
  },
  workProfile: {
    platform: "Swiggy",
    city: "Delhi",
    shift: "Day",
    experience: "8 months",
    hoursPerDay: 8,
    weeklyHours: 48,
    earnings: 12000,
  },
  currentPolicy: {
    planName: "Smart Shield",
    coverageAmount: 100000,
    weeklyPremium: 171,
    status: "Active",
    renewDate: "2026-04-19",
    policyId: "ZV-4594",
    zone: "Delhi",
  },
  activity: [
    {
      id: "1",
      title: "Policy activated",
      description: "Your Smart Shield plan is active now.",
      time: "Today",
      type: "policy",
    },
  ],
};

function safePhone(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  return phone;
}

function formatINR(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return n.toLocaleString("en-IN");
}

function deriveTrustLabel(score) {
  if (score >= 85) return "Excellent standing";
  if (score >= 70) return "Good standing";
  if (score >= 55) return "Building trust";
  return "Needs improvement";
}

/**
 * fetchProfile
 * Simulates an API call. Replace with real fetch to /api/profile
 *
 * @param {Object} appState Current app state (used to merge real data if available)
 * @returns {Promise<Object>}
 */
export async function fetchProfile(appState) {
  await new Promise((r) => setTimeout(r, 550));

  const base = JSON.parse(JSON.stringify(BASE_PROFILE));

  const user = appState?.user;
  const plan = appState?.plan;
  const claims = appState?.claims || [];
  const trustScoreFromState = appState?.trustScore;
  const analysis = appState?.analysisResult;

  if (user?.name || user?.fullName) {
    const fullName = user.fullName || user.name;
    base.user.fullName = fullName;
    base.user.firstName = String(fullName).split(" ")[0] || fullName;
    base.user.avatarInitial = String(fullName).trim().charAt(0).toUpperCase() || "U";
  }

  if (user?.phone) base.user.phone = safePhone(user.phone);
  if (user?.city) base.user.city = user.city;

  // Work profile (best-effort mapping across old/new onboarding shapes)
  if (user) {
    if (user?.platform) base.workProfile.platform = Array.isArray(user.platform) ? user.platform.join(", ") : user.platform;
    if (user?.shift) base.workProfile.shift = String(user.shift).charAt(0).toUpperCase() + String(user.shift).slice(1);
    if (user?.exp) base.workProfile.experience = String(user.exp);
    if (user?.hours) base.workProfile.hoursPerDay = Number(user.hours) || base.workProfile.hoursPerDay;
    if (user?.weeklyHours) base.workProfile.weeklyHours = Number(user.weeklyHours) || base.workProfile.weeklyHours;
    if (user?.earnings) base.workProfile.earnings = Number(user.earnings) || base.workProfile.earnings;
    if (user?.city) base.workProfile.city = user.city;
  }

  // Verification
  if (typeof user?.aadhaarVerified === "boolean") {
    base.verification.aadhaarVerified = user.aadhaarVerified;
    base.verification.kycStatus = user.aadhaarVerified ? "Verified" : "Pending";
  }

  // Stats + trust score
  const totalPaid = claims
    .filter((c) => ["paid", "auto_approved"].includes(c.status))
    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  base.stats.totalReceived = totalPaid;
  base.stats.totalClaims = claims.length;

  const trustScore =
    (Number.isFinite(Number(trustScoreFromState)) ? Number(trustScoreFromState) : null) ??
    (Number.isFinite(Number(analysis?.trustScore)) ? Number(analysis?.trustScore) : null) ??
    base.stats.trustScore;
  base.stats.trustScore = trustScore;
  base.trust.scoreLabel = deriveTrustLabel(trustScore);

  // Policy
  if (plan) {
    base.currentPolicy.planName = plan.name ?? base.currentPolicy.planName;
    base.currentPolicy.weeklyPremium = plan.premium ?? base.currentPolicy.weeklyPremium;
    base.currentPolicy.policyId = plan.policyId ?? base.currentPolicy.policyId;
    base.currentPolicy.status = "Active";
    base.currentPolicy.zone = base.user.city ?? base.currentPolicy.zone;
    base.currentPolicy.renewDate = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  } else {
    base.currentPolicy = null;
  }

  // Activity (simple, backend-ready list)
  base.activity = [
    ...(plan
      ? [
          {
            id: "policy-activated",
            title: "Active protection running",
            description: `Your ${plan?.name ?? "policy"} is active. Renewal is scheduled automatically.`,
            time: "Today",
            type: "policy",
          },
        ]
      : [
          {
            id: "no-policy",
            title: "No active policy",
            description: "Choose a plan to unlock triggers, payouts, and claims protection.",
            time: "Today",
            type: "info",
          },
        ]),
    ...(claims?.slice(-2).reverse().map((c) => ({
      id: String(c.id ?? `claim-${Date.now()}`),
      title: c.title ? `Claim: ${c.title}` : "Claim update",
      description: c.desc ?? "Claim activity recorded.",
      time: "Recent",
      type: "claim",
      amount: c.amount ? `₹${formatINR(c.amount)}` : null,
      status: c.status ?? null,
    })) ?? []),
  ].slice(0, 5);

  return base;
}

