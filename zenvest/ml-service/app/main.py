from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.fraud_predict import FraudPredictor
from app.fraud_schema import FraudInput
from app.predict import RiskPredictor
from app.schema import RiskInput


app = FastAPI(title="Zenvest Risk Scoring Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = RiskPredictor()
fraud_predictor = FraudPredictor()


@app.get("/")
def root():
    return {"message": "Zenvest ML Risk Scoring Service is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict_risk(data: RiskInput):
    result = predictor.predict(data.model_dump())
    return {
        "success": True,
        "input": data.model_dump(),
        "prediction": result,
    }


@app.post("/predict-fraud")
def predict_fraud(data: FraudInput):
    result = fraud_predictor.predict(data.model_dump())
    return {
        "success": True,
        "input": data.model_dump(),
        "prediction": result,
    }
