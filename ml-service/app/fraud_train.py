import os
import random

import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)


def generate_fraud_data(n=2500):
    rows = []

    for _ in range(n):
        claim_count_7d = random.randint(0, 6)
        avg_claim_amount = random.randint(100, 1500)
        location_jump_km = round(random.uniform(0, 25), 2)
        cluster_claim_count = random.randint(1, 10)
        device_motion_score = round(random.uniform(0.2, 1.0), 2)
        vpn_flag = random.randint(0, 1)
        claim_trigger_frequency = random.randint(0, 8)
        trust_score = round(random.uniform(0.4, 1.0), 2)

        if random.random() < 0.15:
            claim_count_7d = random.randint(5, 15)
            avg_claim_amount = random.randint(1200, 4000)
            location_jump_km = round(random.uniform(20, 100), 2)
            cluster_claim_count = random.randint(8, 30)
            device_motion_score = round(random.uniform(0.0, 0.25), 2)
            vpn_flag = random.randint(0, 1)
            claim_trigger_frequency = random.randint(5, 12)
            trust_score = round(random.uniform(0.1, 0.55), 2)

        rows.append(
            {
                "claim_count_7d": claim_count_7d,
                "avg_claim_amount": avg_claim_amount,
                "location_jump_km": location_jump_km,
                "cluster_claim_count": cluster_claim_count,
                "device_motion_score": device_motion_score,
                "vpn_flag": vpn_flag,
                "claim_trigger_frequency": claim_trigger_frequency,
                "trust_score": trust_score,
            }
        )

    return pd.DataFrame(rows)


def train():
    df = generate_fraud_data(3000)

    csv_path = os.path.join(DATA_DIR, "synthetic_fraud_data.csv")
    df.to_csv(csv_path, index=False)

    model = IsolationForest(n_estimators=200, contamination=0.15, random_state=42)
    model.fit(df)

    model_path = os.path.join(MODELS_DIR, "fraud_model.pkl")
    columns_path = os.path.join(MODELS_DIR, "fraud_columns.pkl")

    joblib.dump(model, model_path)
    joblib.dump(list(df.columns), columns_path)

    print(f"Fraud model saved to: {model_path}")
    print(f"Fraud columns saved to: {columns_path}")


if __name__ == "__main__":
    train()
