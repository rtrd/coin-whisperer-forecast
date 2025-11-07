import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { AdUnit } from "@/components/ads/AdService";
import { DynamicPredictionAdjuster } from "@/components/DynamicPredictionAdjuster";
import { LockedTechnicalAnalysis } from "@/components/LockedTechnicalAnalysis";
import { LockedSentimentAnalysis } from "@/components/LockedSentimentAnalysis";
import { fetchSentimentData, fetchTechnicalIndicators } from "@/services/aiPredictionService";
import { calculateMACD } from "@/utils/technicalAnalysis";

interface IndexSidebarProps {
  selectedCrypto: string;
  currentPrice: number;
  priceChange: number;
  cryptoData: any;
  dataLoading: boolean;
  cryptoOptions: any[];
}

export const IndexSidebar: React.FC<IndexSidebarProps> = ({
  selectedCrypto,
  currentPrice,
  priceChange,
  cryptoData,
  dataLoading,
  cryptoOptions,
}) => {
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [volumeData, setVolumeData] = useState<{ label: string; value: number }[]>([]);
  const [macdData, setMacdData] = useState<{ label: string; value: number }[]>([]);

  // Fetch real sentiment data
  useEffect(() => {
    const loadSentiment = async () => {
      try {
        const data = await fetchSentimentData(selectedCrypto);
        if (data?.data) {
          setSentimentData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch sentiment data:", error);
      }
    };
    
    loadSentiment();
  }, [selectedCrypto]);

  // Fetch real technical data
  useEffect(() => {
    const loadTechnicalData = async () => {
      try {
        const technicalData = await fetchTechnicalIndicators(selectedCrypto, "3m");
        
        if (technicalData && technicalData.length > 0) {
          // Extract volume data
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

          // Calculate MACD histogram
          const prices = technicalData.map((d: any) => d.price).filter((p: number) => p > 0);
          if (prices.length >= 26) {
            const recentPrices = prices.slice(-14);
            const macdHistogram = recentPrices.map((_, idx: number) => {
              const priceSlice = prices.slice(0, prices.length - 14 + idx + 1);
              if (priceSlice.length >= 26) {
                const { macd, signal } = calculateMACD(priceSlice);
                return {
                  label: volumes[idx]?.label || `D${idx + 1}`,
                  value: macd - signal,
                };
              }
              return { label: `D${idx + 1}`, value: 0 };
            });
            setMacdData(macdHistogram);
          }
        }
      } catch (error) {
        console.error("Failed to fetch technical data:", error);
      }
    };
    
    loadTechnicalData();
  }, [selectedCrypto]);
  return (
    <div className="space-y-6">
      {/* Side Ad - Full width to match other components */}
      <div className="w-full min-h-[250px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <AdUnit type="sidebar" className="w-full h-full ad-click" />
      </div>

      {/* Dynamic Prediction Adjuster */}
      <DynamicPredictionAdjuster
        selectedCrypto={selectedCrypto}
        currentPrice={currentPrice}
        priceChange={priceChange}
      />

      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
          <TabsTrigger
            value="technical"
            className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700"
          >
            Technical
          </TabsTrigger>
          <TabsTrigger
            value="sentiment"
            className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700"
          >
            Sentiment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technical">
          <LockedTechnicalAnalysis 
            data={cryptoData} 
            isLoading={dataLoading}
            volumeData={volumeData}
            macdHistogram={macdData}
          />
        </TabsContent>

        <TabsContent value="sentiment">
          <LockedSentimentAnalysis 
            crypto={selectedCrypto} 
            sentimentData={sentimentData}
          />
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="bg-yellow-900/20 border-yellow-700 shadow-2xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 font-medium mb-1">
                Investment Disclaimer
              </p>
              <p className="text-xs text-yellow-300">
                AI predictions are for educational purposes only. Cryptocurrency
                investments carry high risk. Always do your own research before
                making investment decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
