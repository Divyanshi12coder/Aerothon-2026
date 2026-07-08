import pandas as pd
import joblib
import shap
import matplotlib.pyplot as plt

from feature_engineering import add_physics_features
from config import FEATURES

FEATURES_NO_CYCLE = [
    "Altitude_m",
    "Mach",
    "Tamb_K",
    "Pamb_Pa",
    "RPM_rev_min",
    "FuelFlow_kg_s",
    "P2_Pa",
    "T2_K",
    "P3_Pa",
    "T3_K",
    "P4_Pa",
    "T4_K",
    "CompressorPressureRatio",
    "CompressorTempRise",
    "CombustorPressureLoss",
    "TurbinePressureRatio",
    "TurbineTempDrop",
    "FuelPerRPM",
    "TempRatio_T3_T2",
    "TempRatio_T4_T3",
    "PressureRatio_P3_P2",
    "PressureRatio_P4_P3",
]


# =========================
# 1. Load Data
# =========================

df = pd.read_csv("../dataset/turbojet_complete_dataset.csv")
df = add_physics_features(df)

X = df[FEATURES_NO_CYCLE]


# =========================
# 2. Select Model
# =========================
# Pehle OverallHealth explain karte hain

target = "OverallHealth"
model_path = f"../models/{target}_model.pkl"

model = joblib.load(model_path)


# =========================
# 3. SHAP Explainer
# =========================

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X)


# =========================
# 4. SHAP Summary Plot
# =========================

plt.figure()
shap.summary_plot(
    shap_values,
    X,
    show=False
)

plt.title("SHAP Summary Plot - Overall Health")
plt.tight_layout()

output_path = "../reports/shap_overall_health.png"
plt.savefig(output_path, dpi=300, bbox_inches="tight")

print(f"SHAP plot saved successfully: {output_path}")


# =========================
# 5. SHAP Bar Plot
# =========================

plt.figure()
shap.summary_plot(
    shap_values,
    X,
    plot_type="bar",
    show=False
)

plt.title("SHAP Feature Importance - Overall Health")
plt.tight_layout()

output_path_bar = "../reports/shap_overall_health_bar.png"
plt.savefig(output_path_bar, dpi=300, bbox_inches="tight")

print(f"SHAP bar plot saved successfully: {output_path_bar}")