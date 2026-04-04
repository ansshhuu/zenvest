const AppState = {
  _data: {
    user: null,        
    plan: null,        
    riskScore: null,   
    trustScore: 70,
    claims: [],        
    triggers: [],      
    notifications: { weather: true, payout: true, renewal: true, marketing: false }
  },

  load() {
    try {
      const saved = localStorage.getItem('zenvest_state');
      if (saved) this._data = { ...this._data, ...JSON.parse(saved) };
    } catch(e) {}
  },

  save() {
    try { localStorage.setItem('zenvest_state', JSON.stringify(this._data)); } catch(e) {}
  },

  get(key) { return this._data[key]; },

  set(key, val) {
    this._data[key] = val;
    this.save();
  },

  clear() {
    this._data = {
      user: null, plan: null, riskScore: null, trustScore: 70,
      claims: [], triggers: [],
      notifications: { weather: true, payout: true, renewal: true, marketing: false }
    };
    this.save();
  }
};

let currentPage = 'home';
let currentStep = 1;
let uploadedFront = false;
let uploadedBack = false;
let selectedRole = 'user';
let selectedPlan = 'smart';
let otpTimer = null;
let otpSeconds = 60;
let activeNavTab = 'home';
let aiRiskLoading = false;

const DEMO_YOUTUBE_ID = 'l7bX-58E-7g';

const PLANS = {
  starter: { name: 'Starter Shield', base: 99,  coverage: '₹50,000',  coverageNum: 50000,  triggerPayouts: { rain: 200, aqi: 150, heat: 150, wind: 150 } },
  smart:   { name: 'Smart Shield',   base: 149, coverage: '₹1,00,000', coverageNum: 100000, triggerPayouts: { rain: 350, aqi: 250, heat: 200, wind: 300 } },
  pro:     { name: 'Pro Shield',     base: 249, coverage: '₹2,00,000', coverageNum: 200000, triggerPayouts: { rain: 500, aqi: 400, heat: 350, wind: 450 } }
};

const CITY_RISK = {
  Mumbai: 'high', Delhi: 'medium', Bengaluru: 'high', Hyderabad: 'medium',
  Chennai: 'low', Kolkata: 'medium', Pune: 'low', Ahmedabad: 'low',
  Jaipur: 'medium', Surat: 'low', Lucknow: 'medium', Kanpur: 'medium',
  Nagpur: 'medium', Indore: 'low', Thane: 'high', Bhopal: 'low',
  Visakhapatnam: 'medium', Patna: 'high', Vadodara: 'low', Ghaziabad: 'high'
};