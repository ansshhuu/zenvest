"""Utility helpers for the ML service."""

from __future__ import annotations

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / "data" / "synthetic_risk_data.csv"
MODEL_PATH = BASE_DIR / "models" / "risk_model.json"
PREPROCESSOR_PATH = BASE_DIR / "models" / "label_encoders.pkl"

FEATURE_COLUMNS = [
    "city",
    "platform",
    "zone_risk",
    "weekly_hours",
    "past_claims",
    "weather_risk",
    "aqi_risk",
    "tenure_months",
    "trust_score",
]


def recommend_plan(risk_score: float) -> str:
    """Pick a plan recommendation from the predicted risk score."""
    if risk_score < 35:
        return "Starter"
    if risk_score < 70:
        return "Smart"
    return "Pro"


def risk_label_to_score(
    label: str,
    probability_map: dict[str, float] | None = None,
) -> float:
    """Convert model output into a stable numeric risk score."""
    if probability_map:
        weighted_score = (
            probability_map.get("Low", 0.0) * 25
            + probability_map.get("Medium", 0.0) * 60
            + probability_map.get("High", 0.0) * 90
        )
        return round(weighted_score, 2)

    default_scores = {"Low": 25.0, "Medium": 60.0, "High": 90.0}
    return default_scores[label]
