import { Beaker, Scale, Clock, FileText } from "lucide-react";

export default function FertilizerCard({ recommendation }) {
  if (!recommendation) return null;

  const details = [
    {
      icon: Beaker,
      label: "Fertilizer Type",
      value: recommendation.type,
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: Scale,
      label: "Quantity",
      value: recommendation.quantity,
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Clock,
      label: "Frequency",
      value: recommendation.frequency,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-600 p-2 rounded-xl">
          <Beaker className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Fertilizer Recommendation
        </h3>
      </div>

      {/* Main details */}
      <div className="space-y-3">
        {details.map(
          (detail, index) =>
            detail.value && (
              <div
                key={index}
                className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div className={`p-2 rounded-lg ${detail.color}`}>
                  <detail.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {detail.label}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {detail.value}
                  </p>
                </div>
              </div>
            )
        )}

        {/* Application notes */}
        {recommendation.application_notes && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  How to Apply
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {recommendation.application_notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

