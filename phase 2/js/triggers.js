function renderTriggers() {
  const plan = AppState.get('plan');
  const user = AppState.get('user');
  const claims = AppState.get('claims') || [];

  const noAccessEl = document.getElementById('triggers-no-plan');
  const contentEl = document.getElementById('triggers-content');

  if (!plan) {
    if (noAccessEl) noAccessEl.style.display = 'block';
    if (contentEl) contentEl.style.display = 'none';
    return;
  }
  if (noAccessEl) noAccessEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'block';

  
  const cityEls = document.querySelectorAll('.triggers-city-name');
  cityEls.forEach(el => el.textContent = user?.city || 'your zone');

  
  const payouts = PLANS[plan.key]?.triggerPayouts || PLANS.smart.triggerPayouts;
  const payoutEls = {
    rain: 'trigger-rain-payout',
    aqi: 'trigger-aqi-payout',
    heat: 'trigger-heat-payout',
    wind: 'trigger-wind-payout'
  };
  Object.entries(payoutEls).forEach(([type, id]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = 'Payout: ₹' + payouts[type] + ' per trigger';
  });

  
  const paramClaims = claims.filter(c => ['rain','aqi','heat','wind'].includes(c.type)).reverse().slice(0, 5);
  const payoutHistEl = document.getElementById('triggers-payout-history');
  const payoutHistEmpty = document.getElementById('triggers-payout-empty');

  if (paramClaims.length === 0) {
    if (payoutHistEl) payoutHistEl.style.display = 'none';
    if (payoutHistEmpty) payoutHistEmpty.style.display = 'block';
  } else {
    if (payoutHistEl) {
      payoutHistEl.style.display = 'block';
      const listEl = document.getElementById('triggers-payout-list');
      if (listEl) {
        const icon = { rain: '🌧', aqi: '🌫', heat: '🌡', wind: '💨' };
        listEl.innerHTML = paramClaims.map(c => `
          <div class="claim-item">
            <div class="claim-date">${formatDate(c.date)}</div>
            <div class="claim-info">
              <div class="claim-type">${icon[c.type]||'🌧'} ${c.title}</div>
              <div class="claim-reason">${c.desc}</div>
            </div>
            <div class="claim-amount">+₹${c.amount}</div>
          </div>`).join('');
      }
    }
    if (payoutHistEmpty) payoutHistEmpty.style.display = 'none';
  }

  
  const lastPayout = paramClaims[0];
  const lastPayoutBanner = document.getElementById('last-payout-banner');
  const noPayoutBanner = document.getElementById('no-payout-banner');
  if (lastPayout) {
    if (lastPayoutBanner) {
      lastPayoutBanner.style.display = 'flex';
      const titleEl = document.getElementById('last-payout-title');
      const descEl = document.getElementById('last-payout-desc');
      if (titleEl) titleEl.textContent = `Last payout: ₹${lastPayout.amount} on ${formatDate(lastPayout.date)}`;
      if (descEl) descEl.textContent = lastPayout.desc;
    }
    if (noPayoutBanner) noPayoutBanner.style.display = 'none';
  } else {
    if (lastPayoutBanner) lastPayoutBanner.style.display = 'none';
    if (noPayoutBanner) noPayoutBanner.style.display = 'block';
  }
}