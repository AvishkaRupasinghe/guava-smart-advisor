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
# PATHS
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_DIST = BASE_DIR / "dist"
UPLOAD_DIR = BASE_DIR / "temp_uploads"

UPLOAD_DIR.mkdir(exist_ok=True)

# =========================
# APP INIT
# =========================
app = FastAPI(title="Guava Smart Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # safe for demo + same-origin deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# SERVE FRONTEND (VITE + PWA)
# =========================
if FRONTEND_DIST.exists():

    app.mount(
        "/assets",
        StaticFiles(directory=FRONTEND_DIST / "assets"),
        name="assets",
    )

    @app.get("/manifest.webmanifest")
    def manifest():
        return FileResponse(FRONTEND_DIST / "manifest.webmanifest")

    @app.get("/registerSW.js")
    def register_sw():
        return FileResponse(FRONTEND_DIST / "registerSW.js")

    @app.get("/sw.js")
    def service_worker():
        return FileResponse(FRONTEND_DIST / "sw.js")

    @app.get("/")
    def serve_frontend():
        return FileResponse(FRONTEND_DIST / "index.html")

# =========================
# UTILS
# =========================
def calculate_age_in_months(plantation_date: str) -> int:
    planted = datetime.strptime(plantation_date, "%Y-%m-%d")
    today = datetime.today()

    if planted > today:
        raise ValueError("Plantation date cannot be in the future.")

    return (today - planted).days // 30

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health():
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
    image_id = f"{uuid.uuid4()}.{image.filename.split('.')[-1]}"
    image_path = UPLOAD_DIR / image_id

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        # 1. Inference
        inference = run_inference(str(image_path))

        plant_part = inference.get("plant_part", "unknown")
        disease = inference.get("disease", "unknown")

        # 2. Growth stage
        age_months = calculate_age_in_months(plantation_date)
        variety = "hybrid" if "hybrid" in guava_variety.lower() else "natural"
        growth_stage = estimate_growth_stage(variety, age_months)

        # 3. Fertiliser
        fert = recommend_fertilizer(
            plant_type=plant_part,
            disease=disease,
            growth_stage=growth_stage,
            soil_type=soil_type,
            weather=weather,
        )

        return {
            "status": "success",
            "plant_type": plant_part,
            "plant_part_confidence": inference.get("plant_part_confidence"),
            "detected_disease": disease,
            "disease_confidence": inference.get("disease_confidence"),
            "growth_stage": growth_stage,
            "plant_age_months": age_months,
            "fertilizer_recommendation": fert.get("fertilizer_recommendation"),
            "reasoning": fert.get("reasoning"),
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
# LOCAL DEV
# =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000)
