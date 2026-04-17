"""Request schema for the ML service."""

from pydantic import BaseModel, Field


class RiskInput(BaseModel):
    """Incoming request payload for risk prediction."""

    city: str = Field(..., example="Mumbai")
    platform: str = Field(..., example="Swiggy")
    zone_risk: str = Field(..., example="High")
    weekly_hours: int = Field(..., ge=0, le=100, example=55)
    past_claims: int = Field(..., ge=0, le=20, example=2)
    weather_risk: int = Field(..., ge=1, le=10, example=8)
    aqi_risk: int = Field(..., ge=1, le=10, example=7)
    tenure_months: int = Field(..., ge=0, le=240, example=8)
    trust_score: float = Field(..., ge=0.0, le=1.0, example=0.82)
