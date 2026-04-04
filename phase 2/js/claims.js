function renderClaims() {
  const plan = AppState.get('plan');
  const claims = AppState.get('claims') || [];

  const noAccessEl = document.getElementById('claims-no-plan');
  const contentEl = document.getElementById('claims-content');

  if (!plan) {
    if (noAccessEl) noAccessEl.style.display = 'block';
    if (contentEl) contentEl.style.display = 'none';
    return;
  }
  if (noAccessEl) noAccessEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'block';

  
  const totalPaid = claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const manual = claims.filter(c => c.type === 'manual');

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('claims-total-amount', '₹' + totalPaid.toLocaleString('en-IN'));
  set('claims-payout-count', claims.filter(c => c.status === 'paid').length);
  set('claims-manual-count', manual.length);

  renderClaimsList('all');
}

function renderClaimsList(filter) {
  const claims = AppState.get('claims') || [];
  const listEl = document.getElementById('claims-list-items');
  const emptyEl = document.getElementById('claims-empty-state');
  if (!listEl) return;

  let filtered = claims;
  if (filter === 'parametric') filtered = claims.filter(c => ['rain','aqi','heat','wind'].includes(c.type));
  if (filter === 'manual') filtered = claims.filter(c => c.type === 'manual');

  if (filtered.length === 0) {
    listEl.style.display = 'none';
    if (emptyEl) {
      emptyEl.style.display = 'block';
      emptyEl.innerHTML = `
        <div style="font-size:48px;margin-bottom:16px">${filter === 'manual' ? '📋' : '☀️'}</div>
        <div style="font-size:18px;font-weight:700;margin-bottom:8px">${filter === 'manual' ? 'No manual claims yet' : filter === 'parametric' ? 'No parametric payouts yet' : 'No claims yet'}</div>
        <div style="color:var(--text-secondary);font-size:14px;max-width:300px;margin:0 auto 24px;line-height:1.6">${filter === 'manual' ? 'Manual claims are for accidents and illness.' : filter === 'parametric' ? 'Parametric payouts trigger automatically on weather events.' : 'Your claims and auto-payouts will appear here once your policy is active.'}</div>
        ${filter !== 'parametric' ? '<button class="btn btn-primary" onclick="openManualClaimModal()" style="height:44px;padding:0 24px">+ File a Manual Claim</button>' : ''}
      `;
    }
    return;
  }

  listEl.style.display = 'block';
  if (emptyEl) emptyEl.style.display = 'none';

  const icon = { rain: '🌧', aqi: '🌫', heat: '🌡', wind: '💨', manual: '📋' };
  const statusBadge = {
    paid: '<span class="badge badge-success">PAID</span>',
    pending: '<span class="badge badge-warning">PENDING</span>',
    rejected: '<span class="badge badge-error">REJECTED</span>',
    auto_approved: '<span class="badge badge-success">AUTO-PAID</span>'
  };

  listEl.innerHTML = [...filtered].reverse().map(c => `
    <div class="claim-item">
      <div class="claim-date">${formatDate(c.date)}</div>
      <div class="claim-info">
        <div class="claim-type">${icon[c.type]||'📋'} ${c.title}</div>
        <div class="claim-reason">${c.desc}</div>
      </div>
      <div style="text-align:right">
        ${statusBadge[c.status] || statusBadge.paid}
        <div class="claim-amount" style="margin-top:4px">+₹${c.amount}</div>
      </div>
    </div>`).join('');
}

function filterClaims(filter, el) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderClaimsList(filter);
}

function openManualClaimModal() {
  const plan = AppState.get('plan');
  if (!plan) { showToast('Please get a policy first', 'error'); return; }
  const modal = document.getElementById('manual-claim-modal');
  if (modal) modal.style.display = 'flex';
}

function closeManualClaimModal() {
  const modal = document.getElementById('manual-claim-modal');
  if (modal) modal.style.display = 'none';
}

function submitManualClaim() {
  const typeEl = document.getElementById('manual-claim-type');
  const descEl = document.getElementById('manual-claim-desc');
  const amountEl = document.getElementById('manual-claim-amount');
  if (!typeEl || !descEl || !amountEl) return;
  const type = typeEl.value;
  const desc = descEl.value.trim();
  const amount = parseInt(amountEl.value) || 0;
  if (!desc) { showToast('Please describe the incident', 'error'); return; }
  if (!amount || amount < 100) { showToast('Amount must be at least ₹100', 'error'); return; }

  const claim = {
    id: 'CLM-' + Date.now(),
    type: 'manual',
    title: type || 'Manual Claim',
    desc: desc,
    amount: amount,
    date: new Date().toISOString(),
    status: 'pending'
  };

  const claims = AppState.get('claims') || [];
  claims.push(claim);
  AppState.set('claims', claims);
  closeManualClaimModal();
  showToast('Claim filed! Under review — usually within 4 hours.', 'success');
  renderClaims();
}