import { useState } from "react";
import { toast } from "sonner";
import {
  PriceData,
  PredictionResult,
  AIPredictionResponse,
} from "@/types/prediction";
import { generateAIPrediction } from "@/services/aiPredictionService";
import { useCryptoData } from "@/hooks/useCryptoData";

export const usePrediction = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePrediction = async (
    data: PriceData[],
    crypto: string,
    predictionDays: number,
    modelType: string = "technical",
    technicalIndicator?: any,
    sentimentData?: any[], // Optional sentiment data for future use
    Alltokenmarketstats?: any
  ): Promise<void> => {  
    setIsLoading(true);
    try {
      console.log(
        "Generating AI prediction for",
        crypto,
        "with",
        predictionDays,
        "days, model:",
        modelType
      );
      const result = await generateAIPrediction(
        data,
        crypto,
        predictionDays,
        modelType,
        technicalIndicator,
        sentimentData,
        Alltokenmarketstats
      );
      setPrediction(result);
      console.log("AI Prediction generated:", result);
    } catch (error) {
      console.error("Prediction generation failed:", error);
      toast.error("Failed to generate AI prediction");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prediction,
    isLoading,
    generatePrediction,
  };
};
