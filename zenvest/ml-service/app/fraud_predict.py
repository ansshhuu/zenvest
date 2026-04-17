import os

import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

MODEL_PATH = os.path.join(MODELS_DIR, "fraud_model.pkl")
COLUMNS_PATH = os.path.join(MODELS_DIR, "fraud_columns.pkl")


class FraudPredictor:
    def __init__(self):
        self.model = joblib.load(MODEL_PATH)
        self.columns = joblib.load(COLUMNS_PATH)

    def predict(self, payload: dict):
        df = pd.DataFrame([payload], columns=self.columns)

        pred = int(self.model.predict(df)[0])
        score = float(self.model.decision_function(df)[0])

        is_fraud_suspected = pred == -1

        if score < -0.08:
            risk_level = "High"
        elif score < 0:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        return {
            "is_fraud_suspected": is_fraud_suspected,
            "anomaly_label": "Anomalous" if is_fraud_suspected else "Normal",
            "anomaly_score": round(score, 4),
            "risk_level": risk_level,
        }
