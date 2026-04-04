function resetRegistration() {
  currentStep = 1;
  document.querySelectorAll('.step-pane').forEach(p => p.classList.remove('active'));
  const s1 = document.getElementById('step-1');
  if (s1) s1.classList.add('active');
  uploadedFront = false; uploadedBack = false;
  const otpSec = document.getElementById('otp-section');
  if (otpSec) otpSec.style.display = 'none';
  const sendBtn = document.getElementById('send-otp-btn-wrap');
  if (sendBtn) sendBtn.style.display = 'block';
  const verBtn = document.getElementById('verify-otp-btn-wrap');
  if (verBtn) verBtn.style.display = 'none';
  ['front', 'back'].forEach(side => {
    const zone = document.getElementById('upload-' + side);
    const icon = document.getElementById(side + '-icon');
    const label = document.getElementById(side + '-label');
    const hint = document.getElementById(side + '-hint');
    const pw = document.getElementById(side + '-preview-wrap');
    if (zone) zone.classList.remove('uploaded');
    if (icon) { icon.textContent = '📄'; icon.style.display = 'block'; }
    if (label) label.textContent = side === 'front' ? 'Upload Aadhaar Front' : 'Upload Aadhaar Back';
    if (hint) hint.textContent = 'Tap to choose photo or PDF';
    if (pw) pw.style.display = 'none';
  });
  const vBtn = document.getElementById('verify-docs-btn');
  if (vBtn) vBtn.disabled = true;
  const aVer = document.getElementById('aadhaar-verified');
  if (aVer) aVer.style.display = 'none';
  updateStepUI();
}

function goToStep(step) {
  document.getElementById('step-' + currentStep).classList.remove('active');
  currentStep = step;
  document.getElementById('step-' + step).classList.add('active');
  updateStepUI();
  if (step === 5) populateSummary();
  window.scrollTo(0, 0);
}

function updateStepUI() {
  for (let i = 1; i <= 5; i++) {
    const seg = document.getElementById('seg-' + i);
    const lbl = document.getElementById('sl-' + i);
    if (!seg || !lbl) continue;
    if (i < currentStep) { seg.className = 'step-seg done'; lbl.className = 'step-label-item done'; }
    else if (i === currentStep) { seg.className = 'step-seg active'; lbl.className = 'step-label-item active'; }
    else { seg.className = 'step-seg'; lbl.className = 'step-label-item'; }
  }
}

function populateSummary() {
  const name = (document.getElementById('reg-name') || {}).value || '—';
  const phone = (document.getElementById('reg-phone') || {}).value || '—';
  const city = (document.getElementById('reg-city') || {}).value || '—';
  const platforms = [...document.querySelectorAll('#platform-chips .chip.selected')].map(c => c.dataset.value).join(' + ');
  const shift = [...document.querySelectorAll('#shift-chips .chip.selected')].map(c => c.textContent.trim()).join('');
  const exp = [...document.querySelectorAll('#exp-chips .chip.selected')].map(c => c.textContent.trim()).join('');
  const hours = (document.getElementById('hours-slider') || {}).value || '8';
  const earnings = (document.getElementById('reg-earnings') || {}).value || '';

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('summary-name', name);
  set('summary-phone', phone ? '+91 ' + phone : '—');
  set('summary-city', city);
  set('summary-platform', platforms || '—');
  set('summary-hours', hours + ' hrs');
  set('summary-shift', shift || '—');
  set('summary-exp', exp || '—');
  set('summary-earnings', earnings ? '₹' + Number(earnings).toLocaleString('en-IN') : '—');
}

function completeRegistration() {
  const name = (document.getElementById('reg-name') || {}).value || '';
  const phone = (document.getElementById('reg-phone') || {}).value || '';
  const city = (document.getElementById('reg-city') || {}).value || '';
  const platforms = [...document.querySelectorAll('#platform-chips .chip.selected')].map(c => c.dataset.value);
  const shift = [...document.querySelectorAll('#shift-chips .chip.selected')].map(c => c.textContent.trim()).join('') || 'Flexible';
  const exp = [...document.querySelectorAll('#exp-chips .chip.selected')].map(c => c.textContent.trim()).join('') || '1-2 years';
  const hours = parseInt((document.getElementById('hours-slider') || {}).value || 8);
  const earnings = parseInt((document.getElementById('reg-earnings') || {}).value || 0);
  const aadhaarVerified = document.getElementById('aadhaar-verified')?.style.display !== 'none';

  AppState.set('user', {
    name, phone, city, platform: platforms, shift, exp,
    hours, earnings, aadhaarVerified,
    joinDate: new Date().toISOString()
  });

  showToast('Account created! Analysing your profile...', 'success');
  setTimeout(() => navigate('risk'), 1000);
}

function sendOTP() {
  const phone = document.getElementById('reg-phone').value;
  if (!phone || phone.length < 10) { showToast('Please enter a valid 10-digit number', 'error'); return; }
  document.getElementById('phone-display').textContent = phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  document.getElementById('send-otp-btn-wrap').style.display = 'none';
  document.getElementById('otp-section').style.display = 'block';
  document.getElementById('verify-otp-btn-wrap').style.display = 'block';
  document.getElementById('otp-0').focus();
  startOTPTimer();
  showToast('OTP sent to +91 ' + phone, 'success');
}

function startOTPTimer() {
  otpSeconds = 60;
  clearInterval(otpTimer);
  otpTimer = setInterval(() => {
    otpSeconds--;
    const m = Math.floor(otpSeconds / 60);
    const s = otpSeconds % 60;
    const el = document.getElementById('countdown');
    if (el) el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    if (otpSeconds <= 0) {
      clearInterval(otpTimer);
      const timer = document.getElementById('otp-timer');
      if (timer) timer.style.display = 'none';
      const resend = document.getElementById('otp-resend');
      if (resend) resend.style.display = 'block';
    }
  }, 1000);
}

function resendOTP() {
  const timer = document.getElementById('otp-timer');
  if (timer) timer.style.display = 'block';
  const resend = document.getElementById('otp-resend');
  if (resend) resend.style.display = 'none';
  for (let i = 0; i < 6; i++) { const el = document.getElementById('otp-' + i); if (el) el.value = ''; }
  const o0 = document.getElementById('otp-0');
  if (o0) o0.focus();
  startOTPTimer();
  showToast('OTP resent!', 'info');
}

function otpInput(el, idx) {
  el.value = el.value.replace(/\D/g, '').slice(-1);
  if (el.value && idx < 5) {
    const next = document.getElementById('otp-' + (idx + 1));
    if (next) next.focus();
  }
}

function verifyOTP() {
  let otp = '';
  for (let i = 0; i < 6; i++) otp += (document.getElementById('otp-' + i)?.value || '');
  if (otp.length === 6) {
    clearInterval(otpTimer);
    showToast('OTP verified!', 'success');
    goToStep(2);
  } else {
    const errEl = document.getElementById('otp-error');
    if (errEl) errEl.style.display = 'block';
    showToast('Invalid OTP. Enter 6 digits.', 'error');
  }
}

function toggleChip(el) { el.classList.toggle('selected'); }

function toggleChipSingle(el) {
  const parent = el.closest('[id$="-chips"]') || el.parentElement;
  parent.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function handleAadhaarUpload(input, side) {
  const file = input.files[0];
  if (!file) return;
  const zone = document.getElementById('upload-' + side);
  const icon = document.getElementById(side + '-icon');
  const label = document.getElementById(side + '-label');
  const hint = document.getElementById(side + '-hint');
  const previewWrap = document.getElementById(side + '-preview-wrap');
  const previewImg = document.getElementById(side + '-preview-img');
  if (zone) zone.classList.add('uploaded');
  const reader = new FileReader();
  reader.onload = (e) => {
    if (previewImg) previewImg.src = e.target.result;
    if (previewWrap) previewWrap.style.display = 'block';
  };
  reader.readAsDataURL(file);
  if (icon) icon.style.display = 'none';
  if (label) label.textContent = side === 'front' ? '✅ Front uploaded' : '✅ Back uploaded';
  if (hint) hint.textContent = file.name.length > 28 ? file.name.slice(0, 25) + '...' : file.name;
  if (side === 'front') uploadedFront = true;
  else uploadedBack = true;
  const vBtn = document.getElementById('verify-docs-btn');
  if (uploadedFront && uploadedBack) {
    if (vBtn) vBtn.disabled = false;
    showToast('Both photos uploaded. Ready to verify.', 'success');
  }
}

function verifyDocuments() {
  const overlay = document.getElementById('verify-overlay');
  if (overlay) overlay.style.display = 'flex';
  const steps = ['Scanning document...', 'Extracting details...', 'Verifying with UIDAI...', 'Verification complete!'];
  let i = 0;
  const interval = setInterval(() => {
    if (i < steps.length) {
      const el = document.getElementById('verify-text');
      if (el) el.textContent = steps[i];
      i++;
    } else {
      clearInterval(interval);
      if (overlay) overlay.style.display = 'none';
      const verEl = document.getElementById('aadhaar-verified');
      if (verEl) verEl.style.display = 'block';
      const vBtn = document.getElementById('verify-docs-btn');
      if (vBtn) vBtn.style.display = 'none';
      const nameEl = document.getElementById('aadhaar-name-display');
      if (nameEl) {
        const formName = document.getElementById('reg-name')?.value;
        nameEl.textContent = formName?.trim() || 'Name Verified';
      }
      showToast('Aadhaar verified successfully!', 'success');
    }
  }, 600);
}

function checkPasswordStrength(pwd) {
  const bar = document.getElementById('strength-bar');
  if (!bar) return;
  if (!pwd) { bar.style.display = 'none'; return; }
  bar.style.display = 'block';
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const colors = ['var(--error)', 'var(--warning)', '#84CC16', 'var(--success)'];
  const labels = ['Weak', 'Fair', 'Strong', 'Very Strong'];
  document.querySelectorAll('.strength-seg').forEach((seg, i) => {
    seg.style.background = i < score ? colors[score - 1] : 'var(--border)';
  });
  const lbl = document.getElementById('strength-label');
  if (lbl) { lbl.textContent = labels[score - 1] || ''; lbl.style.color = colors[score - 1] || ''; }
}

function togglePwdVis(inputId, btn) {
  const input = document.getElementById(inputId);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.innerHTML = isText
    ? '<svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
}