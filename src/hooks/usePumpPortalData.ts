import { useState, useEffect, useRef } from 'react';

export interface PumpToken {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  icon: string;
  pumpScore: number;
  contractAddress?: string;
}

interface TokenTradeEvent {
  signature: string;
  mint: string;
  sol_amount: number;
  token_amount: number;
  is_buy: boolean;
  user: string;
  timestamp: number;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
}

interface NewTokenEvent {
  signature: string;
  mint: string;
  traderPublicKey: string;
  txType: string;
  initialBuy: number;
  bondingCurveKey: string;
  vTokensInBondingCurve: number;
  vSolInBondingCurve: number;
  marketCapSol: number;
  name: string;
  symbol: string;
  description: string;
  image: string;
  metadata: any;
  timestamp: number;
}

export const usePumpPortalData = () => {
  const [newLaunches, setNewLaunches] = useState<PumpToken[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const tokenDataMap = useRef<Map<string, PumpToken>>(new Map());

  const calculatePumpScore = (token: PumpToken): number => {
    // Calculate pump score based on volume, market cap, and 24h change
    const volumeScore = Math.min(token.volume / 1000000 * 2, 3); // Max 3 points for volume
    const marketCapScore = Math.min(token.marketCap / 10000000 * 2, 3); // Max 3 points for market cap
    const changeScore = Math.min(Math.abs(token.change24h) / 100 * 4, 4); // Max 4 points for change
    
    return Math.min(volumeScore + marketCapScore + changeScore, 10);
  };

  const getRandomIcon = (): string => {
    const icons = ['🚀', '🌙', '💎', '⚡', '🔥', '⭐', '🌟', '💫', '🎯', '🏆', '💰', '📈', '🎪', '🎨', '🎭'];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  const processNewToken = (data: NewTokenEvent) => {
    const price = data.vSolInBondingCurve / data.vTokensInBondingCurve;
    const marketCapUSD = data.marketCapSol * 150; // Rough SOL to USD conversion
    
    const token: PumpToken = {
      name: data.name || `Token ${data.symbol}`,
      symbol: data.symbol,
      price: price,
      change24h: 0, // New token, no 24h data yet
      volume: data.initialBuy * 150, // Convert SOL to USD
      marketCap: marketCapUSD,
      icon: getRandomIcon(),
      pumpScore: 5.0, // Start with neutral score for new tokens
      contractAddress: data.mint
    };

    tokenDataMap.current.set(data.mint, token);
    
    setNewLaunches(prev => {
      const updated = [token, ...prev.slice(0, 7)];
      return updated;
    });
  };

  const processTokenTrade = (data: TokenTradeEvent) => {
    const existingToken = tokenDataMap.current.get(data.mint);
    if (!existingToken) return;

    // For new launches, we mainly care about volume updates
    const newPrice = data.virtual_sol_reserves / data.virtual_token_reserves;
    const priceChange = ((newPrice - existingToken.price) / existingToken.price) * 100;
    
    const updatedToken: PumpToken = {
      ...existingToken,
      price: newPrice,
      change24h: priceChange,
      volume: existingToken.volume + (data.sol_amount * 150), // Add trade volume
      marketCap: newPrice * 1000000000 * 150, // Rough calculation
    };

    updatedToken.pumpScore = calculatePumpScore(updatedToken);
    tokenDataMap.current.set(data.mint, updatedToken);

    // Update the new launches list with the updated token data
    setNewLaunches(prev => 
      prev.map(token => 
        token.contractAddress === data.mint ? updatedToken : token
      )
    );
  };

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket('wss://pumpportal.fun/api/data');
        
        ws.current.onopen = () => {
          console.log('Connected to PumpPortal WebSocket');
          setIsConnected(true);
          setError(null);
          
          if (ws.current) {
            // Subscribe to new tokens
            ws.current.send(JSON.stringify({
              method: "subscribeNewToken"
            }));
            
            // Subscribe to migrations
            ws.current.send(JSON.stringify({
              method: "subscribeMigration"
            }));
          }
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.txType === 'create') {
              processNewToken(data);
            } else if (data.txType === 'buy' || data.txType === 'sell') {
              processTokenTrade(data);
            }
          } catch (err) {
            console.error('Error processing WebSocket message:', err);
          }
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('Connection error occurred');
          setIsConnected(false);
        };

        ws.current.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          setIsConnected(false);
          
          // Reconnect after 5 seconds if not intentional close
          if (event.code !== 1000) {
            setTimeout(connectWebSocket, 5000);
          }
        };

      } catch (err) {
        console.error('Failed to create WebSocket connection:', err);
        setError('Failed to connect to data source');
      }
    };

    connectWebSocket();

    // Cleanup function
    return () => {
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting');
      }
    };
  }, []);

  return {
    newLaunches,
    isConnected,
    error
  };
};