import pandas as pd
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "guava_fertilizer_dataset.csv"
df = pd.read_csv(DATA_PATH)

def norm(x):
    return str(x).strip().lower()

df.columns = [norm(c) for c in df.columns]
df = df.applymap(norm)

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

    candidates = df[
        (df["type"] == plant_type) &
        (df["disease"] == disease)
    ]

    if candidates.empty:
        return {
            "status": "no_match",
            "fertilizer_recommendation": None,
            "reasoning": "No matching fertiliser rule found for this condition."
        }

    stage_match = candidates[candidates["growth stage"] == growth_stage]
    if not stage_match.empty:
        candidates = stage_match

    if soil_type not in ["any", "all", "not sure"]:
        soil_match = candidates[
            (candidates["soil type"] == soil_type) |
            (candidates["soil type"].isin(["any", "all"]))
        ]
        if not soil_match.empty:
            candidates = soil_match

    weather_match = candidates[
        (candidates["weather"] == weather) |
        (candidates["weather"].isin(["any", "all", "both"]))
    ]

    if not weather_match.empty:
        candidates = weather_match

    rec = candidates.iloc[0]

    return {
        "status": "success",
        "fertilizer_recommendation": {
            "type": rec.get("fertilizer", "Not specified"),
            "quantity": rec.get("quantity", "As recommended"),
            "frequency": rec.get("frequency", "As required"),
            "application_notes": rec.get("notes", ""),
        },
        "reasoning": (
            f"{plant_type.capitalize()} affected by {disease} during "
            f"{growth_stage} stage under {weather} conditions."
        ),
    }
