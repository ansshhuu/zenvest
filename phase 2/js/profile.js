function renderProfile() {
  const user = AppState.get('user');
  const plan = AppState.get('plan');
  const trustScore = AppState.get('trustScore') || 70;
  const claims = AppState.get('claims') || [];
  const notifications = AppState.get('notifications') || {};

  
  const avatarEl = document.getElementById('profile-avatar-initials');
  const nameEl = document.getElementById('profile-user-name');
  const metaEl = document.getElementById('profile-user-meta');
  const verifiedEl = document.getElementById('profile-verified-badge');

  if (user) {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (avatarEl) avatarEl.textContent = initials;
    if (nameEl) nameEl.textContent = user.name;
    if (metaEl) metaEl.textContent = '+91 ' + formatPhone(user.phone) + ' · ' + (user.city || '') + (plan ? ' · ' + plan.name : '');
    if (verifiedEl) verifiedEl.style.display = user.aadhaarVerified ? 'inline-flex' : 'none';
  } else {
    if (avatarEl) avatarEl.textContent = '?';
    if (nameEl) nameEl.textContent = 'Guest User';
    if (metaEl) metaEl.textContent = 'Not registered yet';
  }

  
  const trustValEl = document.getElementById('profile-trust-score');
  const trustCircleEl = document.getElementById('profile-trust-circle');
  const trustLabelEl = document.getElementById('profile-trust-label');
  const trustMiniEl = document.getElementById('profile-trust-score-mini');
  if (trustValEl) trustValEl.textContent = trustScore;
  if (trustMiniEl) trustMiniEl.textContent = trustScore;
  if (trustCircleEl) {
    const color = trustScore >= 80 ? 'var(--success)' : trustScore >= 60 ? 'var(--warning)' : 'var(--error)';
    trustCircleEl.style.borderColor = color;
    trustCircleEl.style.background = trustScore >= 80 ? 'var(--success-light)' : trustScore >= 60 ? 'var(--warning-light)' : 'var(--error-light)';
    if (trustValEl) trustValEl.style.color = color;
  }
  if (trustLabelEl) {
    trustLabelEl.textContent = trustScore >= 80 ? 'Excellent standing' : trustScore >= 60 ? 'Good standing' : 'Building trust';
  }

  
  if (user) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('profile-wp-platform', (user.platform || []).join(', ') || '—');
    set('profile-wp-city', user.city || '—');
    set('profile-wp-shift', user.shift || '—');
    set('profile-wp-exp', user.exp || '—');
    set('profile-wp-hours', (user.hours || 8) + ' hrs/day');
    set('profile-wp-earnings', user.earnings ? '₹' + Number(user.earnings).toLocaleString('en-IN') + '/wk' : '—');
  }

  
  const planNameEl = document.getElementById('profile-plan-name');
  const planCoverageEl = document.getElementById('profile-plan-coverage');
  const planPremiumEl = document.getElementById('profile-plan-premium');
  const planStatusEls = document.querySelectorAll('#profile-plan-status');
  if (plan) {
    if (planNameEl) planNameEl.textContent = plan.name;
    if (planCoverageEl) planCoverageEl.textContent = PLANS[plan.key]?.coverage || '—';
    if (planPremiumEl) planPremiumEl.textContent = '₹' + plan.premium + '/week';
    planStatusEls.forEach(el => { el.textContent = 'Active'; el.className = 'badge badge-success'; el.style.display = 'inline-flex'; });
  } else {
    if (planNameEl) planNameEl.textContent = 'No plan active';
    if (planCoverageEl) planCoverageEl.textContent = '—';
    if (planPremiumEl) planPremiumEl.textContent = '—';
    planStatusEls.forEach(el => { el.textContent = 'Not enrolled'; el.className = 'badge badge-default'; });
  }

  
  const totalPaid = claims.filter(c => c.status === 'paid' || c.status === 'auto_approved').reduce((s, c) => s + c.amount, 0);
  const profClaimsEl = document.getElementById('profile-claims-total');
  const profCountEl = document.getElementById('profile-claims-count');
  if (profClaimsEl) profClaimsEl.textContent = '₹' + totalPaid.toLocaleString('en-IN');
  if (profCountEl) profCountEl.textContent = claims.length;

  
  ['weather', 'payout', 'renewal', 'marketing'].forEach(key => {
    const el = document.getElementById('notif-' + key);
    if (el) el.classList.toggle('on', !!notifications[key]);
  });
}

function toggleNotif(key) {
  const notif = AppState.get('notifications') || {};
  notif[key] = !notif[key];
  AppState.set('notifications', notif);
  const el = document.getElementById('notif-' + key);
  if (el) el.classList.toggle('on', !!notif[key]);
}