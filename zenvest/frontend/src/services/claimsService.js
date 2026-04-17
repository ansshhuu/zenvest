/**
 * ClaimsService
 * Handles claim submission and retrieval.
 *
 * Currently uses local state. 
 * Future: replace with real API calls:
 *   POST /api/claims        → submit claim
 *   GET  /api/claims        → list claims
 *   GET  /api/claims/:id    → claim detail
 */
export const ClaimsService = {
  // Placeholder for future API integration
  async submitClaim(claim) {
    // Future: return await fetch('/api/claims', { method: 'POST', body: JSON.stringify(claim) })
    return { ...claim, id: "CLM-" + Date.now(), status: "pending" };
  },

  async getClaims() {
    // Future: return await fetch('/api/claims').then(r => r.json())
    return [];
  },
};
