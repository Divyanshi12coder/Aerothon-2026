import pandas as pd
import joblib
import numpy as np

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


HEALTH_TARGETS = [
    "CompressorHealth",
    "CombustorHealth",
    "TurbineHealth",
    "OverallHealth",
]


def load_models():
    models = {}

    for target, path in MODEL_PATHS.items():
        models[target] = joblib.load(path)

    return models


def get_tree_uncertainty(model, X):
    """
    Uses individual tree predictions from ensemble models
    to estimate uncertainty.
    Works for RandomForest / ExtraTrees style models.
    """

    if not hasattr(model, "estimators_"):
        return None

    tree_predictions = []

    for tree in model.estimators_:
        tree_predictions.append(tree.predict(X)[0])

    tree_predictions = np.array(tree_predictions)

    mean_pred = float(np.mean(tree_predictions))
    std_pred = float(np.std(tree_predictions))

    lower = mean_pred - 1.96 * std_pred
    upper = mean_pred + 1.96 * std_pred

    lower = max(0.0, lower)
    upper = min(1.0, upper)

    confidence = 100 - (std_pred * 100)
    confidence = max(0.0, min(100.0, confidence))

    return {
        "mean": mean_pred,
        "std": std_pred,
        "lower_bound": lower,
        "upper_bound": upper,
        "confidence_percent": confidence,
    }


def get_engine_status(overall_health):
    if overall_health >= 0.90:
        return "Healthy"
    elif overall_health >= 0.80:
        return "Warning"
    return "Critical"


def diagnose_fault(predictions):
    faults = []

    if predictions["CompressorHealth"] < 0.80:
        faults.append("Compressor Fouling")

    if predictions["CombustorHealth"] < 0.80:
        faults.append("Combustor Efficiency Loss")

    if predictions["TurbineHealth"] < 0.80:
        faults.append("Turbine Blade Degradation")

    if len(faults) == 0:
        diagnosis = "No Fault Detected"

    elif len(faults) == 1:
        diagnosis = faults[0]

    else:
        diagnosis = "Multiple Subsystem Degradation"

    overall = predictions["OverallHealth"]

    if overall >= 0.90:
        severity = "Low"

    elif overall >= 0.80:
        severity = "Medium"

    else:
        severity = "High"

    return {
        "fault": diagnosis,
        "severity": severity,
        "affected_systems": faults
    }

def get_maintenance_recommendation(predictions, fault_info):
    overall = predictions["OverallHealth"]
    compressor = predictions["CompressorHealth"]
    combustor = predictions["CombustorHealth"]
    turbine = predictions["TurbineHealth"]

    if overall >= 0.90:
        action = "Continue normal operation"
        priority = "Low"
        inspection_required = False

    elif overall >= 0.80:
        action = "Schedule preventive inspection"
        priority = "Medium"
        inspection_required = True

    else:
        action = "Immediate maintenance required"
        priority = "High"
        inspection_required = True

    recommendations = []

    if compressor < 0.85:
        recommendations.append("Inspect compressor for fouling or pressure ratio loss")

    if combustor < 0.85:
        recommendations.append("Inspect combustor for pressure loss or combustion efficiency degradation")

    if turbine < 0.85:
        recommendations.append("Inspect turbine blades for erosion or thermal degradation")

    if not recommendations:
        recommendations.append("No subsystem-specific maintenance action required")

    return {
        "action": action,
        "priority": priority,
        "inspection_required": inspection_required,
        "recommendations": recommendations,
        "fault_reference": fault_info["fault"]
    }

def estimate_rul(predictions, input_data):
    """
    Approximate Remaining Useful Life (RUL)
    based on current health and operating cycle.
    """

    health = predictions["OverallHealth"]
    current_cycle = input_data["Cycle"]

    max_life = 1000

    estimated_total_life = max_life * health

    remaining_cycles = max(
        0,
        int(estimated_total_life - current_cycle)
    )

    if remaining_cycles > 600:
        condition = "Excellent"

    elif remaining_cycles > 350:
        condition = "Good"

    elif remaining_cycles > 150:
        condition = "Moderate"

    else:
        condition = "Near End-of-Life"

    return {
        "remaining_cycles": remaining_cycles,
        "estimated_total_life": int(estimated_total_life),
        "condition": condition
    }

def get_virtual_sensor_outputs(predictions):
    return {
        "virtual_sensors": {
            "Compressor Health Sensor": predictions["CompressorHealth"],
            "Combustor Health Sensor": predictions["CombustorHealth"],
            "Turbine Health Sensor": predictions["TurbineHealth"],
            "Overall Engine Health Sensor": predictions["OverallHealth"],
            "Estimated Thrust Sensor": predictions["Thrust_N"],
            "Estimated TSFC Sensor": predictions["TSFC_g_N_s"]
        }
    }


def predict_engine_state(input_data):
    df = pd.DataFrame([input_data])
    df = add_physics_features(df)

    X = df[FEATURES]

    models = load_models()

    predictions = {}
    uncertainty = {}

    for target, model in models.items():
        pred = model.predict(X)[0]
        predictions[target] = float(pred)

        if target in HEALTH_TARGETS:
            uq = get_tree_uncertainty(model, X)
            if uq is not None:
                uncertainty[target] = uq

    overall_health = predictions["OverallHealth"]
    engine_status = get_engine_status(overall_health)
    fault_info = diagnose_fault(predictions)
    maintenance_info = get_maintenance_recommendation(predictions, fault_info)
    rul_info = estimate_rul(predictions, input_data)
    virtual_sensor_info = get_virtual_sensor_outputs(predictions)

    return {
        "predictions": predictions,
        "uncertainty": uncertainty,
        "engine_status": engine_status,
        "fault_diagnosis": fault_info,
        "maintenance": maintenance_info,
        "remaining_useful_life": rul_info,
        "virtual_sensors": virtual_sensor_info["virtual_sensors"]
    }


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