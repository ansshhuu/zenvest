/**
 * riskEngine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend mock risk calculator.
 * All business logic lives here so it can be swapped out for a backend/ML API
 * call in a single place without touching any component code.
 *
 * Usage:
 *   import { calculateRiskLabel, getRecommendedPlan } from './utils/riskEngine';
 *   const label = calculateRiskLabel(formData);   // 'Low' | 'Medium' | 'High'
 *   const plan  = getRecommendedPlan(label);       // plan object
 * ─────────────────────────────────────────────────────────────────────────────
 */

const RISK_WEIGHTS = {
  weeklyHours:  { low: 40,  high: 60  },  // <40 safe, >60 high-risk
  pastClaims:   { low: 1,   high: 3   },  // >3 claims = high risk
  tenureMonths: { low: 6,   high: 0   },  // <6 months = new rider, higher risk
  trustScore:   { low: 60,  high: 80  },  // >80 good, <60 risky
};

const RISK_LEVEL_MAP = {
  Low:    { label: 'Low',    color: '#16A34A', bg: '#DCFCE7', score: 20 },
  Medium: { label: 'Medium', color: '#D97706', bg: '#FEF3C7', score: 50 },
  High:   { label: 'High',   color: '#DC2626', bg: '#FEE2E2', score: 80 },
};

/**
 * Convert a select risk value ('Low' | 'Medium' | 'High') to a numeric score.
 */
function riskSelectToScore(value) {
  const map = { Low: 0, Medium: 1, High: 2 };
  return map[value] ?? 0;
}

/**
 * calculateRiskLabel
 * Returns 'Low' | 'Medium' | 'High' based on form data.
 *
 * @param {Object} details - The userDetails slice of onboarding state
 * @returns {string} riskLabel
 */
export function calculateRiskLabel(details) {
  let points = 0;

  // Weekly hours — more hours → more exposure
  const hours = Number(details.weeklyHours) || 0;
  if (hours > RISK_WEIGHTS.weeklyHours.high)      points += 3;
  else if (hours > RISK_WEIGHTS.weeklyHours.low)  points += 1;

  // Select-based risk fields (each adds 0–2 points)
  points += riskSelectToScore(details.zoneRisk);
  points += riskSelectToScore(details.weatherRisk);
  points += riskSelectToScore(details.aqiRisk);

  // Past claims
  const claims = Number(details.pastClaims) || 0;
  if (claims >= RISK_WEIGHTS.pastClaims.high)      points += 3;
  else if (claims >= RISK_WEIGHTS.pastClaims.low)  points += 1;

  // Tenure — shorter tenure means less experience → higher risk
  const tenure = Number(details.tenureMonths) || 0;
  if (tenure < RISK_WEIGHTS.tenureMonths.low)  points += 2;

  // Trust score — lower trust → higher risk
  const trust = Number(details.trustScore) || 70;
  if (trust < RISK_WEIGHTS.trustScore.low)       points += 3;
  else if (trust < RISK_WEIGHTS.trustScore.high) points += 1;

  // Classify
  if (points <= 4)  return 'Low';
  if (points <= 9)  return 'Medium';
  return 'High';
}

/**
 * getRiskMeta
 * Returns the full meta object for a risk label (color, bg, numeric score).
 */
export function getRiskMeta(label) {
  return RISK_LEVEL_MAP[label] ?? RISK_LEVEL_MAP.Medium;
}

// ─── Plan definitions ────────────────────────────────────────────────────────
const PLANS = {
  Low: {
    key:      'basic',
    name:     'Basic Plan',
    coverage: '₹50,000',
    premium:  '₹99/week',
    tagline:  'Essential protection for low-risk riders.',
    features: [
      'Accident cover up to ₹50,000',
      'Basic hospitalisation',
      '24/7 helpline',
      'OPD benefits',
    ],
    color: '#16A34A',
    badge: 'Safe Rider',
  },
  Medium: {
    key:      'smart',
    name:     'Smart Plan',
    coverage: '₹1,00,000',
    premium:  '₹199/week',
    tagline:  'Balanced protection for the everyday rider.',
    features: [
      'Everything in Basic',
      'Parametric weather cover',
      'Equipment cover (₹10,000)',
      'Rain & AQI auto-payout',
      'Income replacement (7 days)',
    ],
    color: '#D97706',
    badge: 'Smart Choice',
  },
  High: {
    key:      'protection_plus',
    name:     'Protection Plus',
    coverage: '₹2,00,000',
    premium:  '₹349/week',
    tagline:  'Maximum protection for high-exposure riders.',
    features: [
      'Everything in Smart',
      'Critical illness cover',
      'Income protection (14 days)',
      'Priority claims (2 hrs)',
      'Family accident cover',
      'Legal assistance',
    ],
    color: '#DC2626',
    badge: 'Best Value',
  },
};

/**
 * getRecommendedPlan
 * Maps a risk label to the recommended plan object.
 *
 * @param {string} riskLabel - 'Low' | 'Medium' | 'High'
 * @returns {Object} plan
 */
export function getRecommendedPlan(riskLabel) {
  return PLANS[riskLabel] ?? PLANS.Medium;
}
