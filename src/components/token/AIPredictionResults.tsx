import React from "react";
import { formatPrice } from "@/components/MarketDataUtils";

interface AIPredictionResultsProps {
  prediction: any;
  cryptoId: string;
  modelType: string;
  predictionDays: number;
  currentPrice: number;
}

export const AIPredictionResults: React.FC<AIPredictionResultsProps> = ({
  prediction,
  cryptoId,
  modelType,
  predictionDays,
  currentPrice,
}) => {
  if (!prediction) return null;

  // Helper function to safely get predicted price
  const getLastPredictedPrice = () => {
    if (!prediction.predictions || prediction.predictions.length === 0)
      return null;
    const lastPrediction =
      prediction.predictions[prediction.predictions.length - 1];
    const price = lastPrediction?.predictedPrice;
    // Handle the case where predictedPrice is an object with _type: "undefined"
    if (typeof price === "object" && price?._type === "undefined") return null;
    return typeof price === "number" && !isNaN(price) ? price : null;
  };

  const predictedPrice = getLastPredictedPrice();

  console.log({
    predictedPrice,
    currentPrice,
    change: predictedPrice
      ? ((predictedPrice - currentPrice) / currentPrice) * 100
      : NaN,
  });

  return (
    <div className="mt-6 pt-6 border-t border-purple-400/30">
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-5 border border-purple-400/40">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
          <span className="text-purple-300 font-bold text-lg">
            Active Prediction
          </span>
        </div>

        {/* AI Generated Overview */}
        <div className="mb-5 p-4 bg-gray-800/60 rounded-lg border border-gray-600/50">
          <p className="text-gray-200 text-base leading-relaxed">
            Based on our {modelType} analysis model, {cryptoId.toUpperCase()}{" "}
            shows{" "}
            {prediction.predictions &&
            prediction.predictions.length > 0 &&
            predictedPrice != null
              ? ((predictedPrice - currentPrice) / currentPrice) * 100 >= 0
                ? "bullish"
                : "bearish"
              : "neutral"}{" "}
            momentum for the next {predictionDays} days.
            {prediction.predictions &&
              prediction.predictions.length > 0 &&
              predictedPrice != null && (
                <>
                  {" "}
                  The model predicts a price target of{" "}
                  {formatPrice(predictedPrice)}, representing a{" "}
                  {(
                    ((predictedPrice - currentPrice) / currentPrice) *
                    100
                  ).toFixed(2)}
                  % change from current levels. Key factors driving this
                  forecast include technical indicators and market sentiment
                  patterns with{" "}
                  {(
                    prediction.predictions[prediction.predictions.length - 1]
                      .confidence * 100
                  ).toFixed(0)}
                  % confidence.
                </>
              )}
          </p>
        </div>

        {/* Organized Data Grid - 2 rows of 4 */}
        <div className="space-y-4 mb-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-600/30">
              <div className="text-gray-400 text-sm font-medium mb-1">
                Asset
              </div>
              <div className="text-white font-bold text-lg uppercase tracking-wide">
                {cryptoId}
              </div>
            </div>

            <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-600/30">
              <div className="text-gray-400 text-sm font-medium mb-1">
                Timeline
              </div>
              <div className="text-blue-400 font-bold text-lg">
                {predictionDays} Days
              </div>
            </div>

            <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-600/30">
              <div className="text-gray-400 text-sm font-medium mb-1">
                Model
              </div>
              <div className="text-purple-400 font-bold text-lg capitalize">
                {modelType}
              </div>
            </div>

            <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-600/30">
              <div className="text-gray-400 text-sm font-medium mb-1">
                Trend
              </div>
              <div className="flex justify-center">
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium w-fit ${
                    (predictedPrice - currentPrice) / currentPrice >= 0
                      ? "text-green-400 border-green-400 bg-green-500/10"
                      : "text-red-400 border-red-400 bg-red-500/10"
                  }`}
                >
                  {(predictedPrice - currentPrice) / currentPrice >= 0
                    ? "↗"
                    : "↘"}
                  <span className="capitalize">
                    {(predictedPrice - currentPrice) / currentPrice >= 0
                      ? "bullish"
                      : "bearish"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {prediction.predictions &&
            prediction.predictions.length > 0 &&
            predictedPrice != null && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-600/30">
                  <div className="text-gray-400 text-sm font-medium mb-1">
                    Confidence
                  </div>
                  <div className="text-green-400 font-bold text-lg">
                    {(
                      prediction.predictions[prediction.predictions.length - 1]
                        .confidence * 100
                    ).toFixed(0)}
                    %
                  </div>
                </div>

                <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-600/30">
                  <div className="text-gray-400 text-sm font-medium mb-1">
                    Current Price
                  </div>
                  <div className="text-gray-200 font-bold text-lg">
                    {formatPrice(currentPrice)}
                  </div>
                </div>

                <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-600/30">
                  <div className="text-gray-400 text-sm font-medium mb-1">
                    Predicted Price
                  </div>
                  <div className="text-blue-400 font-bold text-lg">
                    {formatPrice(predictedPrice)}
                  </div>
                </div>

                <div className="bg-gray-800/40 rounded-lg p-4 text-center border border-gray-600/30">
                  <div className="text-gray-400 text-sm font-medium mb-1">
                    Expected Change
                  </div>
                  <div
                    className={`font-bold text-lg flex items-center justify-center gap-1 ${
                      ((predictedPrice - currentPrice) / currentPrice) * 100 >=
                      0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    <>
                      {((predictedPrice - currentPrice) / currentPrice) * 100 >=
                      0
                        ? "↗"
                        : "↘"}
                      {(() => {
                        const percentChange = Math.abs(
                          ((predictedPrice - currentPrice) / currentPrice) * 100
                        );
                        if (percentChange < 0.0001)
                          return percentChange.toFixed(6);
                        if (percentChange < 0.01)
                          return percentChange.toFixed(4);
                        return percentChange.toFixed(2);
                      })()}
                      %
                    </>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Key Factors */}
        {prediction.factors && prediction.factors.length > 0 && (
          <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-600/50">
            <h4 className="text-white font-semibold mb-3">
              Key Prediction Factors
            </h4>
            <div className="space-y-2">
              {prediction.factors
                .slice(0, 3)
                .map((factor: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          factor.impact === "positive"
                            ? "bg-green-400"
                            : factor.impact === "negative"
                            ? "bg-red-400"
                            : "bg-yellow-400"
                        }`}
                      />
                      <span className="text-white">{factor.name}</span>
                    </div>
                    <span className="text-gray-400 font-medium">
                      {factor.weight.toFixed(0)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
