import React, { createContext, useContext, ReactNode, useCallback, useRef, useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useTokenPredictions } from '@/hooks/useTokenPredictions';
import { MarketData } from '@/types/crypto';

// Consolidated context for all app-level state
interface ConsolidatedAppContextType {
  // Token Predictions
  generatePredictionForToken: (token: MarketData) => Promise<void>;
  getPredictionForToken: (tokenId: string) => any;
  retryPrediction: (token: MarketData) => void;
  clearAllPredictions: () => void;
  getActivePredictionsCount: () => number;
  isGenerating: (tokenId: string) => boolean;
  predictions: any;
  
  // Data Management
  registerDataFetcher: (key: string, fetcher: () => Promise<any>) => void;
  unregisterDataFetcher: (key: string) => void;
  isDataLoading: (key: string) => boolean;
  
  // Error Handling
  reportError: (error: Error, context?: string) => void;
  clearErrors: () => void;
  errors: Array<{ id: string; error: Error; context?: string; timestamp: number }>;
}

const ConsolidatedAppContext = createContext<ConsolidatedAppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(ConsolidatedAppContext);
  if (!context) {
    throw new Error('useAppContext must be used within ConsolidatedAppProvider');
  }
  return context;
};

interface ConsolidatedAppProviderProps {
  children: ReactNode;
}

export const ConsolidatedAppProvider: React.FC<ConsolidatedAppProviderProps> = ({ children }) => {
  const tokenPredictions = useTokenPredictions();
  const [errors, setErrors] = useState<Array<{ id: string; error: Error; context?: string; timestamp: number }>>([]);
  
  // Data fetcher management
  const fetchersRef = useRef<Map<string, () => Promise<any>>>(new Map());
  const loadingStatesRef = useRef<Map<string, boolean>>(new Map());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const registerDataFetcher = useCallback((key: string, fetcher: () => Promise<any>) => {
    fetchersRef.current.set(key, fetcher);
  }, []);

  const unregisterDataFetcher = useCallback((key: string) => {
    const controller = abortControllersRef.current.get(key);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(key);
    }
    
    fetchersRef.current.delete(key);
    loadingStatesRef.current.delete(key);
  }, []);

  const isDataLoading = useCallback((key: string) => {
    return loadingStatesRef.current.get(key) || false;
  }, []);

  const reportError = useCallback((error: Error, context?: string) => {
    const errorEntry = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      error,
      context,
      timestamp: Date.now()
    };
    
    setErrors(prev => [...prev.slice(-4), errorEntry]); // Keep last 5 errors
    console.error('App Error:', error, context);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Enhanced prediction wrapper with error handling
  const generatePredictionForToken = useCallback(async (token: MarketData) => {
    try {
      await tokenPredictions.generatePredictionForToken(token);
    } catch (error) {
      reportError(error as Error, `Token prediction for ${token.name}`);
      throw error;
    }
  }, [tokenPredictions.generatePredictionForToken, reportError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllersRef.current.forEach(controller => controller.abort());
      abortControllersRef.current.clear();
      fetchersRef.current.clear();
      loadingStatesRef.current.clear();
    };
  }, []);

  const contextValue: ConsolidatedAppContextType = {
    // Token Predictions
    generatePredictionForToken,
    getPredictionForToken: tokenPredictions.getPredictionForToken,
    retryPrediction: tokenPredictions.retryPrediction,
    clearAllPredictions: tokenPredictions.clearAllPredictions,
    getActivePredictionsCount: tokenPredictions.getActivePredictionsCount,
    isGenerating: tokenPredictions.isGenerating,
    predictions: tokenPredictions.predictions,
    
    // Data Management
    registerDataFetcher,
    unregisterDataFetcher,
    isDataLoading,
    
    // Error Handling
    reportError,
    clearErrors,
    errors,
  };

  return (
    <ErrorBoundary>
      <ConsolidatedAppContext.Provider value={contextValue}>
        {children}
      </ConsolidatedAppContext.Provider>
    </ErrorBoundary>
  );
};