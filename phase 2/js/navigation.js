function navigate(page) {
  const prev = document.getElementById('page-' + currentPage);
  if (prev) prev.classList.remove('active');
  currentPage = page;
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);

  if (page === 'risk')      { startRiskLoading(); }
  if (page === 'plans')     { initPlans(); }
  if (page === 'dashboard') { renderDashboard(); }
  if (page === 'triggers')  { renderTriggers(); }
  if (page === 'claims')    { renderClaims(); }
  if (page === 'profile')   { renderProfile(); }
  if (page === 'register')  { resetRegistration(); }
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

function switchTab(tab) {
  activeNavTab = tab;
  document.querySelectorAll('.app-nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.app-nav-item').forEach(item => {
    if (item.textContent.trim().toLowerCase() === tab || item.onclick?.toString().includes(tab)) {
      item.classList.add('active');
    }
  });
}

function viewDemoOnDashboard() {
  const overlay = document.getElementById('demo-video-fullscreen');
  const iframe = document.getElementById('demo-youtube-iframe');
  if (overlay) overlay.style.display = 'flex';
  if (iframe) iframe.src = `https://www.youtube.com/embed/${DEMO_YOUTUBE_ID}?autoplay=1&rel=0`;
  document.body.style.overflow = 'hidden';
}

function closeDemoVideo() {
  const overlay = document.getElementById('demo-video-fullscreen');
  const iframe = document.getElementById('demo-youtube-iframe');
  if (overlay) overlay.style.display = 'none';
  if (iframe) iframe.src = '';
  document.body.style.overflow = '';
}

function showDemoVideo() { viewDemoOnDashboard(); }

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('demo-video-fullscreen');
    if (overlay?.style.display !== 'none') closeDemoVideo();
  }
});

function handleHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'admin')     { navigate('admin'); return; }
  if (hash === 'dashboard') { navigate('dashboard'); return; }
}

function logout() {
  AppState.clear();
  navigate('home');
  showToast('Logged out successfully', 'success');
}