function startRiskLoading() {
  document.getElementById('risk-loading').style.display = 'flex';
  document.getElementById('risk-result').style.display = 'none';

  const user = AppState.get('user') || {};
  const messages = [
    'Analysing your zone...', 'Checking shift patterns...',
    'Running AI risk model...', 'Reviewing earnings stability...', 'Finalising your risk score...'
  ];
  let i = 0;
  const interval = setInterval(() => {
    const el = document.getElementById('risk-loading-text');
    if (el) el.textContent = messages[i % messages.length];
    i++;
  }, 700);

  callClaudeRiskAPI(user).then(riskData => {
    clearInterval(interval);
    AppState.set('riskScore', riskData);
    AppState.set('trustScore', riskData.trustScore || 70);
    renderRiskResult(riskData);
  }).catch(() => {
    clearInterval(interval);
    const fallback = calculateFallbackRisk(user);
    AppState.set('riskScore', fallback);
    AppState.set('trustScore', fallback.trustScore);
    renderRiskResult(fallback);
  });
}

function renderRiskResult(riskData) {
  document.getElementById('risk-loading').style.display = 'none';
  document.getElementById('risk-result').style.display = 'block';

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('risk-score-number', riskData.score);
  set('risk-score-label', riskData.label + ' Risk');
  set('risk-ai-summary', riskData.summary);

  const gaugeCircle = document.getElementById('gauge-circle');
  const badgeEl = document.getElementById('risk-level-badge');
  const descEl = document.getElementById('risk-description-text');

  if (gaugeCircle) {
    const color = riskData.score >= 70 ? '#DC2626' : riskData.score >= 50 ? '#F59E0B' : '#16A34A';
    gaugeCircle.style.stroke = color;
    const offset = 502 - (riskData.score / 100) * 502;
    gaugeCircle.setAttribute('stroke-dashoffset', Math.round(offset));
  }
  if (badgeEl) {
    const cls = riskData.score >= 70 ? 'badge badge-error' : riskData.score >= 50 ? 'badge badge-warning' : 'badge badge-success';
    badgeEl.className = cls;
    badgeEl.textContent = (riskData.label || 'Medium').toUpperCase() + ' RISK';
  }
  if (descEl && riskData.summary) descEl.textContent = riskData.summary;

  if (riskData.factors) {
    riskData.factors.forEach((f, idx) => {
      const bar = document.querySelector(`.risk-bar-fill[data-idx="${idx}"]`);
      const pctEl = document.querySelector(`.risk-bar-pct[data-idx="${idx}"]`);
      const nameEl = document.querySelector(`.risk-bar-name[data-idx="${idx}"]`);
      if (bar) { bar.dataset.pct = f.pct; setTimeout(() => bar.style.width = f.pct + '%', 200); }
      if (pctEl) { pctEl.textContent = f.pct + '%'; pctEl.style.color = f.pct >= 70 ? 'var(--error)' : f.pct >= 50 ? 'var(--warning)' : 'var(--success)'; }
      if (nameEl) nameEl.textContent = f.name;
    });
  }

  const suggestEl = document.getElementById('risk-suggestions');
  if (suggestEl && riskData.suggestions) {
    suggestEl.innerHTML = riskData.suggestions.map(s => `<div class="suggestion-chip">${s}</div>`).join('');
  }

  const planTagEl = document.getElementById('plan-risk-tagline');
  if (planTagEl) planTagEl.textContent = `based on your risk score of ${riskData.score} (${riskData.label})`;
}

async function callClaudeRiskAPI(user) {
  const prompt = `You are a parametric insurance risk scoring engine for Indian gig delivery workers.

Analyze this rider's profile and return a JSON risk assessment:

Profile:
- City: ${user.city || 'Unknown'}
- Platform: ${(user.platform || []).join(', ') || 'Unknown'}
- Shift: ${user.shift || 'Flexible'}
- Experience: ${user.exp || '1-2 years'}
- Daily hours: ${user.hours || 8}
- Weekly earnings: ₹${user.earnings || 5000}
- City risk level: ${CITY_RISK[user.city] || 'medium'}

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

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) throw new Error('API failed');
  const data = await response.json();
  const text = data.content?.find(b => b.type === 'text')?.text || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

function calculateFallbackRisk(user) {
  let score = 50;
  const city = user.city || '';
  const risk = CITY_RISK[city] || 'medium';
  if (risk === 'high') score += 20;
  if (risk === 'low') score -= 10;
  const hours = parseInt(user.hours) || 8;
  if (hours >= 12) score += 15;
  if (hours <= 6) score -= 10;
  if (user.shift === 'night') score += 10;
  const exp = user.exp || '';
  if (exp === '<6m') score += 15;
  if (exp === '2y+') score -= 10;
  score = Math.min(Math.max(score, 15), 92);
  const label = score >= 75 ? 'High' : score >= 55 ? 'Medium' : 'Low';
  return {
    score, label,
    trustScore: Math.max(60, 85 - Math.floor(score / 5)),
    summary: `Your profile shows ${label.toLowerCase()} risk based on zone and shift patterns.`,
    factors: [
      { name: 'Zone Risk', pct: risk === 'high' ? 80 : risk === 'medium' ? 55 : 30 },
      { name: 'Work Hours', pct: Math.min(hours * 6, 95) },
      { name: 'Experience Level', pct: exp === '<6m' ? 75 : exp === '6-12m' ? 60 : exp === '1-2y' ? 45 : 30 },
      { name: 'Weather Exposure', pct: risk === 'high' ? 70 : 45 },
      { name: 'Trust Score', pct: Math.max(60, 85 - Math.floor(score / 5)) }
    ],
    suggestions: ['Switch to day shifts', 'Renew policy on time', 'Build trust score', 'Avoid peak zones']
  };
}