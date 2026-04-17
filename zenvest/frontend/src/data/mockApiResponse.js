/**
 * mockApiResponse.js
 * ────────────────────────────────────────────────────────────────────────────
 * Simulates the JSON payload your ML backend / risk API will eventually return.
 * Shape is locked — only swap the data source, not the consumer code.
 *
 * Real integration: POST /api/v1/risk/analyze  { userProfile }
 *                   → returns RiskAnalysisResponse
 * ────────────────────────────────────────────────────────────────────────────
 */

/** @typedef {Object} ScoreFactor
 *  @property {string} name
 *  @property {number} pct         0-100
 *  @property {string} description
 */

/** @typedef {Object} Plan
 *  @property {string}   id
 *  @property {string}   name
 *  @property {number}   weeklyPremium
 *  @property {string}   coverage
 *  @property {number}   coverageNum
 *  @property {string[]} features
 *  @property {boolean}  recommended
 *  @property {string}   badge
 *  @property {Object}   triggerPayouts  { rain, aqi, heat, wind }
 */

/** @typedef {Object} RiskAnalysisResponse
 *  @property {number}       riskScore
 *  @property {string}       riskLabel       Low | Medium | High | Very High
 *  @property {string}       explanation     1-2 sentence human-readable summary
 *  @property {number}       trustScore      0-100
 *  @property {ScoreFactor[]} scoreBreakdown
 *  @property {string[]}     suggestions
 *  @property {string}       recommendedPlanId
 *  @property {Plan[]}       availablePlans
 */

// ── Shared plan catalogue (will come from /api/plans in production) ───────────
export const PLAN_CATALOGUE = [
  {
    id: 'starter',
    name: 'Starter Shield',
    weeklyPremium: 99,
    coverage: '₹50,000',
    coverageNum: 50000,
    badge: 'Essential',
    recommended: false,
    features: [
      'Accident cover up to ₹50,000',
      'Basic hospitalisation',
      '24/7 helpline access',
      'OPD benefits',
    ],
    triggerPayouts: { rain: 200, aqi: 150, heat: 150, wind: 150 },
  },
  {
    id: 'smart',
    name: 'Smart Shield',
    weeklyPremium: 149,
    coverage: '₹1,00,000',
    coverageNum: 100000,
    badge: '⭐ Most Popular',
    recommended: false,
    features: [
      'Everything in Starter',
      'Parametric weather cover',
      'Equipment cover (₹10,000)',
      'Rain & AQI auto-payout',
      'Income replacement (7 days)',
    ],
    triggerPayouts: { rain: 350, aqi: 250, heat: 200, wind: 300 },
  },
  {
    id: 'pro',
    name: 'Pro Shield',
    weeklyPremium: 249,
    coverage: '₹2,00,000',
    coverageNum: 200000,
    badge: '🏅 Best Value',
    recommended: false,
    features: [
      'Everything in Smart',
      'Critical illness cover',
      'Income protection (14 days)',
      'Priority claims (2 hrs)',
      'Family accident cover',
      'Legal assistance',
    ],
    triggerPayouts: { rain: 500, aqi: 400, heat: 350, wind: 450 },
  },
];

/**
 * buildMockResponse
 * Generates a realistic API response from the frontend-computed risk data.
 * In production this entire function is replaced by: fetch('/api/v1/risk/analyze', ...)
 *
 * @param {string} riskLabel   'Low' | 'Medium' | 'High'
 * @param {Object} userDetails  The userDetails slice from onboarding formData
 * @returns {RiskAnalysisResponse}
 */
export function buildMockResponse(riskLabel, userDetails) {
  const scoreMap   = { Low: 28, Medium: 54, High: 78 };
  const trustMap   = { Low: 84, Medium: 71, High: 58 };
  const planMap    = { Low: 'starter', Medium: 'smart', High: 'pro' };

  const riskScore  = scoreMap[riskLabel]  ?? 54;
  const trustScore = trustMap[riskLabel]  ?? 71;
  const recommendedPlanId = planMap[riskLabel] ?? 'smart';

  // Mark recommended
  const availablePlans = PLAN_CATALOGUE.map(p => ({
    ...p,
    recommended: p.id === recommendedPlanId,
  }));

  const explanationMap = {
    Low:    `Your profile indicates low exposure risk. You work in a relatively safe zone with moderate hours and a strong trust history.`,
    Medium: `Your profile shows moderate risk factors. Zone conditions, work hours, or prior claims suggest a balanced risk level.`,
    High:   `Your profile presents elevated risk due to high zone exposure, extended hours, or environmental factors. Premium protection recommended.`,
  };

  const riskValueMap = { Low: 30, Medium: 55, High: 78 };
  const hoursVal     = Math.min(Number(userDetails?.weeklyHours || 40) * 1.2, 95);

  const zoneMap  = { Low: 30, Medium: 58, High: 82 };
  const aqiMap   = { Low: 25, Medium: 52, High: 80 };
  const weatherMap = { Low: 20, Medium: 50, High: 78 };

  return {
    riskScore,
    riskLabel,
    explanation: explanationMap[riskLabel] ?? explanationMap.Medium,
    trustScore,
    scoreBreakdown: [
      { name: 'Zone Risk',       pct: zoneMap[userDetails?.zoneRisk]    ?? riskValueMap[riskLabel], description: 'Based on your delivery zone\'s historical risk data' },
      { name: 'Work Hours',      pct: Math.round(hoursVal),             description: 'Weekly delivery hours vs. population average' },
      { name: 'Weather Exposure',pct: weatherMap[userDetails?.weatherRisk] ?? riskValueMap[riskLabel], description: 'Exposure to weather events in your zone' },
      { name: 'AQI Exposure',    pct: aqiMap[userDetails?.aqiRisk]      ?? riskValueMap[riskLabel], description: 'Air quality index risk in your delivery area' },
      { name: 'Trust Score',     pct: trustScore,                       description: 'Platform trust score and delivery history' },
    ],
    suggestions: [
      'Avoid peak-hour zones during monsoon season',
      'Build your trust score for lower future premiums',
      'Document all incidents immediately after they occur',
      'Renew your policy every Sunday without fail',
    ],
    recommendedPlanId,
    availablePlans,
  };
}
