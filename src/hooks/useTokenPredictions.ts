import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { MarketData } from "@/types/crypto";
import { individualPredictionService } from "@/services/individualPredictionService";

interface PredictionState {
  [tokenId: string]: {
    predictionPercentage: number | null;
    aiScore: number | null;
    predictionStatus: 'idle' | 'loading' | 'success' | 'error';
    predictionError?: string;
    lastPredictionTime?: number;
  };
}

export const useTokenPredictions = () => {
  const [predictions, setPredictions] = useState<PredictionState>({});
  const activeRequests = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Cancel all active requests
      activeRequests.current.clear();
    };
  }, []);

  const generatePredictionForToken = useCallback(async (token: MarketData) => {
    const tokenId = token.id || token.value;
    
    // Prevent duplicate requests
    if (activeRequests.current.has(tokenId)) {
      console.log(`Prediction already in progress for ${tokenId}`);
      return;
    }

    // Check if we have a recent prediction (less than 5 minutes old)
    const existing = predictions[tokenId];
    if (existing?.predictionStatus === 'success' && existing.lastPredictionTime) {
      const timeSince = Date.now() - existing.lastPredictionTime;
      if (timeSince < 5 * 60 * 1000) { // 5 minutes
        toast.info(`Prediction for ${token.name} is still fresh (${Math.floor(timeSince / 1000)}s ago)`);
        return;
      }
    }

    activeRequests.current.add(tokenId);

    // Set loading state - only if component is still mounted
    if (mountedRef.current) {
      setPredictions(prev => ({
        ...prev,
        [tokenId]: {
          ...prev[tokenId],
          predictionStatus: 'loading',
          predictionError: undefined,
        }
      }));
    }

    try {
      console.log(`Generating prediction for ${token.name} (${tokenId})`);
      
      const result = await individualPredictionService.generateTokenPrediction(
        tokenId,
        {
          ...token,
          // Convert MarketData to CryptoToken format
          current_price: token.price,
          price_change_percentage_24h: token.change24h,
          total_volume: token.volume24h,
          market_cap: token.marketCap,
        } as any
      );

      // Update state with successful prediction - only if component is still mounted
      if (mountedRef.current) {
        setPredictions(prev => ({
          ...prev,
          [tokenId]: {
            predictionPercentage: result.predictionPercentage,
            aiScore: result.aiScore,
            predictionStatus: 'success',
            lastPredictionTime: Date.now(),
            predictionError: undefined,
          }
        }));

        toast.success(`AI prediction generated for ${token.name}!`);
      }

    } catch (error) {
      console.error(`Failed to generate prediction for ${tokenId}:`, error);
      
      // Update state with error - only if component is still mounted
      if (mountedRef.current) {
        setPredictions(prev => ({
          ...prev,
          [tokenId]: {
            ...prev[tokenId],
            predictionStatus: 'error',
            predictionError: error.message || 'Failed to generate prediction',
          }
        }));

        toast.error(`Failed to generate prediction for ${token.name}. Please try again.`);
      }
    } finally {
      activeRequests.current.delete(tokenId);
    }
  }, [predictions]);

  const getPredictionForToken = useCallback((tokenId: string) => {
    return predictions[tokenId] || {
      predictionPercentage: null,
      aiScore: null,
      predictionStatus: 'idle' as const,
    };
  }, [predictions]);

  const retryPrediction = useCallback((token: MarketData) => {
    const tokenId = token.id || token.value;
    
    // Reset error state and try again
    setPredictions(prev => ({
      ...prev,
      [tokenId]: {
        ...prev[tokenId],
        predictionStatus: 'idle',
        predictionError: undefined,
      }
    }));

    // Generate prediction
    generatePredictionForToken(token);
  }, [generatePredictionForToken]);

  const clearAllPredictions = useCallback(() => {
    setPredictions({});
    individualPredictionService.clearCache();
    activeRequests.current.clear();
  }, []);

  const getActivePredictionsCount = useCallback(() => {
    return Object.values(predictions).filter(p => p.predictionStatus === 'success').length;
  }, [predictions]);

  const isGenerating = useCallback((tokenId: string) => {
    return activeRequests.current.has(tokenId);
  }, []);

  return {
    generatePredictionForToken,
    getPredictionForToken,
    retryPrediction,
    clearAllPredictions,
    getActivePredictionsCount,
    isGenerating,
    predictions,
  };
};