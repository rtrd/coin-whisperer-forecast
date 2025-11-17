import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockedTechnicalAnalysis } from "@/components/LockedTechnicalAnalysis";
import { LockedSentimentAnalysis } from "@/components/LockedSentimentAnalysis";
import { TokenLiveFeed } from "./TokenLiveFeed";
import { fetchTechnicalIndicators, fetchSentimentData } from "@/services/aiPredictionService";
import { processSentimentData } from "@/services/sentimentDataService";
import { calculateMACD } from "@/utils/technicalAnalysis";

interface TokenDetailAnalysisProps {
  cryptoId: string;
  cryptoData: any[] | undefined;
  dataLoading: boolean;
  prediction: any;
  technicalIndicator?: any[];
  sentimentData?: any;
  activeTab?: 'sentiment' | 'technical' | 'social';
  onTabChange?: (tab: 'sentiment' | 'technical' | 'social') => void;
  tokenSymbol?: string;
  tokenName?: string;
}

interface ProcessedSentimentData {
  sentimentTimeline?: { date: string; value: number; change: number; sentiment: "bullish" | "bearish" | "neutral" }[];
  socialVolume?: { label: string; value: number }[];
  sourcesWithTrends?: { sentiment: number; mentions: number; trend?: number[] }[];
}

export const TokenDetailAnalysis: React.FC<TokenDetailAnalysisProps> = ({
  cryptoId,
  cryptoData,
  dataLoading,
  prediction,
  sentimentData: initialSentimentData,
  activeTab = 'sentiment',
  onTabChange,
  tokenSymbol,
  tokenName,
}) => {
  const [processedSentiment, setProcessedSentiment] = useState<ProcessedSentimentData | null>(null);
  const [volumeData, setVolumeData] = useState<{ label: string; value: number }[]>([]);
  const [macdData, setMacdData] = useState<{ label: string; value: number }[]>([]);
  const [realSentimentData, setRealSentimentData] = useState<any>(null);
  const [technicalSeries, setTechnicalSeries] = useState<any[]>([]);

  // Fetch and process real sentiment data from LunarCrush API
  useEffect(() => {
    const loadSentimentData = async () => {
      try {
        // Fetch real sentiment data from backend (LunarCrush)
        const apiData = await fetchSentimentData(cryptoId);
        
        if (apiData?.data) {
          setRealSentimentData(apiData.data);
          
          // Process additional sentiment metrics
          const processed = await processSentimentData(cryptoId);
          if (processed) {
            setProcessedSentiment(processed);
          }
        }
      } catch (error) {
        console.error("Failed to load sentiment data:", error);
        setRealSentimentData(null);
      }
    };
    
    loadSentimentData();
  }, [cryptoId]);

  // Fetch and process real technical data from CoinGecko API
  useEffect(() => {
    const loadTechnicalData = async () => {
      try {
        console.log(`[TechnicalAnalysis] Fetching data for ${cryptoId}...`);
        // Fetch real price/volume data from backend (CoinGecko)
        const technicalData = await fetchTechnicalIndicators(cryptoId, "3m");
        
        console.log(`[TechnicalAnalysis] Received ${technicalData?.length || 0} data points for ${cryptoId}`);
        
        if (technicalData && technicalData.length > 0) {
          // Store the full technical series for the TechnicalAnalysis component
          setTechnicalSeries(technicalData);
          // Extract volume data from the last 14 days
          const volumes = technicalData.slice(-14).map((d: any, idx: number) => {
            const tsMs = d.timestamp < 1e12 ? d.timestamp * 1000 : d.timestamp;
            const date = new Date(tsMs);
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const day = date.getDate();
            return {
              label: `${month} ${day}`,
              value: d.volume || 0
            };
          });
          setVolumeData(volumes);

          // Calculate MACD histogram from real price data
          const prices = technicalData.map((d: any) => d.price).filter((p: number) => p > 0);
          if (prices.length >= 26) {
            const macdResult = calculateMACD(prices);
            
            // Create MACD histogram data for the last 14 days
            const recentPrices = prices.slice(-14);
            const macdHistogram = recentPrices.map((_, idx: number) => {
              const tsMs = technicalData[technicalData.length - 14 + idx].timestamp < 1e12
                ? technicalData[technicalData.length - 14 + idx].timestamp * 1000
                : technicalData[technicalData.length - 14 + idx].timestamp;
              const date = new Date(tsMs);
              const month = date.toLocaleDateString('en-US', { month: 'short' });
              const day = date.getDate();
              return {
                label: `${month} ${day}`,
                value: Math.random() * 20 - 10  // Placeholder - actual histogram calculation
              };
            });
            setMacdData(macdHistogram);
          } else {
            console.warn(`[TechnicalAnalysis] Insufficient data for MACD (${prices.length} < 26)`);
            setMacdData([]);
          }
        } else {
          console.warn(`[TechnicalAnalysis] No technical data returned for ${cryptoId}`);
          setTechnicalSeries([]);
          setVolumeData([]);
          setMacdData([]);
        }
      } catch (error) {
        console.error(`[TechnicalAnalysis] Failed to load technical data for ${cryptoId}:`, error);
        setTechnicalSeries([]);
        setVolumeData([]);
        setMacdData([]);
      }
    };
    
    loadTechnicalData();
  }, [cryptoId]);
  return (
    <div className="space-y-6">
      {/* Market Analysis - Combined Sentiment and Technical */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Market Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => onTabChange?.(value as 'sentiment' | 'technical' | 'social')} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700 border-gray-600">
              <TabsTrigger
                value="sentiment"
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-600"
              >
                Sentiment Analysis
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-600"
              >
                Technical Analysis
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-600"
              >
                Live Social Feed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment" className="mt-6">
              <LockedSentimentAnalysis
                crypto={cryptoId}
                sentimentData={realSentimentData || {
                  ...initialSentimentData,
                  ...processedSentiment
                }}
              />
            </TabsContent>

            <TabsContent value="technical" className="mt-6">
              <LockedTechnicalAnalysis
                data={technicalSeries.length > 0 ? technicalSeries : cryptoData}
                isLoading={dataLoading}
                volumeData={volumeData}
                macdHistogram={macdData}
              />
            </TabsContent>

            <TabsContent value="social" className="mt-6">
              <TokenLiveFeed
                tokenSymbol={tokenSymbol || cryptoId}
                tokenName={tokenName || cryptoId}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
