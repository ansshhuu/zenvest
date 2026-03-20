# Zenvest - Parametric Income Protection for Delivery Partners
Zenvest is a web-based micro-insurance platform providing **instant, trigger-based payouts** for India’s gig workforce.

It replaces manual claims with **automated environmental triggers** (weather, AQI, downtime) so delivery partners aren’t penalized for factors beyond their control.
<img width="1890" height="987" alt="image" src="https://github.com/user-attachments/assets/977e2199-9761-401e-bf09-475c495deb3e" />


---
## 📋 Table of Contents

1. [ User Personas & Workflow](#persona-based-scenarios--workflow)
2. [ Core Enrollment → Claim Workflow](#core-enrollment--claim-workflow)
3. [ Smart Premium Model](#weekly-premium-model)
4. [ Parametric Payout Triggers](#parametric-triggers)
5. [ Why Web (Not an App)](#-why-zenvest-is-a-web-app)
6. [ AI-Powered Decision Engine](#aiml-integration)
7. [ Tech Stack](#tech-stack--development-plan)
8. [ Development Roadmap](#development-plan)
9. [ Regulatory & Data Security](#-regulatory--privacy)
10. [ Fraud Detection System (Sentinel)](#adversarial-defense--anti-spoofing-strategy)

---
## Persona-Based Scenarios & Workflow

### Persona 1 - Veer,Delivery Partner (Swiggy, Mumbai)

- Earns around ₹600/day under normal conditions  
- Struggles during monsoon → income drops significantly  
- No savings or insurance safety net  

**Journey:**

1. Signs up on **Zenvest** using Aadhaar + Swiggy ID  
2. Gets offered **Smart Shield** plan for ₹149/week  
3. Makes payment → policy gets activated instantly  
4. Heavy rain occurs 
5. ₹350 is credited to his account within ~30 seconds  
   -  No claim forms  
   -  No manual approval  
6. Later receives a simple **“Renew?”** notification  

---

###  Persona 2 - Akash,Operations Manager (12,000 Delivery Partners)

**Dashboard Insights:**

-  Real-time loss tracking  
-  High-risk zones identification  
-  Fraud detection alerts  
-  Next-week claim predictions  

**How he uses it:**

- Adjusts premiums dynamically  
- Identifies risky areas proactively  
- Detects and prevents fraudulent claims  
- Makes data-driven operational decisions quickly  

---

## Core Enrollment → Claim Workflow

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

Workers receive a weekly recommendation and can freely switch plans at each Sunday renewal -no lock-in.

---

## Parametric Triggers (Auto-Payouts)

Payouts are triggered automatically when thresholds are met:

- **Rainfall** → >25mm in 3 hours (IMD API)  
- **Air Quality** → AQI >400 for 4+ hours (CPCB)  
- **System Outage** → App downtime >2 hours  
- **Extreme Heat** → >45°C for 6 hours  

---
## 🌐 Why Zenvest is a Web App

We built **Zenvest** as a responsive web app for one simple reason - it’s faster, easier, and more practical for our users.

---

### No Install Needed
### Works on Any Phone
- Supports low-end Android devices  
- No iOS/Android version issues  
### Instant Updates
### Web Fits Admin Needs
### PWA Benefits
- Add to home screen like an app  
- Basic offline access for key features
  
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
| **Frontend (Web)** | React.js + TailwindCSS + PWA |
| **Backend API** | Node.js (Express / Fastify) |
| **Database** | MongoDB |
| **Cache** | Redis |
| **Async / Events** | AWS SQS |
| **Rules Engine** | Custom (Node.js-based payout + fraud rules) |
| **Auth** | JWT + Aadhaar eKYC API |
| **Payments** | Razorpay UPI API |
| **External APIs** | IMD + CPCB + OpenWeatherMap |
| **Infrastructure** | AWS (EC2 / ECS + S3) |
| **Monitoring** | CloudWatch |
| **CI/CD** | GitHub Actions + Docker |

### Development Plan

## Initial Phase: Foundation

Set up the core system:

- React frontend + Node.js (Express/Fastify) backend  
- Aadhaar eKYC with basic liveness check  
- MongoDB setup (riders, policies, claims, zones)  
- Razorpay UPI (sandbox mode)  
- English + Hindi support  

---

## Phase 1: Sign-up & Enrollment

Complete rider onboarding flow:

**Flow:**  
ID verification → Risk scoring → Plan selection → Payment  

- XGBoost for initial risk scoring (synthetic data)  
- Basic LLM chatbot to explain plans simply  

---

## Phase 2: Parametric Payout Engine

Automate payouts based on real-world triggers:

- Integrate weather, AQI, and platform APIs  
- Real-time threshold checks  
- LSTM model for early disruption prediction  
- Auto-approve valid claims  
- Instant payout via Razorpay  

---

## Phase 3: AI & Fraud Protection

Improve intelligence and security:

- Isolation Forest + GPS checks for fraud detection  
- Churn prediction with reminder nudges  
- NLP on user feedback post-payout  
- Weekly Bayesian retraining for risk models  

---

## Phase 4: Admin Dashboard

Tools for operations team:

- Live loss ratio tracking  
- Zone-based heatmaps  
- Fraud alerts  
- Next-week claim predictions  
- Manual review queue for flagged cases  

---

## Phase 5: Launch

Prepare for real-world deployment:

- Security audit + load testing  
- IRDAI sandbox compliance  
- Beta launch with 500 delivery partners (Mumbai + Delhi)  
- Full production rollout  

---
##  Regulatory & Privacy

### Compliance
- Operates under **IRDAI Sandbox framework**  

### Data Sovereignty
- Hosted in **AWS ap-south-1 (Mumbai)**  
- Compliant with **DPDP Act 2023**  

### Security
- AES-256 encryption (PII)  
- TLS 1.3 for API communication  

---
# Adversarial Defense & Anti-Spoofing Strategy

## 1. Problem Statement
Current verification relies on a single-point failure: **GPS Coordinates**.

A coordinated group of 500+ actors is bypassing this using:
- Mock location providers  
- Rooted device overlays  

This triggers false payouts.

We must shift from **"Location Validation" → "Environment Validation"**

---

## 1. The Differentiation

We don’t rely only on GPS. Instead, we check **device behavior + real-world signals** to confirm if a delivery partner is genuinely stranded.

- Real users show:
  - Natural phone movement  
  - Changing network signals  
  - Consistent past routes  

- Fake/spoofed users show:
  - No movement (static device/emulator)  
  - Same IP/VPN usage  
  - Sudden location jumps  

 By combining these signals, the system creates a **“proof of presence”** before approving payouts.

---

## 2. The Data

Beyond GPS, we analyze multiple data points to detect fraud (especially coordinated attacks):

- **Motion Data (Accelerometer/Gyroscope)**  
  → Checks if the phone is actually being used  

- **Battery & Power State**  
  → Real usage vs always charging setups  

- **Network Information**  
  → IP type, VPN/proxy detection, signal changes  

- **Historical Behavior**  
  → Normal routes vs sudden “teleporting”  

- **Cluster Patterns**  
  → Multiple users claiming from the same spot at the same time  

- **Weather & AQI Data**  
  → Verifies if conditions actually match the claim  

This helps identify not just single frauds, but **fraud rings**.

---

## 3. The UX Balance

We ensure fraud checks don’t hurt genuine users.

###  Low Risk
- Instant payout  
- No interruption  

---

###  Medium Risk
- Quick verification:
  - Rotate phone  
  - Short video check  

 Takes a few seconds, minimal friction  

---

### High Risk
- Sent for manual review  
- Message shown: *“Verification in progress”*  

 No instant rejection, avoids unfair penalties  
 
---
