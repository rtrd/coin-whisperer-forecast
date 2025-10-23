
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
  
  return (
    <div className="text-center mb-8">
      {/* Main Header - Single H1 for SEO */}
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
        <BicepsFlexed className="h-8 w-8 md:h-12 md:w-12 text-blue-400" />
        PumpParade
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs md:text-sm">PRO</Badge>
      </h1>
      
      {/* CTA Button */}
      <div className="mb-6">
        <Link to="/subscribe">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full max-w-xs md:w-auto">
            Unlock Premium
          </Button>
        </Link>
      </div>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        AI-powered crypto market analysis tools that help you spot trends, assess risk, and execute the right crypto trading strategy.
      </p>
    </div>
  );
};
