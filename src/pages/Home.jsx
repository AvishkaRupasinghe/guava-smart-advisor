import React, { useState } from "react";
import { Leaf, ChevronRight, Loader2 } from "lucide-react";

import ImageUploader from "@/components/ImageUploader";
import PlantationForm from "@/components/PlantationForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { analyzeGuava } from "@/services/api";

export default function Home() {
  const [step, setStep] = useState(1);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    plantation_date: "",
    guava_variety: "",
    soil_type: "",
    weather: "",
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Language
  const { lang, setLang, t } = useLanguage();

  // -------------------------
  // IMAGE SELECT
  // -------------------------
  const handleImageSelect = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // -------------------------
  // API CALL
  // -------------------------
  const analyzeGuava = async () => {
    if (!imageFile) return;

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("image", imageFile);
      payload.append("plantation_date", formData.plantation_date);
      payload.append("guava_variety", formData.guava_variety);
      payload.append("soil_type", formData.soil_type);
      payload.append("weather", formData.weather);

      // const response = await fetch("http://127.0.0.1:8000/analyze", {
      //   method: "POST",
      //   body: payload,
      // });

      // const data = await response.json();
      const data = await analyzeGuava(payload);
      setResults(data);
      setStep(3);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-lime-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-6 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {t("appTitle")}
              </h1>
              <p className="text-green-100 text-sm">
                {t("appTagline")}
              </p>
            </div>
          </div>

          {/* Language Switch */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-white text-green-700 rounded-xl px-3 py-1 text-sm font-medium shadow"
          >
            <option value="en">English</option>
            <option value="si">සිංහල</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
      </header>

      {/* STEPS */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 ${
                    step > s ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600 px-2">
          <span>{t("uploadStep")}</span>
          <span>{t("detailsStep")}</span>
          <span>{t("resultsStep")}</span>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-lg mx-auto px-4 pb-8">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h2 className="text-xl font-semibold">
                {t("uploadTitle")}
              </h2>
              <p className="text-gray-600">
                {t("uploadSubtitle")}
              </p>
            </div>

            <ImageUploader
              onImageSelect={handleImageSelect}
              preview={imagePreview}
            />

            <Button
              disabled={!imageFile}
              onClick={() => setStep(2)}
              className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 rounded-2xl"
            >
              {t("continue")} <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h2 className="text-xl font-semibold">
                {t("plantationTitle")}
              </h2>
              <p className="text-gray-600">
                {t("plantationSubtitle")}
              </p>
            </div>

            <PlantationForm
              formData={formData}
              onChange={(field, value) =>
                setFormData((prev) => ({ ...prev, [field]: value }))
              }
              imagePreview={imagePreview}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-14 rounded-2xl"
              >
                {t("back")}
              </Button>

              <Button
                onClick={analyzeGuavaRequest}
                disabled={
                  loading ||
                  !formData.plantation_date ||
                  !formData.guava_variety ||
                  !formData.soil_type ||
                  !formData.weather
                }
                className="flex-1 h-14 bg-green-600 hover:bg-green-700 rounded-2xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("analyzing")}
                  </>
                ) : (
                  `${t("analyze")} →`
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && results && (
          <ResultsDisplay
            results={results}
            imagePreview={imagePreview}
            onReset={() => {
              setStep(1);
              setResults(null);
              setImageFile(null);
              setImagePreview(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
