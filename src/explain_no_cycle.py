import pandas as pd
import joblib
import shap
import matplotlib.pyplot as plt

from feature_engineering import add_physics_features
from config_no_cycle import FEATURES_NO_CYCLE


df = pd.read_csv("../dataset/turbojet_complete_dataset.csv")
df = add_physics_features(df)

X = df[FEATURES_NO_CYCLE]

model = joblib.load("../models/OverallHealth_no_cycle_model.pkl")

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X)

plt.figure()
shap.summary_plot(shap_values, X, show=False)
plt.title("SHAP Summary Plot - Overall Health Without Cycle")
plt.tight_layout()
plt.savefig("../reports/shap_overall_health_no_cycle.png", dpi=300, bbox_inches="tight")

plt.figure()
shap.summary_plot(shap_values, X, plot_type="bar", show=False)
plt.title("SHAP Feature Importance - Overall Health Without Cycle")
plt.tight_layout()
plt.savefig("../reports/shap_overall_health_no_cycle_bar.png", dpi=300, bbox_inches="tight")

print("No-cycle SHAP plots saved.")