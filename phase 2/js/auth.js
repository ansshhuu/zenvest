function switchAuthTab(tab) {
  document.getElementById('tab-signin').classList.toggle('active', tab === 'signin');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  const btn = document.getElementById('auth-submit-btn');
  if (btn) btn.textContent = tab === 'signin' ? 'Sign in →' : 'Create Account →';
}

function selectRole(role) {
  selectedRole = role;
  document.getElementById('role-user').classList.toggle('selected', role === 'user');
  document.getElementById('role-admin').classList.toggle('selected', role === 'admin');
}

function handleAuth() {
  const phone = document.getElementById('auth-phone').value;
  if (phone.length < 10) { showToast('Please enter a valid 10-digit number', 'error'); return; }
  if (selectedRole === 'admin') { navigate('admin'); showToast('Welcome, Admin!', 'success'); }
  else { navigate('dashboard'); showToast('Welcome back! 👋', 'success'); }
}