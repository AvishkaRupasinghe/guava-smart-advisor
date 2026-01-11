import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function QuickTips({ disease, weather }) {
  const { t } = useLanguage();
  const tips = [];

  if (disease !== "Healthy") {
    tips.push(t("tipInspect"));
  }

  if (weather === "Rainy season") {
    tips.push(t("tipDrainage"));
    tips.push(t("tipNoStagnation"));
  }

  if (weather === "Dry season") {
    tips.push(t("tipWatering"));
    tips.push(t("tipMulching"));
  }

  tips.push(t("tipCleanTools"));
  tips.push(t("tipRemoveDebris"));

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        💡 {t("quickTipsTitle")}
      </h4>

      <ul className="space-y-3">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <span className="text-sm text-gray-700">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
