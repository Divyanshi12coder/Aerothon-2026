import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import GroupShuffleSplit
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from feature_engineering import add_physics_features
from config import FEATURES, TARGETS


df = pd.read_csv("../dataset/turbojet_complete_dataset.csv")
df = add_physics_features(df)


def train_target_model(target):
    X = df[FEATURES]
    y = df[target]
    groups = df["EngineID"]

    gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
    train_idx, test_idx = next(gss.split(X, y, groups=groups))

    X_train = X.iloc[train_idx]
    X_test = X.iloc[test_idx]
    y_train = y.iloc[train_idx]
    y_test = y.iloc[test_idx]

    model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        max_depth=None
    )

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print("\n====================================")
    print(f"Target: {target}")
    print("====================================")
    print("Train Engines:", sorted(df.iloc[train_idx]["EngineID"].unique()))
    print("Test Engines :", sorted(df.iloc[test_idx]["EngineID"].unique()))
    print(f"MAE  : {mae:.6f}")
    print(f"RMSE : {rmse:.6f}")
    print(f"R2   : {r2:.6f}")

    importance = pd.DataFrame({
        "Feature": FEATURES,
        "Importance": model.feature_importances_
    }).sort_values(by="Importance", ascending=False)

    print("\nTop 10 Feature Importance:")
    print(importance.head(10))

    model_path = f"../models/{target}_model.pkl"
    joblib.dump(model, model_path)

    return {
        "target": target,
        "mae": mae,
        "rmse": rmse,
        "r2": r2
    }


results = []

for target in TARGETS:
    results.append(train_target_model(target))

results_df = pd.DataFrame(results)

print("\n\n========== FINAL MODEL SUMMARY ==========")
print(results_df)

results_df.to_csv("../reports/model_results.csv", index=False)

print("\nAll models trained successfully.")