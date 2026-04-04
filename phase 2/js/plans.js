function initPlans() {
  const riskData = AppState.get('riskScore');
  let recommended = 'smart';
  if (riskData) {
    if (riskData.score >= 70) recommended = 'smart';
    if (riskData.score >= 85) recommended = 'pro';
    if (riskData.score < 45) recommended = 'starter';
  }
  selectPlan(recommended);
}

function selectPlan(plan) {
  selectedPlan = plan;
  ['starter', 'smart', 'pro'].forEach(p => {
    const el = document.getElementById('pc-' + p);
    if (el) el.classList.toggle('selected', p === plan);
  });
  const p = PLANS[plan];
  const zone = Math.round(p.base * 0.15);
  const night = Math.round(p.base * 0.08);
  const user = AppState.get('user');
  const nightAdj = user?.shift === 'night' ? night : 0;
  const total = p.base + zone + nightAdj;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('breakdown-plan-name', p.name);
  set('base-premium', '₹' + p.base);
  set('zone-adj', '+₹' + zone);
  set('night-adj', nightAdj > 0 ? '+₹' + nightAdj : '₹0');
  set('final-premium', '₹' + total);
  set('cta-plan-name', p.name);
}

function confirmPlan() {
  const p = PLANS[selectedPlan];
  const user = AppState.get('user');
  const zone = Math.round(p.base * 0.15);
  const night = user?.shift === 'night' ? Math.round(p.base * 0.08) : 0;
  const totalPremium = p.base + zone + night;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const plan = {
    key: selectedPlan,
    name: p.name,
    coverage: p.coverage,
    premium: totalPremium,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    policyId: 'ZV-' + Math.floor(Math.random() * 9000 + 1000)
  };

  AppState.set('plan', plan);
  showToast('Plan activated! Taking you to your dashboard...', 'success');
  setTimeout(() => navigate('dashboard'), 1200);
}