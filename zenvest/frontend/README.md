# Zenvest React — Migration Guide

## Project Structure

```
zenvest-react/
├── index.html                    # Vite entry point (same fonts/meta)
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                  # React root, imports all CSS
    ├── App.jsx                   # All page components (single file, easy to split)
    │
    ├── data/
    │   └── config.js             # ← All hardcoded data lives here
    │       PLANS, CITY_RISK, CITIES,
    │       FEATURES, STEPS_HOW, PLAN_PREVIEWS,
    │       FOOTER_LINKS, QUICK_ACTIONS,
    │       NOTIFICATION_SETTINGS, ADMIN_*
    │
    ├── store/
    │   └── appState.js           # localStorage state manager (mirrors original state.js)
    │
    ├── services/
    │   ├── riskService.js        # Claude API + fallback risk scoring
    │   └── claimsService.js      # Claims API placeholder
    │
    ├── utils/
    │   ├── helpers.js            # formatDate, getNextSunday, formatPhone, getGreeting
    │   └── toast.js              # Toast utility (non-React contexts)
    │
    └── styles/                   # All CSS files — UNCHANGED from original
        ├── variables.css
        ├── base.css
        ├── components.css
        ├── layout.css
        └── responsive.css
```

## Setup & Run

```bash
cd zenvest-react
npm install
npm run dev
```

## What Changed vs Original

### Architecture
| Before | After |
|---|---|
| Vanilla JS in `<script>` tags | React components with hooks |
| Global mutable variables | `useState` / `AppStateManager` |
| DOM manipulation (`getElementById`) | JSX / declarative rendering |
| `navigate()` global function | `navigate` prop passed down |
| Scattered hardcoded strings | Centralized in `src/data/config.js` |
| Inline `onclick=` handlers | React event handlers |

### Hardcoded Data → Dynamic
- **PLANS**: `src/data/config.js` → PLANS object. Swap with `GET /api/plans`.
- **CITY_RISK**: `src/data/config.js` → CITY_RISK map. Swap with `GET /api/city-risk`.
- **FEATURES**: `src/data/config.js` → FEATURES array. Swap with CMS/API.
- **ADMIN_STATS / ADMIN_ZONES**: `src/data/config.js`. Swap with `GET /api/admin/stats`.
- **QUICK_ACTIONS / NOTIFICATION_SETTINGS**: `src/data/config.js`. Easy to extend.

### What Was Preserved Exactly
- All CSS files — **zero changes** to any `.css` file
- All class names, IDs, animations, keyframes
- Every screen, section, layout, spacing
- All user flows and interaction patterns
- Toast system behavior
- OTP timer logic
- Aadhaar upload + verification flow
- Password strength meter
- Risk gauge SVG animation
- Plan selection and premium breakdown
- Claims modal
- Admin dashboard
- Notification toggles

## Backend Integration Points

### Authentication
```js
// src/services/authService.js (create this)
// Replace handleAuth() in App.jsx AuthPage
POST /api/auth/otp/send    { phone }
POST /api/auth/otp/verify  { phone, otp }
POST /api/auth/login       { phone, password }
```

### Risk Scoring (ML Model)
```js
// src/services/riskService.js → callClaudeAPI()
// Replace with your own ML endpoint:
POST /api/risk/score  { city, platform, shift, exp, hours, earnings }
→ { score, label, trustScore, summary, factors[], suggestions[] }
```

### Plans
```js
// src/data/config.js → PLANS
// Replace with:
GET /api/plans  → { starter: {...}, smart: {...}, pro: {...} }
```

### Claims
```js
// src/services/claimsService.js (already stubbed)
POST /api/claims       { type, desc, amount, policyId }
GET  /api/claims       → Claim[]
GET  /api/claims/:id   → Claim
```

### Weather Triggers
```js
// src/services/triggerService.js (create this)
GET /api/triggers/status?city=Mumbai
→ { rain: 'triggered', aqi: 'monitoring', heat: 'inactive', wind: 'inactive' }
```

### State Persistence
```js
// src/store/appState.js
// Replace localStorage with:
GET  /api/user/state   → UserState
POST /api/user/state   { ...state }
```

## Splitting App.jsx into Pages (Optional)

If the file gets too large, split by page:
```
src/pages/
  HomePage.jsx
  AuthPage.jsx
  RegisterPage.jsx
  RiskPage.jsx
  PlansPage.jsx
  DashboardPage.jsx
  TriggersPage.jsx
  ClaimsPage.jsx
  ProfilePage.jsx
  AdminPage.jsx
```
Each page receives `{ navigate, showToast, appState, setAppState }` as props.

## Libraries Used

- `react` + `react-dom` — UI
- `vite` + `@vitejs/plugin-react` — build tool

No other dependencies. The original DM Sans font is loaded via Google Fonts in `index.html`.
