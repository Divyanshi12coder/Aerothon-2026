import pandas as pd
import joblib

from sklearn.model_selection import GroupShuffleSplit
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error

from feature_engineering import add_physics_features
from config_no_cycle import FEATURES_NO_CYCLE


df = pd.read_csv("../dataset/turbojet_complete_dataset.csv")
df = add_physics_features(df)

X = df[FEATURES_NO_CYCLE]
y = df["OverallHealth"]
groups = df["EngineID"]

gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=42)
train_idx, test_idx = next(gss.split(X, y, groups=groups))

X_train = X.iloc[train_idx]
X_test = X.iloc[test_idx]
y_train = y.iloc[train_idx]
y_test = y.iloc[test_idx]

model = RandomForestRegressor(
    n_estimators=300,
    random_state=42
)

model.fit(X_train, y_train)

pred = model.predict(X_test)

print("No-Cycle Overall Health Model")
print("MAE:", mean_absolute_error(y_test, pred))
print("R2 :", r2_score(y_test, pred))

joblib.dump(model, "../models/OverallHealth_no_cycle_model.pkl")

print("Saved: ../models/OverallHealth_no_cycle_model.pkl")