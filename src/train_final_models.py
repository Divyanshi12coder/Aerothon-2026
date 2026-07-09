import pandas as pd
import joblib

from sklearn.model_selection import GroupShuffleSplit
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.linear_model import Ridge
from catboost import CatBoostRegressor

from feature_engineering import add_physics_features
from config import FEATURES


df = pd.read_csv("../dataset/turbojet_complete_dataset.csv")
df = add_physics_features(df)

X = df[FEATURES]
groups = df["EngineID"]

gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, test_idx = next(gss.split(X, groups=groups))

X_train = X.iloc[train_idx]

FINAL_MODELS = {
    "CompressorHealth": ExtraTreesRegressor(n_estimators=300, random_state=42),
    "CombustorHealth": ExtraTreesRegressor(n_estimators=300, random_state=42),
    "TurbineHealth": Ridge(alpha=1.0),
    "OverallHealth": ExtraTreesRegressor(n_estimators=300, random_state=42),

    "Thrust_N": CatBoostRegressor(
        iterations=300,
        learning_rate=0.05,
        depth=4,
        random_state=42,
        verbose=0
    ),

    "TSFC_g_N_s": CatBoostRegressor(
        iterations=300,
        learning_rate=0.05,
        depth=4,
        random_state=42,
        verbose=0
    ),
}


for target, model in FINAL_MODELS.items():
    print(f"Training final model for {target}...")

    y = df[target]
    y_train = y.iloc[train_idx]

    model.fit(X_train, y_train)

    model_path = f"../models/{target}_model.pkl"
    joblib.dump(model, model_path)

    print(f"Saved: {model_path}")

print("\nFinal best models saved successfully.")