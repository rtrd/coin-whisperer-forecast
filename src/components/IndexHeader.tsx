
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BicepsFlexed } from "lucide-react";

interface IndexHeaderProps {
  selectedCrypto: string;
  cryptoOptions: any[];
  currentPrice: number;
  priceChange: number;
}

export const IndexHeader: React.FC<IndexHeaderProps> = ({
  selectedCrypto,
  cryptoOptions,
  currentPrice,
  priceChange
}) => {
  console.log('IndexHeader - currentPrice:', currentPrice, 'priceChange:', priceChange);
  
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
        <BicepsFlexed className="h-12 w-12 text-blue-400" />
        PumpParade
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">PRO</Badge>
        <Link to="/subscribe">
          <Button className="ml-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Unlock Premium
          </Button>
        </Link>
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        Advanced cryptocurrency price prediction using machine learning, technical analysis, and market sentiment
      </p>
    </div>
  );
};
