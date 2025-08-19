import React, { createContext, useContext, ReactNode } from 'react';
import { useTokenPredictions } from '@/hooks/useTokenPredictions';

interface TokenPredictionsContextType {
  generatePredictionForToken: (token: any) => void;
  getPredictionForToken: (tokenId: string) => any;
  retryPrediction: (token: any) => void;
  clearAllPredictions: () => void;
  getActivePredictionsCount: () => number;
  isGenerating: (tokenId: string) => boolean;
  predictions: any;
}

const TokenPredictionsContext = createContext<TokenPredictionsContextType | undefined>(undefined);

export const TokenPredictionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tokenPredictions = useTokenPredictions();

  return (
    <TokenPredictionsContext.Provider value={tokenPredictions}>
      {children}
    </TokenPredictionsContext.Provider>
  );
};

export const useTokenPredictionsContext = () => {
  const context = useContext(TokenPredictionsContext);
  if (context === undefined) {
    throw new Error('useTokenPredictionsContext must be used within a TokenPredictionsProvider');
  }
  return context;
};