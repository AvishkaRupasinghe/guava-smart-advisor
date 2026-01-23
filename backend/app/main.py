# backend/app/main.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

import shutil
import uuid
import os
from datetime import datetime
from pathlib import Path

from .inference import run_inference
from .growth_stage import estimate_growth_stage
from .fertilizer import recommend_fertilizer

# =========================
# APP INIT
# =========================
app = FastAPI(title="Guava Smart Advisor API")

# -------------------------
# CORS (safe even if frontend is served by same app)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # acceptable for research/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# PATHS
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_DIST = BASE_DIR / "dist"
UPLOAD_DIR = BASE_DIR / "temp_uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

# =========================
# SERVE FRONTEND (REACT)
# =========================
if FRONTEND_DIST.exists():
    # Serve Vite assets
    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets",
    )

    # Serve main app
    @app.get("/")
    def serve_frontend():
        return FileResponse(FRONTEND_DIST / "index.html")

# =========================
# UTILS
# =========================
def calculate_age_in_months(plantation_date: str) -> int:
    """
    plantation_date format: YYYY-MM-DD
    """
    planted = datetime.strptime(plantation_date, "%Y-%m-%d")
    today = datetime.today()

    if planted > today:
        raise ValueError("Plantation date cannot be in the future.")

    age_days = (today - planted).days
    return age_days // 30

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health_check():
    return {"status": "ok"}

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
    Image → Disease → Growth Stage → Fertiliser
    """

    ext = image.filename.split(".")[-1]
    image_id = f"{uuid.uuid4()}.{ext}"
    image_path = UPLOAD_DIR / image_id

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        # 1️⃣ Disease Detection
        inference_result = run_inference(str(image_path))

        plant_part = inference_result["plant_part"]
        disease = inference_result["disease"]

        # 2️⃣ Growth Stage
        age_months = calculate_age_in_months(plantation_date)

        # Normalise guava variety
        variety_clean = guava_variety.strip().lower()
        if "hybrid" in variety_clean:
            variety_clean = "hybrid"
        else:
            variety_clean = "natural"

        growth_stage = estimate_growth_stage(variety_clean, age_months)

        # 3️⃣ Fertiliser Recommendation
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

    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": str(e)},
        )

    finally:
        if image_path.exists():
            image_path.unlink()

# =========================
# LOCAL DEV ENTRY
# =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
    )
