/**
 * plansData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Static data for Zenvest insurance plans.
 * Used across the landing page and onboarding flow.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const plans = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Essential protection for solo riders.",
    price: 99,
    period: "per week",
    coverage: "₹50,000",
    features: [
      "Accident cover up to ₹50k",
      "Basic hospitalisation",
      "24/7 Helpline support",
      "Digital policy vault"
    ],
    cta: "Get Started",
    recommended: false
  },
  {
    id: "smart",
    name: "Smart",
    tagline: "The perfect balance of cost & cover.",
    price: 149,
    period: "per week",
    coverage: "₹1,00,000",
    features: [
      "Everything in Starter",
      "Parametric weather cover",
      "Equipment cover (₹10k)",
      "Rain auto-payout (₹350)",
      "AQI trigger protection"
    ],
    cta: "Get Started",
    recommended: true,
    badge: "⭐ Recommended"
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Maximum security for high-risk zones.",
    price: 249,
    period: "per week",
    coverage: "₹2,00,000",
    features: [
      "Everything in Smart",
      "Critical illness cover",
      "Income protection (14 days)",
      "Priority claims (2 hrs)",
      "Family accident cover"
    ],
    cta: "Get Started",
    recommended: false
  }
];
