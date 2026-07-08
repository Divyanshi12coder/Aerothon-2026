import pandas as pd
import joblib

from feature_engineering import add_physics_features
from config import FEATURES


MODEL_PATHS = {
    "CompressorHealth": "../models/CompressorHealth_model.pkl",
    "CombustorHealth": "../models/CombustorHealth_model.pkl",
    "TurbineHealth": "../models/TurbineHealth_model.pkl",
    "OverallHealth": "../models/OverallHealth_model.pkl",
    "Thrust_N": "../models/Thrust_N_model.pkl",
    "TSFC_g_N_s": "../models/TSFC_g_N_s_model.pkl",
}


def load_models():
    models = {}

    for target, path in MODEL_PATHS.items():
        models[target] = joblib.load(path)

    return models


def predict_engine_state(input_data):
    df = pd.DataFrame([input_data])
    df = add_physics_features(df)

    X = df[FEATURES]

    models = load_models()

    predictions = {}

    for target, model in models.items():
        pred = model.predict(X)[0]
        predictions[target] = float(pred)

    return predictions


if __name__ == "__main__":
    sample_input = {
        "Cycle": 20,
        "Altitude_m": 5000,
        "Mach": 0.5,
        "Tamb_K": 250,
        "Pamb_Pa": 54000,
        "RPM_rev_min": 60000,
        "FuelFlow_kg_s": 1.2,
        "P2_Pa": 220000,
        "T2_K": 420,
        "P3_Pa": 210000,
        "T3_K": 1100,
        "P4_Pa": 90000,
        "T4_K": 750,
    }

    output = predict_engine_state(sample_input)

    print("\nDigital Twin Prediction:")
    print(output)