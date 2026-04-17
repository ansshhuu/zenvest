"""Prediction helpers for the ML service."""

import os

import joblib
import pandas as pd
from xgboost import XGBClassifier


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

MODEL_PATH = os.path.join(MODELS_DIR, "risk_model.json")
ENCODERS_PATH = os.path.join(MODELS_DIR, "label_encoders.pkl")


class RiskPredictor:
    """Loads model artifacts and serves risk predictions."""

    def __init__(self):
        self.model = XGBClassifier()
        self.model.load_model(MODEL_PATH)

        saved = joblib.load(ENCODERS_PATH)
        self.feature_encoders = saved["feature_encoders"]
        self.target_encoder = saved["target_encoder"]
        self.feature_columns = saved["feature_columns"]

    def _safe_transform(self, col_name: str, value: str) -> int:
        encoder = self.feature_encoders[col_name]
        classes = list(encoder.classes_)

        if value not in classes:
            value = classes[0]

        return int(encoder.transform([value])[0])

    def recommend_plan(self, risk_label: str) -> str:
        if risk_label == "Low":
            return "Starter Shield"
        if risk_label == "Medium":
            return "Smart Shield"
        return "Pro Shield"

    def predict(self, payload: dict):
        row = {
            "city": self._safe_transform("city", payload["city"]),
            "platform": self._safe_transform("platform", payload["platform"]),
            "zone_risk": self._safe_transform("zone_risk", payload["zone_risk"]),
            "weekly_hours": payload["weekly_hours"],
            "past_claims": payload["past_claims"],
            "weather_risk": payload["weather_risk"],
            "aqi_risk": payload["aqi_risk"],
            "tenure_months": payload["tenure_months"],
            "trust_score": payload["trust_score"],
        }

        df = pd.DataFrame([row], columns=self.feature_columns)

        probs = self.model.predict_proba(df)[0]
        pred_idx = int(self.model.predict(df)[0])
        risk_label = self.target_encoder.inverse_transform([pred_idx])[0]

        return {
            "risk_label": risk_label,
            "risk_score_probability": round(float(max(probs)), 4),
            "recommended_plan": self.recommend_plan(risk_label),
            "class_probabilities": {
                label: round(float(prob), 4)
                for label, prob in zip(self.target_encoder.classes_, probs)
            },
        }
