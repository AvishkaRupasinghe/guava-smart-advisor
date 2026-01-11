# backend/app/main.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
import os
from datetime import datetime

from .inference import run_inference
from .growth_stage import estimate_growth_stage
from .fertilizer import recommend_fertilizer

# =========================
# APP INIT
# =========================
app = FastAPI(title="Guava Smart Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# =========================
# UTILS
# =========================
def calculate_age_in_months(plantation_date: str) -> int:
    """
    plantation_date format: YYYY-MM-DD
    """
    planted = datetime.strptime(plantation_date, "%Y-%m-%d")
    today = datetime.today()
    months = (today.year - planted.year) * 12 + (today.month - planted.month)
    return max(months, 0)

# =========================
# HEALTH CHECK
# =========================
@app.get("/")
def root():
    return {"status": "Guava Smart Advisor Backend Running"}

# =========================
# MAIN ANALYSIS ENDPOINT
# =========================
@app.post("/analyze")
async def analyze_guava(
    image: UploadFile = File(...),
    plantation_date: str = Form(...),
    guava_variety: str = Form(...),
    soil_type: str = Form(...),
    weather: str = Form(...),
):
    """
    Image → Disease → Growth Stage → Fertilizer
    """

    ext = image.filename.split(".")[-1]
    image_id = f"{uuid.uuid4()}.{ext}"
    image_path = os.path.join(UPLOAD_DIR, image_id)

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        # 1️⃣ Disease Detection
        inference_result = run_inference(image_path)

        plant_part = inference_result["plant_part"]
        disease = inference_result["disease"]

        # 2️⃣ Growth Stage
        age_months = calculate_age_in_months(plantation_date)
        growth_stage = estimate_growth_stage(guava_variety, age_months)

        # 3️⃣ Fertilizer Recommendation
        fert_result = recommend_fertilizer(
            plant_type=plant_part,
            disease=disease,
            growth_stage=growth_stage,
            soil_type=soil_type,
            weather=weather,
        )

        return {
            "plant_type": plant_part,
            "plant_part_confidence": inference_result["plant_part_confidence"],
            "detected_disease": disease,
            "disease_confidence": inference_result["disease_confidence"],
            "growth_stage": growth_stage,
            "plant_age_months": age_months,
            "fertilizer_recommendation": fert_result.get("fertilizer_recommendation"),
            "reasoning": fert_result.get("reasoning"),
            "status": fert_result.get("status", "success"),
        }

    finally:
        if os.path.exists(image_path):
            os.remove(image_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
