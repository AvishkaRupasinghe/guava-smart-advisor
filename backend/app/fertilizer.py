import pandas as pd
from pathlib import Path

# -------------------------
# Load Dataset (once)
# -------------------------
DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "guava_fertilizer_dataset.csv"

df = pd.read_csv(DATA_PATH)

# Normalize dataset text
for col in df.columns:
    df[col] = df[col].astype(str).str.strip()


# -------------------------
# Helpers
# -------------------------
def normalize(text: str) -> str:
    return str(text).strip().title()


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
    plant_type = normalize(plant_type)
    disease = normalize(disease)
    growth_stage = normalize(growth_stage)
    soil_type = normalize(soil_type)
    weather = normalize(weather)

    # Base filter
    filtered = df[
        (df["Type"] == plant_type) &
        (df["Disease"] == disease) &
        (df["Growth Stage"] == growth_stage)
    ]

    if filtered.empty:
        return {
            "status": "no_match",
            "message": "No base recommendation found"
        }

    # Soil refinement
    if soil_type != "Not Sure":
        soil_match = filtered[filtered["Soil Type"] == soil_type]
        if not soil_match.empty:
            filtered = soil_match

    # Weather refinement
    weather_match = filtered[
        (filtered["Weather"] == weather) |
        (filtered["Weather"] == "Both")
    ]

    if weather_match.empty:
        return {
            "status": "no_match",
            "message": "No recommendation for given weather"
        }

    rec = weather_match.iloc[0]

    return {
        "status": "success",
        "fertilizer_recommendation": {
            "type": rec["Fertilizer"],
            "quantity": rec["Quantity"],
            "frequency": rec["Frequency"],
            "application_notes": rec["Notes"],
        },
        "reasoning": (
            f"{plant_type} affected by {disease} at {growth_stage} stage "
            f"under {weather} conditions and {soil_type} soil."
        )
    }


if __name__ == "__main__":
    result = recommend_fertilizer(
        plant_type="Leaf",
        disease="Anthracnose",
        growth_stage="Fruiting",
        soil_type="Loam",
        weather="Rainy Season",
    )
    print(result)
