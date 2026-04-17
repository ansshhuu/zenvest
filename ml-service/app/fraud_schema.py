from pydantic import BaseModel, Field


class FraudInput(BaseModel):
    claim_count_7d: int = Field(..., ge=0, example=7)
    avg_claim_amount: float = Field(..., ge=0, example=2200)
    location_jump_km: float = Field(..., ge=0, example=45.5)
    cluster_claim_count: int = Field(..., ge=0, example=12)
    device_motion_score: float = Field(..., ge=0.0, le=1.0, example=0.18)
    vpn_flag: int = Field(..., ge=0, le=1, example=1)
    claim_trigger_frequency: int = Field(..., ge=0, example=8)
    trust_score: float = Field(..., ge=0.0, le=1.0, example=0.35)
