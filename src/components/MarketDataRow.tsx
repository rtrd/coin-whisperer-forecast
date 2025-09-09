import React, { memo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, formatVolume, formatMarketCap } from "./MarketDataUtils";
import { getTokenUrlId } from "@/utils/tokenMapping";
import { getCategoryBadgeStyle } from "@/utils/categoryStyles";
import { CryptoToken, MarketData } from "@/types/crypto";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { usePrediction } from "@/hooks/usePrediction";
import { toast } from "sonner";
import { fetchTechnicalIndicators } from "@/services/aiPredictionService";
import { PriceData } from "@/types/crypto";
interface MarketDataRowProps {
  token: MarketData;
  index: number;
  isUnlocked: boolean;
  activeFilter: string;
  AllCryptosData: CryptoToken[];
}

export const MarketDataRow: React.FC<MarketDataRowProps> = memo(
  ({ token, index, isUnlocked, AllCryptosData }) => {
    const [prediction, setPrediction] = useState<{
      predictions: any[];
      accuracy?: number;
    } | null>(null);
    const [lastPredictedPrice, setLastPredictedPrice] = React.useState<
      number | null
    >(null);
    // Derive tokenUrlId from token value
    const tokenUrlId = getTokenUrlId(token.value);
    const { isLoading: predictionLoading, generatePrediction } =
      usePrediction();

    const getData = async (cryptoId) => {
      try {
        const response = await fetchTechnicalIndicators(cryptoId, "1m"); // or any topic
        console.log("Fetched technical indicators:", response);
        const prices = response.map((d) => d.price);
        if (prices[0] == undefined) {
          const data = generateMockData(cryptoId, "1m", AllCryptosData);
          return data;
        } else {
          return response;
        }
      } catch (error) {
        console.error("Error fetching technical indicators:", error);
      }
    };

    const handlePredict = async (rowToken: any) => {
      debugger;
      if (!AllCryptosData) {
        return;
      }
      const technicalIndicator = await getData(rowToken.id);
      const predictionResult = await generatePrediction(
        null,
        rowToken.id,
        30,
        "technical",
        technicalIndicator,
        null,
        AllCryptosData
      );
      setPrediction(predictionResult);
      const lastPrediction =
        predictionResult?.predictions?.[
          predictionResult.predictions.length - 1
        ];
      const price = lastPrediction?.predictedPrice ?? null;

      setLastPredictedPrice(price);

      console.log("Prediction triggered for:", predictionResult);
    };

    const generateMockData = (
      crypto: string,
      timeframe: string,
      AllCryptosData: any[]
    ): PriceData[] => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // normalize to midnight

      // Normalize timeframe
      const normalizedTimeframe =
        timeframe === "7d"
          ? "1w"
          : timeframe === "30d"
          ? "1m"
          : timeframe === "90d"
          ? "3m"
          : timeframe;

      const days =
        normalizedTimeframe === "1d"
          ? 1
          : normalizedTimeframe === "1w"
          ? 7
          : normalizedTimeframe === "1m"
          ? 30
          : 90;

      const pointsPerDay = days === 1 ? 24 : 1;
      const totalPoints = days * pointsPerDay;

      const intervalSec = (24 * 60 * 60) / pointsPerDay; // seconds between points
      const nowSec = Math.floor(now.getTime() / 1000); // now in seconds

      // Get base price
      const basePrices: { [key: string]: number } = {};
      AllCryptosData.forEach((token) => {
        const { id, current_price } = token;
        if (typeof current_price === "number" && !isNaN(current_price)) {
          basePrices[id] = current_price;
        }
      });

      const basePrice = basePrices[crypto] || 1.0;
      let currentPrice = basePrice;
      const data: PriceData[] = [];

      for (let i = 0; i < totalPoints; i++) {
        const timestamp = nowSec - (totalPoints - 1 - i) * intervalSec;

        // Volatility logic
        let volatility = 0.02;
        if (
          crypto.includes("shiba") ||
          crypto.includes("pepe") ||
          crypto.includes("bonk") ||
          crypto.includes("floki")
        ) {
          volatility = 0.08;
        } else if (
          crypto.includes("tether") ||
          crypto.includes("usd-coin") ||
          crypto.includes("dai")
        ) {
          volatility = 0.001;
        } else if (crypto === "bitcoin" || crypto === "ethereum") {
          volatility = 0.015;
        }

        const change = (Math.random() - 0.5) * volatility;
        currentPrice *= 1 + change;

        // Trend logic
        let trend = 0.0001;
        if (
          crypto.includes("ai") ||
          crypto.includes("fetch") ||
          crypto.includes("singularity") ||
          crypto.includes("render")
        ) {
          trend = 0.0003;
        } else if (
          crypto.includes("meme") ||
          crypto.includes("doge") ||
          crypto.includes("shib") ||
          crypto.includes("pepe")
        ) {
          trend = (Math.random() - 0.5) * 0.0005;
        }

        currentPrice *= 1 + trend;

        data.push({
          timestamp,
          price: Math.max(currentPrice, 0.0000001),
          volume:
            Math.random() *
            (basePrice > 100
              ? 100_000_000
              : basePrice > 1
              ? 1_000_000_000
              : 10_000_000_000),
        });
      }

      return data;
    };
    return (
      <TableRow className="border-gray-700 hover:bg-gray-700/50 h-16">
        <TableCell className="text-gray-300 font-medium w-12 px-2 py-3">
          {index + 1}
        </TableCell>
        <TableCell className="w-48 px-2 py-3">
          <Link
            to={`/token/${tokenUrlId}`}
            state={{ token, AllCryptosData }}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors"
          >
            <img
              src={token.image}
              alt={token.label}
              className="w-8 h-8 object-contain rounded-full flex-shrink-0"
            />
            <div>
              <div className="text-white font-medium truncate">
                {token.name}
              </div>
              <div className="text-gray-400 text-sm">
                {token.symbol.toUpperCase()}
              </div>
            </div>
          </Link>
        </TableCell>

        <TableCell className="text-white font-mono w-32 px-2 py-3">
          {formatPrice(token.price)}
        </TableCell>

        <TableCell className="w-32 px-2 py-3">
          <div
            className={`flex items-center gap-1 ${
              token.change24h >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {token.change24h >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {token.change24h >= 0 ? "+" : ""}
            {token.change24h.toFixed(2)}%
          </div>
        </TableCell>

        <TableCell className="w-32 px-2 py-3">
          <div
            className={`flex items-center gap-1 ${
              !token.price_change_percentage_7d_in_currency
                ? "text-gray-400"
                : token.price_change_percentage_7d_in_currency >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {!token.price_change_percentage_7d_in_currency ? (
              "-"
            ) : (
              <>
                {token.price_change_percentage_7d_in_currency >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {token.price_change_percentage_7d_in_currency >= 0 ? "+" : ""}
                {token.price_change_percentage_7d_in_currency.toFixed(2)}%
              </>
            )}
          </div>
        </TableCell>

        <TableCell className="w-32 px-2 py-3">
          <div
            className={`flex items-center gap-1 ${
              !token.price_change_percentage_30d_in_currency
                ? "text-gray-400"
                : token.price_change_percentage_30d_in_currency >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {!token.price_change_percentage_30d_in_currency ? (
              "-"
            ) : (
              <>
                {token.price_change_percentage_30d_in_currency >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {token.price_change_percentage_30d_in_currency >= 0 ? "+" : ""}
                {token.price_change_percentage_30d_in_currency.toFixed(2)}%
              </>
            )}
          </div>
        </TableCell>
        <TableCell className="text-white font-mono w-64 px-2 py-3">
          {isUnlocked == false ? (
            <div className="flex justify-center items-center h-full">
              <Lock className="h-8 w-8 text-yellow-400" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Button */}
              <Button
                onClick={() => handlePredict(token)}
                className="py-4 h-6 px-2 bg-gradient-to-r from-purple-600 to-blue-600 
                   hover:from-purple-700 hover:to-blue-700 
                   text-white font-semibold text-sm shadow-xl hover:shadow-2xl 
                   transition-all duration-300 disabled:opacity-50 border border-purple-400/30"
              >
                {predictionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                    Analyzing
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-1" />
                    Predict
                  </>
                )}
              </Button>

              {/* Prediction result (only show if we have one) */}
              {lastPredictedPrice && (
                <div
                  className={`flex items-center gap-1 font-mono text-sm ${
                    ((lastPredictedPrice - token.price) / token.price) * 100 >=
                    0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {((lastPredictedPrice - token.price) / token.price) * 100 >=
                  0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {(() => {
                    const percentChange = Math.abs(
                      ((lastPredictedPrice - token.price) / token.price) * 100
                    );
                    if (percentChange < 0.0001) return percentChange.toFixed(6);
                    if (percentChange < 0.01) return percentChange.toFixed(4);
                    return percentChange.toFixed(2);
                  })()}
                  %
                </div>
              )}
            </div>
          )}
        </TableCell>
        <TableCell className="text-gray-300 font-mono w-40 px-2 py-3">
          {formatVolume(token.volume24h)}
        </TableCell>

        <TableCell className="text-gray-300 font-mono w-32 px-2 py-3">
          {formatMarketCap(token.marketCap)}
        </TableCell>

        <TableCell className="w-36 px-2 py-3">
          <Badge
            variant="outline"
            className={getCategoryBadgeStyle(token.category)}
          >
            {token.category}
          </Badge>
        </TableCell>
      </TableRow>
    );
  }
);

MarketDataRow.displayName = "MarketDataRow";
