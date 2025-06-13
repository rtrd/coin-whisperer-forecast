
import React, { createContext, useContext, ReactNode } from 'react';
import { SelectedTokenInfo } from '@/types/tokenAnalysis';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { useSelectedToken } from '@/hooks/useSelectedToken';
import { getCoinGeckoId } from '@/utils/tokenMapping';

interface TokenContextType {
  selectedToken: SelectedTokenInfo | undefined;
  tokenInfo: any;
  tokenInfoLoading: boolean;
  tokenInfoError: any;
  coinGeckoId: string;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

interface TokenProviderProps {
  children: ReactNode;
  tokenId: string;
  cryptoOptions?: any[];
}

export const TokenProvider: React.FC<TokenProviderProps> = ({
  children,
  tokenId,
  cryptoOptions = []
}) => {
  const coinGeckoId = getCoinGeckoId(tokenId);
  const { data: tokenInfo, isLoading: tokenInfoLoading, error: tokenInfoError } = useTokenInfo(coinGeckoId);
  const selectedToken = useSelectedToken(tokenId, tokenInfo, cryptoOptions);

  return (
    <TokenContext.Provider value={{
      selectedToken,
      tokenInfo,
      tokenInfoLoading,
      tokenInfoError,
      coinGeckoId
    }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
