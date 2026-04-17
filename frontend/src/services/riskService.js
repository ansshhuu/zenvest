import { CITY_RISK } from "../data/config.js";

/**
 * RiskService
 * Handles AI risk scoring for gig workers.
 *
 * PRIMARY: Calls Anthropic Claude API to get ML-based risk score.
 * FALLBACK: Uses deterministic rule-based calculation if API fails.
 *
 * Future integration:
 *   - Replace callClaudeAPI() with your own ML model endpoint:
 *     POST /api/risk/score  { user: UserProfile } → RiskScore
 *   - The fallback calculateFallbackRisk() can serve as a sanity check
 */
export const RiskService = {
  async calculateRisk(user) {
    try {
      return await this.callClaudeAPI(user);
    } catch {
      return this.calculateFallbackRisk(user);
    }
  },

  async callClaudeAPI(user) {
    const prompt = `You are a parametric insurance risk scoring engine for Indian gig delivery workers.

Analyze this rider's profile and return a JSON risk assessment:

Profile:
- City: ${user.city || "Unknown"}
- Platform: ${(user.platform || []).join(", ") || "Unknown"}
- Shift: ${user.shift || "Flexible"}
- Experience: ${user.exp || "1-2 years"}
- Daily hours: ${user.hours || 8}
- Weekly earnings: ₹${user.earnings || 5000}
- City risk level: ${CITY_RISK[user.city] || "medium"}

Return ONLY valid JSON (no markdown, no preamble):
{
  "score": <number 0-100, higher = riskier>,
  "label": <"Low" | "Medium" | "High" | "Very High">,
  "trustScore": <number 60-90>,
  "summary": <one sentence explanation max 100 chars>,
  "factors": [
    {"name": "Zone Risk", "pct": <0-100>},
    {"name": "Work Hours", "pct": <0-100>},
    {"name": "Experience Level", "pct": <0-100>},
    {"name": "Weather Exposure", "pct": <0-100>},
    {"name": "Trust Score", "pct": <0-100>}
  ],
  "suggestions": [<3-4 short action tips, each under 30 chars>]
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("API failed");
    const data = await response.json();
    const text = data.content?.find(b => b.type === "text")?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  },

  calculateFallbackRisk(user) {
    let score = 50;
    const risk = CITY_RISK[user.city || ""] || "medium";
    if (risk === "high") score += 20;
    if (risk === "low") score -= 10;
    const hours = parseInt(user.hours) || 8;
    if (hours >= 12) score += 15;
    if (hours <= 6) score -= 10;
    if (user.shift === "night") score += 10;
    const exp = user.exp || "";
    if (exp === "<6m") score += 15;
    if (exp === "2y+") score -= 10;
    score = Math.min(Math.max(score, 15), 92);
    const label = score >= 75 ? "High" : score >= 55 ? "Medium" : "Low";

    return {
      score, label,
      trustScore: Math.max(60, 85 - Math.floor(score / 5)),
      summary: `Your profile shows ${label.toLowerCase()} risk based on zone and shift patterns.`,
      factors: [
        { name: "Zone Risk", pct: risk === "high" ? 80 : risk === "medium" ? 55 : 30 },
        { name: "Work Hours", pct: Math.min(hours * 6, 95) },
        { name: "Experience Level", pct: exp === "<6m" ? 75 : exp === "6-12m" ? 60 : exp === "1-2y" ? 45 : 30 },
        { name: "Weather Exposure", pct: risk === "high" ? 70 : 45 },
        { name: "Trust Score", pct: Math.max(60, 85 - Math.floor(score / 5)) },
      ],
      suggestions: ["Switch to day shifts", "Renew policy on time", "Build trust score", "Avoid peak zones"],
    };
  },
};
