import React from "react";
import { Calendar, Leaf, Mountain, CloudRain } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/i18n/LanguageContext";

export default function PlantationForm({ formData, onChange, imagePreview }) {
  const { t } = useLanguage();

  const guavaTypes = [
    { value: "Natural", label: `🌿 ${t("natural")}` },
    { value: "Hybrid", label: `🧬 ${t("hybrid")}` },
  ];

  const soilTypes = [
    { value: "Clay", label: `🧱 ${t("clay")}` },
    { value: "Loam", label: `🌱 ${t("loam")}` },
    { value: "Sandy", label: `🏜️ ${t("sandy")}` },
  ];

  const weatherConditions = [
    { value: "Dry season", label: `☀️ ${t("drySeason")}` },
    { value: "Rainy season", label: `🌧️ ${t("rainySeason")}` },
  ];

  return (
    <div className="space-y-5">
      {/* Image Preview */}
      {imagePreview && (
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl p-2 shadow border">
            <img
              src={imagePreview}
              alt="Uploaded guava"
              className="w-24 h-24 object-cover rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Plantation Date */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
          <Calendar className="w-5 h-5 text-green-600" />
          {t("plantationDate")}
        </Label>
        <Input
          type="date"
          value={formData.plantation_date}
          onChange={(e) => onChange("plantation_date", e.target.value)}
          className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-green-500 bg-white"
        />
      </div>

      {/* Guava Type */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
          <Leaf className="w-5 h-5 text-green-600" />
          {t("guavaType")}
        </Label>
        <Select
          value={formData.guava_variety}
          onValueChange={(value) => onChange("guava_variety", value)}
        >
          <SelectTrigger className="h-14 text-lg rounded-xl border-2 border-gray-200 bg-white">
            <SelectValue placeholder={t("selectGuavaType")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {guavaTypes.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                className="text-lg py-3"
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Soil Type */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
          <Mountain className="w-5 h-5 text-amber-600" />
          {t("soilType")}
        </Label>
        <Select
          value={formData.soil_type}
          onValueChange={(value) => onChange("soil_type", value)}
        >
          <SelectTrigger className="h-14 text-lg rounded-xl border-2 border-gray-200 bg-white">
            <SelectValue placeholder={t("selectSoilType")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {soilTypes.map((soil) => (
              <SelectItem
                key={soil.value}
                value={soil.value}
                className="text-lg py-3"
              >
                {soil.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Weather Condition */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
          <CloudRain className="w-5 h-5 text-blue-600" />
          {t("currentSeason")}
        </Label>
        <Select
          value={formData.weather}
          onValueChange={(value) => onChange("weather", value)}
        >
          <SelectTrigger className="h-14 text-lg rounded-xl border-2 border-gray-200 bg-white">
            <SelectValue placeholder={t("selectSeason")} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {weatherConditions.map((weather) => (
              <SelectItem
                key={weather.value}
                value={weather.value}
                className="text-lg py-3"
              >
                {weather.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
