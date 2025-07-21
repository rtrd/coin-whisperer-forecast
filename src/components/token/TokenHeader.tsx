
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Globe, Twitter } from "lucide-react";
import { useToken } from '@/contexts/TokenContext';

export const TokenHeader: React.FC = () => {
  const { selectedToken } = useToken();

  if (!selectedToken) return null;

  return (
    <div className="flex-1">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          {selectedToken.name} ({selectedToken.symbol})
        </h1>
        <Badge 
          className={`px-3 py-1 text-sm font-medium ${
            selectedToken.category === 'Layer 1 (L1)' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
            selectedToken.category === 'DeFi' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
            selectedToken.category === 'Meme Coin' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
            selectedToken.category === 'AI' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
            'bg-gray-500/20 text-gray-400 border-gray-500/30'
          } border backdrop-blur-sm`}
        >
          {selectedToken.category}
        </Badge>
      </div>
      
      <p className="text-gray-300 text-base lg:text-lg mb-6 leading-relaxed">
        {selectedToken.description}
      </p>
      
      <div className="flex items-center gap-4">
        {selectedToken.website && (
          <a href={selectedToken.website} target="_blank" rel="noopener noreferrer" 
             className="text-gray-400 hover:text-blue-400 transition-all duration-200 p-3 rounded-xl hover:bg-gray-700/30 hover:scale-105">
            <Globe className="h-5 w-5" />
          </a>
        )}
        {selectedToken.twitter && (
          <a href={selectedToken.twitter} target="_blank" rel="noopener noreferrer"
             className="text-gray-400 hover:text-blue-400 transition-all duration-200 p-3 rounded-xl hover:bg-gray-700/30 hover:scale-105">
            <Twitter className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  );
};
