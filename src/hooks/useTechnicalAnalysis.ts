import { useMemo } from "react";
import {
  generateTechnicalIndicators,
  calculateOverallSignal,
  calculateSupportResistance,
  TechnicalIndicator
} from "@/utils/technicalIndicators";

interface PriceData {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface TechnicalAnalysisData {
  indicators: TechnicalIndicator[];
  overallSignal: number;
  overallTrend: "buy" | "sell" | "neutral";
  supportLevel: number;
  resistanceLevel: number;
}

export const useTechnicalAnalysis = (data: PriceData[] | null): TechnicalAnalysisData | null => {
  return useMemo(() => {
    if (!data || data.length === 0) return null;

    const prices = data.map((d) => d.price);
    const indicators = generateTechnicalIndicators(prices);
    const { overallSignal, overallTrend } = calculateOverallSignal(indicators);
    const { supportLevel, resistanceLevel } = calculateSupportResistance(prices);

    return {
      indicators,
      overallSignal,
      overallTrend: overallTrend as "buy" | "sell" | "neutral",
      supportLevel,
      resistanceLevel,
    };
  }, [data]);
};