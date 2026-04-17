"""Training script for the risk scoring model."""

import os
import random

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)


def generate_synthetic_data(n: int = 2000) -> pd.DataFrame:
    """Generate synthetic classification data for the risk model."""
    cities = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad"]
    platforms = ["Swiggy", "Zomato"]
    zone_risk_levels = ["Low", "Medium", "High"]

    rows = []

    for _ in range(n):
        city = random.choice(cities)
        platform = random.choice(platforms)
        zone_risk = random.choices(zone_risk_levels, weights=[0.3, 0.4, 0.3])[0]

        weekly_hours = random.randint(20, 80)
        past_claims = random.randint(0, 6)
        weather_risk = random.randint(1, 10)
        aqi_risk = random.randint(1, 10)
        tenure_months = random.randint(1, 60)
        trust_score = round(random.uniform(0.4, 1.0), 2)

        score = 0

        if zone_risk == "High":
            score += 3
        elif zone_risk == "Medium":
            score += 2
        else:
            score += 1

        if weekly_hours >= 55:
            score += 2
        elif weekly_hours >= 35:
            score += 1

        if past_claims >= 4:
            score += 2
        elif past_claims >= 2:
            score += 1

        if weather_risk >= 8:
            score += 2
        elif weather_risk >= 5:
            score += 1

        if aqi_risk >= 8:
            score += 2
        elif aqi_risk >= 5:
            score += 1

        if tenure_months <= 6:
            score += 1

        if trust_score < 0.6:
            score += 1

        if city in ["Mumbai", "Delhi"]:
            score += 1

        if score <= 5:
            risk_label = "Low"
        elif score <= 9:
            risk_label = "Medium"
        else:
            risk_label = "High"

        rows.append(
            {
                "city": city,
                "platform": platform,
                "zone_risk": zone_risk,
                "weekly_hours": weekly_hours,
                "past_claims": past_claims,
                "weather_risk": weather_risk,
                "aqi_risk": aqi_risk,
                "tenure_months": tenure_months,
                "trust_score": trust_score,
                "risk_label": risk_label,
            }
        )

    return pd.DataFrame(rows)


def train() -> None:
    """Train the classifier and save the model artifacts."""
    random.seed(42)
    np.random.seed(42)

    df = generate_synthetic_data(2500)

    csv_path = os.path.join(DATA_DIR, "synthetic_risk_data.csv")
    df.to_csv(csv_path, index=False)

    categorical_cols = ["city", "platform", "zone_risk"]
    encoders = {}

    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le

    target_encoder = LabelEncoder()
    df["risk_label"] = target_encoder.fit_transform(df["risk_label"])

    x = df.drop(columns=["risk_label"])
    y = df["risk_label"]

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42, stratify=y
    )

    model = XGBClassifier(
        n_estimators=120,
        max_depth=5,
        learning_rate=0.08,
        subsample=0.9,
        colsample_bytree=0.9,
        objective="multi:softprob",
        num_class=3,
        eval_metric="mlogloss",
        random_state=42,
    )

    model.fit(x_train, y_train)

    y_pred = model.predict(x_test)

    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred, target_names=target_encoder.classes_))

    model_path = os.path.join(MODELS_DIR, "risk_model.json")
    encoders_path = os.path.join(MODELS_DIR, "label_encoders.pkl")

    model.save_model(model_path)
    joblib.dump(
        {
            "feature_encoders": encoders,
            "target_encoder": target_encoder,
            "feature_columns": list(x.columns),
        },
        encoders_path,
    )

    print(f"Model saved to: {model_path}")
    print(f"Encoders saved to: {encoders_path}")


if __name__ == "__main__":
    train()
