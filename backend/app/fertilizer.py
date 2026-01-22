import pandas as pd
from pathlib import Path

# -------------------------
# Load Dataset (once)
# -------------------------
DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "guava_fertilizer_dataset.csv"
df = pd.read_csv(DATA_PATH)

# -------------------------
# Normalise dataset
# -------------------------
def norm(s):
    return str(s).strip().lower()

for col in df.columns:
    df[col] = df[col].apply(norm)

# -------------------------
# Fertilizer Recommendation
# -------------------------
def recommend_fertilizer(
    plant_type: str,
    disease: str,
    growth_stage: str,
    soil_type: str,
    weather: str,
):
    plant_type = norm(plant_type)
    disease = norm(disease)
    growth_stage = norm(growth_stage)
    soil_type = norm(soil_type)
    weather = norm(weather)

    # -------------------------
    # Step 1: Mandatory filters
    # -------------------------
    candidates = df[
        (df["type"] == plant_type) &
        (df["disease"] == disease)
    ]

    if candidates.empty:
        return {
            "status": "no_match",
            "message": "No recommendation for plant type and disease"
        }

    # -------------------------
    # Step 2: Growth stage (flexible)
    # -------------------------
    stage_match = candidates[candidates["growth stage"] == growth_stage]
    if not stage_match.empty:
        candidates = stage_match

    # -------------------------
    # Step 3: Soil refinement (optional)
    # -------------------------
    if soil_type not in ["not sure", "any", "all"]:
        soil_match = candidates[
            (candidates["soil type"] == soil_type) |
            (candidates["soil type"].isin(["any", "all"]))
        ]
        if not soil_match.empty:
            candidates = soil_match

    # -------------------------
    # Step 4: Weather refinement
    # -------------------------
    weather_match = candidates[
        (candidates["weather"] == weather) |
        (candidates["weather"].isin(["both", "any", "all"]))
    ]

    if weather_match.empty:
        weather_match = candidates  # fallback

    rec = weather_match.iloc[0]

    return {
        "status": "success",
        "fertilizer_recommendation": {
            "type": rec["fertilizer"],
            "quantity": rec["quantity"],
            "frequency": rec["frequency"],
            "application_notes": rec["notes"],
        },
        "reasoning": (
            f"Based on {plant_type} affected by {disease} during {growth_stage} stage, "
            f"considering {soil_type} soil and {weather} conditions."
        )
    }
