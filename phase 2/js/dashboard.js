function renderDashboard() {
  const user = AppState.get('user');
  const plan = AppState.get('plan');
  const trustScore = AppState.get('trustScore');
  const claims = AppState.get('claims') || [];

  
  const greeting = document.getElementById('dash-greeting-name');
  const avatar = document.getElementById('dash-avatar');
  const name = user ? user.name.split(' ')[0] : '';
  if (greeting) greeting.textContent = name ? name + ' 👋' : 'Welcome 👋';
  if (avatar) avatar.textContent = name ? name.charAt(0).toUpperCase() : '?';

  const greetingTime = document.getElementById('dash-greeting-time');
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  if (greetingTime) greetingTime.textContent = timeGreet;

  const noPolicyEl = document.getElementById('dash-no-policy');
  const activePolicyEl = document.getElementById('dash-active-policy');
  const statsEl = document.getElementById('dash-stats-section');

  if (plan) {
    if (noPolicyEl) noPolicyEl.style.display = 'none';
    if (activePolicyEl) {
      activePolicyEl.style.display = 'block';
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('dash-plan-name', plan.name);
      set('dash-coverage-amount', PLANS[plan.key]?.coverage || plan.coverage);
      set('dash-premium-val', '₹' + plan.premium + '/wk');
      set('dash-renew-date', getNextSunday());
      set('dash-policy-id', plan.policyId || 'ZV-' + Math.floor(Math.random()*9000+1000));
      set('dash-city-val', user?.city || '—');
    }

    if (statsEl) {
      const totalPaid = claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
      const weeksActive = plan.startDate ? Math.floor((Date.now() - new Date(plan.startDate)) / (7*24*60*60*1000)) + 1 : 1;
      const statClaims = document.getElementById('stat-claims-val');
      const statWeeks = document.getElementById('stat-weeks-val');
      const statTrust = document.getElementById('stat-trust-val');
      const statChange = document.getElementById('stat-claims-change');
      if (statClaims) statClaims.textContent = totalPaid > 0 ? '₹' + totalPaid.toLocaleString('en-IN') : '₹0';
      if (statWeeks) statWeeks.textContent = weeksActive;
      if (statTrust) statTrust.textContent = trustScore;
      if (statChange) {
        statChange.textContent = claims.length > 0 ? `${claims.length} payout${claims.length>1?'s':''} received` : 'No claims yet';
        statChange.className = 'stat-change ' + (claims.length > 0 ? 'positive' : '');
      }
      const statsCards = statsEl.querySelectorAll('.stat-card');
      statsCards.forEach(c => { c.style.opacity = '1'; c.style.pointerEvents = 'auto'; });
    }

    renderActivityFeed(claims);
  } else {
    if (noPolicyEl) noPolicyEl.style.display = 'block';
    if (activePolicyEl) activePolicyEl.style.display = 'none';
  }
}

function renderActivityFeed(claims) {
  const emptyEl = document.getElementById('dash-activity-empty');
  const listEl = document.getElementById('dash-activity-list');
  if (!listEl) return;

  if (!claims || claims.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    listEl.style.display = 'none';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  listEl.style.display = 'block';

  const recent = [...claims].reverse().slice(0, 5);
  listEl.innerHTML = recent.map(c => {
    const icon = { rain: '🌧', aqi: '🌫', heat: '🌡', wind: '💨', manual: '📋' }[c.type] || '📋';
    const bgColor = { rain: '#DBEAFE', aqi: '#FEF3C7', heat: '#FEE2E2', wind: '#F1F5F9', manual: '#F0FDF4' }[c.type] || '#F1F5F9';
    return `
      <div class="activity-item">
        <div class="activity-icon-wrap" style="background:${bgColor};font-size:18px">${icon}</div>
        <div class="activity-content">
          <div class="activity-title">${c.title}</div>
          <div class="activity-desc">${c.desc}</div>
        </div>
        <div style="text-align:right">
          <div class="activity-amount" style="color:var(--success)">+₹${c.amount}</div>
          <div class="activity-time">${formatDate(c.date)}</div>
        </div>
      </div>`;
  }).join('');
}