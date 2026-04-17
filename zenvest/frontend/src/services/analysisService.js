/**
 * analysisService.js
 * ────────────────────────────────────────────────────────────────────────────
 * Wraps the risk analysis API call (real or mock).
 *
 * To swap for real backend:
 *   Replace the body of `analyzeProfile` with:
 *     const res = await fetch('/api/v1/risk/analyze', { method:'POST', body: JSON.stringify(payload), headers: {'Content-Type':'application/json'} });
 *     return res.json();
 * ────────────────────────────────────────────────────────────────────────────
 */

import { buildMockResponse } from '../data/mockApiResponse.js';
import { calculateRiskLabel } from '../utils/riskEngine.js';

const MOCK_LATENCY_MS = 2800; // simulates network + ML model latency

/**
 * analyzeProfile
 * Accepts the full onboarding formData and returns a RiskAnalysisResponse.
 *
 * @param {Object} formData  Full RegisterPageNew formData object
 * @returns {Promise<RiskAnalysisResponse>}
 */
export async function analyzeProfile(formData) {
  // ── TODO: replace the block below with a real fetch call ─────────────────
  await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));

  // Frontend risk label is used only as a seed — backend will own this in prod
  const riskLabel = calculateRiskLabel(formData.userDetails);
  return buildMockResponse(riskLabel, formData.userDetails);
  // ─────────────────────────────────────────────────────────────────────────
}

/**
 * submitPayment
 * Simulates payment gateway API call.
 *
 * @param {Object} payload  { planId, amount, method, upiId?, cardDetails? }
 * @returns {Promise<{ success: boolean, transactionId: string, timestamp: string }>}
 */
export async function submitPayment(payload) {
  // ── TODO: replace with real payment gateway SDK call ─────────────────────
  await new Promise(resolve => setTimeout(resolve, 2200));

  // Simulate ~10% failure rate for demo purposes
  const shouldFail = Math.random() < 0.1;
  if (shouldFail) throw new Error('Payment declined. Please try a different method.');

  return {
    success: true,
    transactionId: 'TXN' + Date.now(),
    policyId:      'ZV-' + Math.floor(Math.random() * 90000 + 10000),
    timestamp:     new Date().toISOString(),
  };
  // ─────────────────────────────────────────────────────────────────────────
}
