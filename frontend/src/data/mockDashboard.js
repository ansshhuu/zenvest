/**
 * mockDashboard.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Mock dashboard data.
 * Replace with: GET /api/dashboard  → DashboardResponse
 * ──────────────────────────────────────────────────────────────────────────────
 */

export const MOCK_DASHBOARD = {
  user: {
    firstName: 'Avinash',
    avatarInitial: 'A',
  },
  activePolicy: {
    planName: 'Smart Shield',
    coverageAmount: '₹1,00,000',
    status: 'ACTIVE',
    weeklyPremium: 171,
    renewDate: 'Sunday, 20 Apr 2026',
    zone: 'Delhi',
    policyId: 'ZV-4594',
  },
  stats: [
    {
      id: 'claims',
      icon: 'rupee',
      label: 'Claims Received',
      value: '₹0',
      subtext: 'No payouts yet',
      color: '#16A34A',
      bgColor: '#DCFCE7',
    },
    {
      id: 'weeks',
      icon: 'calendar',
      label: 'Weeks Active',
      value: '1',
      subtext: 'Since activation',
      color: '#2563EB',
      bgColor: '#DBEAFE',
    },
    {
      id: 'trust',
      icon: 'star',
      label: 'Trust Score',
      value: '75',
      subtext: 'Good standing',
      color: '#7C3AED',
      bgColor: '#EDE9FE',
    },
    {
      id: 'risk',
      icon: 'shield',
      label: 'Risk Level',
      value: 'Medium',
      subtext: 'View breakdown',
      color: '#D97706',
      bgColor: '#FEF3C7',
    },
  ],
  quickActions: [
    { id: 'claim',    label: 'File a Claim',     emoji: '📋', page: 'claims' },
    { id: 'triggers', label: 'View Triggers',    emoji: '⚡', page: 'triggers' },
    { id: 'profile',  label: 'Update Profile',   emoji: '👤', page: 'profile' },
    { id: 'help',     label: 'Get Help',         emoji: '💬', page: null },
  ],
  alerts: [
    {
      id: 'rain',
      type: 'warning',
      icon: '🌧️',
      title: 'Heavy rain expected in your zone',
      description: 'Your parametric rain trigger may activate this week. Stay safe.',
    },
  ],
  recentActivity: [
    {
      id: '1',
      icon: '🛡️',
      title: 'Policy activated',
      description: 'Smart Shield plan is now active and protecting you.',
      time: 'Today',
    },
    {
      id: '2',
      icon: '💳',
      title: 'Premium recorded',
      description: 'Weekly premium of ₹171 captured successfully.',
      time: 'Today',
    },
    {
      id: '3',
      icon: '✅',
      title: 'KYC verified',
      description: 'Aadhaar verification complete via UIDAI.',
      time: 'Yesterday',
    },
  ],
};

/**
 * fetchDashboard
 * Simulates an API call. Replace with real fetch to /api/dashboard
 *
 * @param {Object} appState  Current app state (used to merge real data if available)
 * @returns {Promise<Object>}
 */
export async function fetchDashboard(appState) {
  await new Promise(r => setTimeout(r, 600));

  // Merge real user data from onboarding flow if available
  const user    = appState?.user;
  const plan    = appState?.plan;
  const result  = appState?.analysisResult;
  const lastPay = appState?.lastPayment;

  const base = { ...MOCK_DASHBOARD };

  if (user?.name) {
    base.user = {
      firstName:     user.name.split(' ')[0],
      avatarInitial: user.name.charAt(0).toUpperCase(),
    };
  }

  if (plan) {
    base.activePolicy = {
      planName:       plan.name,
      coverageAmount: plan.coverage,
      status:         'ACTIVE',
      weeklyPremium:  lastPay?.total ?? plan.premium ?? 149,
      renewDate:      new Date(Date.now() + 7 * 864e5).toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
      }),
      zone:      user?.city ?? '—',
      policyId:  plan.policyId ?? 'ZV-XXXXX',
    };
  }

  if (result) {
    base.stats = base.stats.map(s =>
      s.id === 'trust' ? { ...s, value: String(result.trustScore ?? 75) } :
      s.id === 'risk'  ? { ...s, value: result.riskLabel ?? 'Medium' } :
      s
    );
  }

  return base;
}
