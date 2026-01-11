import React from "react";
import { Leaf, Activity, ShieldCheck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExpertAdvice from "@/components/ExpertAdvice";
import QuickTips from "@/components/QuickTips";
import FertilizerCard from "@/components/FertilizerCard";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ResultsDisplay({ results, imagePreview, onReset }) {
  const { t } = useLanguage();
  if (!results) return null;

  const {
    plant_type,
    detected_disease,
    disease_confidence,
    growth_stage,
    plant_age_months,
    fertilizer_recommendation,
    reasoning,
  } = results;

  const healthScore =
    detected_disease === "Healthy"
      ? 95
      : Math.max(40, Math.round(100 - disease_confidence));

  return (
    <div className="space-y-6">
      {/* TOP SUMMARY CARD */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex gap-4 items-center">
          <img
            src={imagePreview}
            alt="Guava"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white"
          />
          <div>
            <h2 className="text-xl font-bold">{t("analysisComplete")}</h2>
            <p className="text-green-100 text-sm">{t("foundText")}</p>
          </div>
        </div>

        <div className="mt-5 bg-white/20 rounded-2xl p-4 flex justify-between items-center">
          <span className="font-semibold">{t("healthScore")}</span>
          <span className="px-4 py-1 rounded-full font-bold bg-green-100 text-green-800">
            {healthScore}/100
          </span>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-2 gap-4">
        <InfoCard
          icon={<Leaf className="text-green-600" />}
          label={t("plantType")}
          value={plant_type}
        />
        <InfoCard
          icon={<Activity className="text-blue-600" />}
          label={t("growthStage")}
          value={`${growth_stage} (${plant_age_months} ${t("months")})`}
        />
      </div>

      {/* DISEASE STATUS */}
      <div className="bg-white rounded-2xl p-5 shadow border">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="text-green-600" />
          <h3 className="font-semibold">{t("diseaseStatus")}</h3>
        </div>
        <p className="text-lg font-bold text-green-600">{detected_disease}</p>
        <p className="text-sm text-gray-500">
          {t("confidence")}: {disease_confidence}%
        </p>
      </div>

      {/* FERTILIZER */}
      <FertilizerCard recommendation={fertilizer_recommendation} />

      {/* EXPERT ADVICE */}
      <ExpertAdvice
        plantType={plant_type}
        disease={detected_disease}
        weather={results.weather}
      />

      {/* QUICK TIPS */}
      <QuickTips disease={detected_disease} weather={results.weather} />

      {/* REASONING */}
      {reasoning && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900">
          <strong>{t("why")}</strong>
          <p className="mt-1">{reasoning}</p>
        </div>
      )}

      {/* RESET */}
      <Button
        onClick={onReset}
        className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-gray-800"
      >
        <RefreshCcw className="w-5 h-5 mr-2" />
        {t("analyzeAgain")}
      </Button>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow border">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        {label}
      </div>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
