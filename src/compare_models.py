import time
import pandas as pd
import numpy as np

from sklearn.model_selection import GroupShuffleSplit
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from xgboost import XGBRegressor

from feature_engineering import add_physics_features
from config import FEATURES, TARGETS


df = pd.read_csv("../dataset/turbojet_complete_dataset.csv")
df = add_physics_features(df)


models = {
    "Linear Regression": LinearRegression(),

    "Random Forest": RandomForestRegressor(
        n_estimators=300,
        random_state=42
    ),

    "XGBoost": XGBRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=4,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=42,
        objective="reg:squarederror"
    )
}


def evaluate_model(model_name, model, target):
    X = df[FEATURES]
    y = df[target]
    groups = df["EngineID"]

    gss = GroupShuffleSplit(
        n_splits=1,
        test_size=0.2,
        random_state=42
    )

    train_idx, test_idx = next(gss.split(X, y, groups=groups))

    X_train = X.iloc[train_idx]
    X_test = X.iloc[test_idx]
    y_train = y.iloc[train_idx]
    y_test = y.iloc[test_idx]

    start_time = time.time()

    model.fit(X_train, y_train)

    training_time = time.time() - start_time

    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    return {
        "model": model_name,
        "target": target,
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
        "training_time_sec": training_time
    }


results = []

for target in TARGETS:
    print(f"\nEvaluating target: {target}")

    for model_name, model in models.items():
        print(f"Training {model_name}...")
        result = evaluate_model(model_name, model, target)
        results.append(result)


results_df = pd.DataFrame(results)

print("\n========== MODEL COMPARISON ==========")
results_df.to_csv("../reports/model_comparison.csv", index=False)

results_df.to_csv("../reports/model_comparison.csv", index=False)

print("\nModel comparison saved to ../reports/model_comparison.csv")