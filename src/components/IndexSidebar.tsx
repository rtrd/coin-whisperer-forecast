
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { DynamicPredictionAdjuster } from "@/components/DynamicPredictionAdjuster";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { SentimentAnalysis } from "@/components/SentimentAnalysis";

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
  cryptoOptions
}) => {
  return (
    <div className="space-y-6">
      {/* Side Ad - Full width to match other components */}
      <div className="w-full min-h-[250px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <AdBanner width={300} height={250} position="vertical" className="w-full h-full" />
      </div>

      {/* Dynamic Prediction Adjuster */}
      <DynamicPredictionAdjuster
        selectedCrypto={selectedCrypto}
        currentPrice={currentPrice}
        priceChange={priceChange}
      />

      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
          <TabsTrigger value="technical" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
            Technical
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gray-700">
            Sentiment
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="technical">
          <TechnicalAnalysis data={cryptoData} isLoading={dataLoading} />
        </TabsContent>
        
        <TabsContent value="sentiment">
          <SentimentAnalysis crypto={selectedCrypto} />
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="bg-yellow-900/20 border-yellow-700 shadow-2xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 font-medium mb-1">Investment Disclaimer</p>
              <p className="text-xs text-yellow-300">
                AI predictions are for educational purposes only. Cryptocurrency investments carry high risk. 
                Always do your own research before making investment decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
