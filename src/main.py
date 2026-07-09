from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predict import predict_engine_state


app = FastAPI(
    title="AeroTwin Digital Twin API",
    description="Physics-Informed Four-Stage Turbojet Health Monitoring API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EngineInput(BaseModel):
    Cycle: int
    Altitude_m: float
    Mach: float
    Tamb_K: float
    Pamb_Pa: float
    RPM_rev_min: float
    FuelFlow_kg_s: float
    P2_Pa: float
    T2_K: float
    P3_Pa: float
    T3_K: float
    P4_Pa: float
    T4_K: float


@app.get("/")
def home():
    return {
        "message": "AeroTwin Digital Twin API is running",
        "status": "active",
        "modules": [
            "Physics-informed feature engineering",
            "Health monitoring",
            "Performance prediction",
            "Uncertainty quantification",
            "Fault diagnosis",
            "Predictive maintenance",
            "RUL estimation",
            "Virtual sensors"
        ]
    }


@app.post("/predict")
def predict(input_data: EngineInput):
    data = input_data.model_dump()
    result = predict_engine_state(data)

    return {
        "input": data,
        **result
    }