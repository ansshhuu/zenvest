# Zenvest Integration README

## Goal

This README explains how to connect the **frontend**, **backend**, and **ML services** for Zenvest so the full flow works during demo and submission.

---
## Pitch Deck
https://drive.google.com/file/d/1GkRFxKAaFZhlX8nB0D5gXBliamxVOCOT/view?usp=sharing

## 1. Recommended project structure

```text
zenvest/
  frontend/
    src/
      pages/
      components/
      services/
        api.js
      utils/
    package.json

  backend/
    src/
      routes/
        riskRoutes.js
        fraudRoutes.js
      controllers/
        riskController.js
        fraudController.js
      services/
        mlService.js
      app.js
      server.js
    package.json
    .env

  ml-service/
    app/
      main.py
      train.py
      predict.py
      schema.py
      fraud_train.py
      fraud_predict.py
      fraud_schema.py
    models/
      risk_model.json
      label_encoders.pkl
      fraud_model.pkl
      fraud_columns.pkl
    data/
      synthetic_risk_data.csv
      synthetic_fraud_data.csv
    requirements.txt
```

---

## 2. What each part does

### Frontend

Collects user data from onboarding or claim flow and sends it to backend.

### Backend

Acts as the main controller. It receives frontend requests, calls the ML service, and returns final results.

### ML Service

Runs the trained models and returns predictions through API endpoints.

---

## 3. Integration flow

### Risk scoring flow

```text
Frontend form
   ↓
Backend route: /api/risk/predict
   ↓
Backend service calls ML API: POST /predict
   ↓
ML returns risk_label + recommended_plan
   ↓
Backend sends final response to frontend
```

### Fraud detection flow

```text
Frontend or payout workflow
   ↓
Backend route: /api/fraud/check
   ↓
Backend service calls ML API: POST /predict-fraud
   ↓
ML returns anomaly result
   ↓
Backend decides:
     normal → auto approve
     suspicious → manual review
```

---

## 4. ML service setup

Go inside `ml-service`.

### Install dependencies

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Train models

```bash
python -m app.train
python -m app.fraud_train
```

### Run ML API

```bash
uvicorn app.main:app --reload
```

ML service will run at:

```text
http://127.0.0.1:8000
```

Docs:

```text
http://127.0.0.1:8000/docs
```

---

## 5. ML endpoints available

### Risk scoring

**POST** `/predict`

Input:

```json
{
  "city": "Mumbai",
  "platform": "Swiggy",
  "zone_risk": "High",
  "weekly_hours": 58,
  "past_claims": 3,
  "weather_risk": 8,
  "aqi_risk": 7,
  "tenure_months": 5,
  "trust_score": 0.74
}
```

Output:

```json
{
  "success": true,
  "prediction": {
    "risk_label": "High",
    "risk_score_probability": 0.9123,
    "recommended_plan": "Pro Shield"
  }
}
```

### Fraud detection

**POST** `/predict-fraud`

Input:

```json
{
  "claim_count_7d": 9,
  "avg_claim_amount": 2800,
  "location_jump_km": 62.4,
  "cluster_claim_count": 17,
  "device_motion_score": 0.11,
  "vpn_flag": 1,
  "claim_trigger_frequency": 9,
  "trust_score": 0.28
}
```

Output:

```json
{
  "success": true,
  "prediction": {
    "is_fraud_suspected": true,
    "anomaly_label": "Anomalous",
    "anomaly_score": -0.1032,
    "risk_level": "High"
  }
}
```

---

## 6. Backend setup

Inside backend, install:

```bash
npm install express axios cors dotenv
```

---

## 7. Backend environment file

Create `.env` inside backend:

```env
PORT=5000
ML_SERVICE_URL=http://127.0.0.1:8000
```

---

## 8. Backend service file

Create: `backend/src/services/mlService.js`

```js
const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

const getRiskPrediction = async (payload) => {
  const response = await axios.post(`${ML_SERVICE_URL}/predict`, payload);
  return response.data;
};

const getFraudPrediction = async (payload) => {
  const response = await axios.post(`${ML_SERVICE_URL}/predict-fraud`, payload);
  return response.data;
};

module.exports = {
  getRiskPrediction,
  getFraudPrediction,
};
```

---

## 9. Backend controllers

### `backend/src/controllers/riskController.js`

```js
const { getRiskPrediction } = require("../services/mlService");

const predictRisk = async (req, res) => {
  try {
    const result = await getRiskPrediction(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Risk prediction error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Risk prediction failed",
    });
  }
};

module.exports = { predictRisk };
```

### `backend/src/controllers/fraudController.js`

```js
const { getFraudPrediction } = require("../services/mlService");

const checkFraud = async (req, res) => {
  try {
    const result = await getFraudPrediction(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Fraud prediction error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Fraud check failed",
    });
  }
};

module.exports = { checkFraud };
```

---

## 10. Backend routes

### `backend/src/routes/riskRoutes.js`

```js
const express = require("express");
const router = express.Router();
const { predictRisk } = require("../controllers/riskController");

router.post("/predict", predictRisk);

module.exports = router;
```

### `backend/src/routes/fraudRoutes.js`

```js
const express = require("express");
const router = express.Router();
const { checkFraud } = require("../controllers/fraudController");

router.post("/check", checkFraud);

module.exports = router;
```

---

## 11. Backend app entry

### `backend/src/app.js`

```js
const express = require("express");
const cors = require("cors");
const riskRoutes = require("./routes/riskRoutes");
const fraudRoutes = require("./routes/fraudRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/risk", riskRoutes);
app.use("/api/fraud", fraudRoutes);

module.exports = app;
```

### `backend/src/server.js`

```js
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
```

Run backend:

```bash
node src/server.js
```

---

## 12. Frontend integration

Inside frontend, use axios.

```bash
npm install axios
```

Create: `frontend/src/services/api.js`

```js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const predictRisk = async (payload) => {
  const res = await API.post("/risk/predict", payload);
  return res.data;
};

export const checkFraud = async (payload) => {
  const res = await API.post("/fraud/check", payload);
  return res.data;
};
```

---

## 13. Frontend usage example

### Risk scoring example

```js
import { predictRisk } from "../services/api";

const handleRiskCheck = async () => {
  const payload = {
    city: "Mumbai",
    platform: "Swiggy",
    zone_risk: "High",
    weekly_hours: 58,
    past_claims: 3,
    weather_risk: 8,
    aqi_risk: 7,
    tenure_months: 5,
    trust_score: 0.74,
  };

  try {
    const data = await predictRisk(payload);
    console.log("Risk result:", data);
  } catch (error) {
    console.error(error);
  }
};
```

### Fraud check example

```js
import { checkFraud } from "../services/api";

const handleFraudCheck = async () => {
  const payload = {
    claim_count_7d: 9,
    avg_claim_amount: 2800,
    location_jump_km: 62.4,
    cluster_claim_count: 17,
    device_motion_score: 0.11,
    vpn_flag: 1,
    claim_trigger_frequency: 9,
    trust_score: 0.28,
  };

  try {
    const data = await checkFraud(payload);
    console.log("Fraud result:", data);
  } catch (error) {
    console.error(error);
  }
};
```

---

## 14. Suggested frontend pages/components

### Onboarding page

Use risk scoring here:

* collect user city
* platform
* weekly hours
* zone risk
* past claims
* weather risk
* AQI risk
* tenure months
* trust score

Then show:

* risk label
* recommended plan

### Claims or admin dashboard

Use fraud detection here:

* claim count in last 7 days
* average claim amount
* location jump
* cluster claim count
* device motion score
* VPN flag
* trust score

Then show:

* normal / anomalous
* fraud suspected or not
* risk level

---

## 15. Full local startup order

Run in this order:

### Terminal 1 — ML service

```bash
cd ml-service
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Terminal 2 — Backend

```bash
cd backend
node src/server.js
```

### Terminal 3 — Frontend

```bash
cd frontend
npm run dev
```

---

## 16. Ports summary

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:5000`
* ML Service: `http://127.0.0.1:8000`

---

## 17. Recommended submission demo flow

### Demo 1: onboarding

1. User fills onboarding form
2. Frontend sends data to backend
3. Backend calls ML risk model
4. Model returns risk label and recommended plan
5. Frontend shows `Starter / Smart / Pro Shield`

### Demo 2: fraud detection

1. Simulate claim
2. Backend sends claim behavior data to fraud model
3. Fraud model returns suspicious/normal
4. Dashboard shows:

   * normal → auto approve
   * suspicious → manual review

---

## 18. Common issues

### Problem: frontend cannot call backend

Check:

* backend is running on port 5000
* CORS is enabled
* frontend baseURL is correct

### Problem: backend cannot call ML service

Check:

* ML service is running on port 8000
* `ML_SERVICE_URL` in `.env` is correct
* `/predict` and `/predict-fraud` work in Swagger

### Problem: model files missing

Run:

```bash
python -m app.train
python -m app.fraud_train
```

---

## 19. Best practice

Do **not** call the ML service directly from frontend in production.

Preferred:

```text
Frontend → Backend → ML Service
```

Reason:

* cleaner architecture
* better security
* easier validation and logging
* easier future scaling

---

## 20. Final summary

* Frontend handles user interaction
* Backend handles logic and API orchestration
* ML service handles predictions
* Risk model is used during onboarding
* Fraud model is used during claim validation

This setup is lightweight, demo-friendly, and easy to extend later with real datasets and production APIs.
