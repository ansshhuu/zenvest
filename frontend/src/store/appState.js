/**
 * AppStateManager
 * Centralized state persistence layer using localStorage.
 * Replace localStorage calls with API calls when backend is ready.
 * 
 * Future: swap localStorage.getItem with fetch('/api/user/state')
 */
export const AppStateManager = {
  _data: {
    user: null,
    plan: null,
    riskScore: null,
    trustScore: 70,
    claims: [],
    triggers: [],
    notifications: { weather: true, payout: true, renewal: true, marketing: false },
  },

  load() {
    try {
      const saved = localStorage.getItem("zenvest_state");
      if (saved) this._data = { ...this._data, ...JSON.parse(saved) };
    } catch (e) {}
  },

  save() {
    try { localStorage.setItem("zenvest_state", JSON.stringify(this._data)); } catch (e) {}
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
      notifications: { weather: true, payout: true, renewal: true, marketing: false },
    };
    this.save();
  },
};
