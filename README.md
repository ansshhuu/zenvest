# 🛡️ Zenvest — AI-Powered Parametric Insurance for Delivery Partners

> Instant, affordable, AI-driven income protection for India's delivery workforce — delivered via web with bilingual support.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Persona-Based Scenarios & Workflow](#persona-based-scenarios--workflow)
3. [Weekly Premium Model](#weekly-premium-model)
4. [Parametric Triggers](#parametric-triggers)
5. [Platform Justification: Web](#platform-justification-web)
6. [AI/ML Integration](#aiml-integration)
7. [Tech Stack & Development Plan](#tech-stack--development-plan)
8. [Functional Requirements](#functional-requirements)

---

## Project Overview

Zenvest is a parametric micro-insurance web platform built specifically for **delivery partners** (Swiggy, Zomato, Dunzo, etc.) who lack access to traditional insurance. The platform provides:

- **Fixed weekly plans** — Starter Shield (₹99), Smart Shield (₹149), Pro Shield (₹249)
- **Zero-claim-filing** — payouts triggered automatically by verified parametric events (rain, AQI, platform downtime)
- **Instant UPI payouts** in under 30 seconds via Razorpay
- **Bilingual UI** (English + Hindi) with AI chatbot support
- **AI/ML at every layer** — from fraud detection to plan recommendation and churn prevention

---

## Persona-Based Scenarios & Workflow

### Persona 1 — Ravi, Delivery Partner (Swiggy), Mumbai

**Situation:** Ravi earns ₹600/day but loses income every monsoon week. He has no savings buffer and no insurance.

**Journey:**

1. Opens Zenvest website → registers with Aadhaar + Swiggy platform ID
2. AI risk profiler scores him: Zone = High rainfall corridor, Tenure = 14 months → **Medium risk tier**
3. LLM plan explainer recommends **Smart Shield** (₹149/week)
4. Ravi reviews coverage and pays ₹149 via UPI — **policy is active**
5. Thursday: Heavy rain crosses parametric threshold
6. LSTM model had predicted disruption 6 hours ahead → claim pre-authorized
7. Fraud detection checks GPS (Ravi was on-road) → no anomaly
8. **₹350 payout credited in 28 seconds. Zero action needed from Ravi.**
9. Sunday: Renewal recommendation sent via email/SMS

---

### Persona 2 — Arjun, Platform Manager / Insurer (Admin)

**Situation:** Arjun manages 12,000 delivery partners and needs aggregate risk visibility.

**Journey:**

1. Logs into Zenvest admin dashboard
2. Views live loss ratio, zone heatmap, and fraud log
3. Insurer analytics show predictive next-week claim volume by zone
4. Flagged fraud cases (GPS spoofing, duplicate claims) routed to human-in-loop review
5. Exports zone report to inform premium pool allocation

---

### Core Enrollment → Claim Workflow

<img width="1024" height="1536" alt="image" src="https://github.com/user-attachments/assets/1ee11107-1f55-4721-9230-b4ae2f06f81f" />

## Weekly Premium Model

### Fixed Plan Tiers

| Plan | Weekly Premium | Description |
|---|---|---|
| 🟢 **Starter Shield** | ₹99/week | Basic coverage for low-risk days |
| 🔵 **Smart Shield** | ₹149/week | Balanced coverage at medium pricing |
| 🟣 **Pro Shield** | ₹249/week | Highest coverage with best benefits |

### How AI Recommends a Plan

The AI risk profiler runs at onboarding and each Sunday to recommend the right tier based on:

| Signal | Source |
|---|---|
| Geographic zone risk | GPS + historical claim density |
| 7-day weather forecast | LSTM weather model |
| Delivery platform activity hours | Swiggy / Zomato APIs |
| AQI forecast | CPCB API |
| Worker's claim history & trust score | Internal DB |

Workers receive a weekly recommendation and can freely switch plans at each Sunday renewal — no lock-in.

---

## Parametric Triggers

Payouts fire automatically when a verified external event crosses a defined threshold — no claim filing needed.

| Trigger | Threshold | Payout Range |
|---|---|---|
| Rainfall (IMD API) | > 25mm in 3hr window | ₹250–500 |
| AQI (CPCB API) | > 400 for 4+ hours | ₹250–350 |
| Platform Downtime | > 2hr outage in worker's zone | ₹200–350 |
| Curfew / Shutdown | Verified government order | ₹350–500 |
| Extreme Heat (IMD) | > 45°C for 6hr | ₹200–300 |

The LSTM model forecasts disruption **6 hours ahead**, enabling pre-authorization before the event peaks.

---

## Platform Justification: Web

Zenvest is built as a **responsive web application** — not a native app — for the following reasons:

| Factor | Reasoning |
|---|---|
| No install barrier | Delivery partners access via browser — no Play Store approval or storage needed |
| Cross-device | Works on any Android browser, including low-end phones |
| Faster to ship | Single web codebase vs. separate iOS/Android builds |
| Admin dashboard | Insurer portal is naturally web-first |
| PWA support | Can be saved to home screen, works offline for key screens |

---

## AI/ML Integration

### 1. Identity Verification
OCR extracts Aadhaar details; liveness detection CNN prevents photo spoofing; deepfake classifier catches AI-generated video fraud.

### 2. Risk Profiling (XGBoost)
Scores each delivery partner at onboarding as Low / Medium / High risk. Updates weekly via Bayesian inference using new claim data. Features: delivery zone, weekly hours, platform, tenure, prior claims, city, season.

### 3. Plan Recommendation
XGBoost risk score + LSTM weather forecast + zone loss ratio combined to recommend the best plan tier each Sunday.

### 4. Predictive Disruption (LSTM)
Trained on IMD rainfall, CPCB AQI, and platform downtime logs. Forecasts disruption probability 6 hours ahead by zone.

### 5. Fraud Detection (Isolation Forest)
Detects GPS spoofing, sudden inactivity before trigger events, and duplicate accounts. Flagged claims go to human review; clean claims auto-approve.

### 6. Plan Explainer Chatbot (LLM)
GPT-4o powered chatbot answers plan questions and guides onboarding in Hindi and English.

### 7. Churn Predictor
Flags workers likely to lapse; triggers a retention nudge or discount offer via SMS/email.

### 8. NLP Sentiment (Post-Payout)
Worker rates experience post-payout. Sentiment model updates their trust score and feeds the weekly model retrain.

---

## Tech Stack & Development Plan

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend (Web)** | React.js + TailwindCSS |
| **Admin Dashboard** | React.js + TailwindCSS |
| **Backend API** | FastAPI (Python) |
| **Database** | PostgreSQL + Redis (cache) |
| **ML Pipeline** | scikit-learn, XGBoost, TensorFlow/Keras (LSTM) |
| **LLM / NLP** | Gemini 1.5 Flash / Pro + IndicBERT |
| **Payments** | Razorpay UPI API |
| **Weather / AQI** | IMD API + CPCB API + OpenWeatherMap |
| **Identity Verification** | Aadhaar eKYC API + liveness model |
| **Infrastructure** | AWS (ECS + RDS + S3) |
| **CI/CD** | GitHub Actions + Docker |

### Development Plan

**Phase 0 — Foundation (Weeks 1–3)**
- React.js web app + FastAPI backend scaffolding
- Aadhaar eKYC + liveness model (MVP)
- PostgreSQL schema: workers, policies, claims, zones
- Razorpay UPI sandbox integration
- English + Hindi UI strings

**Phase 1 — Enrollment Flow**
- Identity → Risk Profiling → Plan Selection → Payment flow
- XGBoost risk scorer (synthetic data)
- LLM plan explainer chatbot

**Phase 2 — Parametric Engine**
- Weather + AQI + platform API integrations
- Trigger monitor with threshold logic
- LSTM disruption prediction (v1)
- Auto claim approval + Razorpay instant payout

**Phase 3 — AI/ML Hardening**
- Isolation Forest fraud detection + GPS validation
- Churn predictor + nudge engine
- NLP post-payout sentiment model
- Weekly Bayesian risk profile retrain

**Phase 4 — Admin Dashboard**
- Loss ratio, zone heatmap, fraud log views
- Predictive claim volume forecast
- Human-in-loop fraud review interface

**Phase 5 — Launch**
- Security audit + load testing
- IRDAI sandbox compliance review
- Beta with 500 delivery partners in Mumbai + Delhi
- Production launch

---

## Functional Requirements

### Weather Prediction System
Integrates IMD + OpenWeatherMap to show a 7-day risk forecast on the worker's dashboard each Sunday. Feeds into the LSTM disruption model and parametric trigger monitoring.

### Payment Plan Options

| Plan | Weekly Premium | Description |
|---|---|---|
| 🟢 Starter Shield | ₹99/week | Basic coverage for low-risk days |
| 🔵 Smart Shield | ₹149/week | Balanced coverage at medium pricing |
| 🟣 Pro Shield | ₹249/week | Highest coverage with best benefits |

Workers can switch plans freely at each Sunday renewal with no lock-in.

### Bilingual Language Support
English and Hindi supported across all screens. Language selected at first login and changeable in settings. Chatbot responds in the chosen language. UI strings maintained in `en.json` and `hi.json`.

### Help Chatbot
GPT-4o powered chatbot answers coverage questions, guides onboarding, and explains payout status in Hindi or English. Unresolved issues escalate to human support via WhatsApp.

---

## Additional Notes

**Regulatory Compliance:** Zenvest operates under the IRDAI Sandbox Framework. Aadhaar eKYC is UIDAI-compliant, UPI follows RBI guidelines, and personal data is stored on AWS ap-south-1 (India region).

**Privacy & Security:** Aadhaar data tokenized post-verification. GPS used only for fraud detection. DPDP Act 2023 compliant. All APIs over TLS 1.3.

**Financial Model:** 20–30% margin on premiums. 60–65% of pool held as claims reserve. Catastrophic risk reinsured. Target loss ratio < 65%.

---

*Built for India's delivery partners. Powered by AI. Settled in seconds.*
