import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ExpertAdvice({ plantType, disease, weather }) {
  const { t } = useLanguage();
  if (!disease) return null;

  let adviceKey = "adviceGeneric";

  if (disease === "Healthy") {
    adviceKey = "adviceHealthy";
  } else if (disease === "Anthracnose") {
    adviceKey =
      weather === "Rainy season"
        ? "adviceAnthracnoseRainy"
        : "adviceAnthracnoseDry";
  } else if (disease === "FruitFly") {
    adviceKey = "adviceFruitFly";
  } else if (disease === "Canker") {
    adviceKey = "adviceCanker";
  }

  const adviceText = t(adviceKey).replace(
    "{plant}",
    plantType?.toLowerCase() || "plant"
  );

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="bg-amber-500 p-2 rounded-xl">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-amber-900 mb-1">
            {t("expertAdviceTitle")}
          </h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            {adviceText}
          </p>
        </div>
      </div>
    </div>
  );
}
