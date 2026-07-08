def add_physics_features(df):
    df = df.copy()

    df["CompressorPressureRatio"] = df["P2_Pa"] / df["Pamb_Pa"]
    df["CompressorTempRise"] = df["T2_K"] - df["Tamb_K"]

    df["CombustorPressureLoss"] = (df["P2_Pa"] - df["P3_Pa"]) / df["P2_Pa"]

    df["TurbinePressureRatio"] = df["P3_Pa"] / df["P4_Pa"]
    df["TurbineTempDrop"] = df["T3_K"] - df["T4_K"]

    df["FuelPerRPM"] = df["FuelFlow_kg_s"] / df["RPM_rev_min"]
    df["TempRatio_T3_T2"] = df["T3_K"] / df["T2_K"]
    df["TempRatio_T4_T3"] = df["T4_K"] / df["T3_K"]
    df["PressureRatio_P3_P2"] = df["P3_Pa"] / df["P2_Pa"]
    df["PressureRatio_P4_P3"] = df["P4_Pa"] / df["P3_Pa"]

    return df