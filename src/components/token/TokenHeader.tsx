import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Globe, Twitter } from "lucide-react";
import { useToken } from '@/contexts/TokenContext';
import { useQuery } from '@tanstack/react-query';
import { useTokenInfo } from '@/hooks/useTokenInfo';

const truncateToSentence = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  
  // Find the last complete sentence within the limit
  let truncated = text.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  if (lastSentenceEnd > maxLength * 0.7) {
    // If we found a sentence ending in the last 30% of the text, use it
    return truncated.substring(0, lastSentenceEnd + 1);
  } else {
    // Otherwise, find the last space and add a period
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '.';
    }
    return truncated + '...';
  }
};

const generateAIDescription = async (tokenInfo: any): Promise<string> => {
  if (!tokenInfo) return '';

  try {
    const response = await fetch('/api/openrouter-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency analyst. Generate concise, SEO-optimized descriptions for crypto tokens in EXACTLY 850 characters or less. Count your characters carefully. Write in a professional, informative tone. Focus on utility, technology, and market position. Always end with a complete sentence.'
          },
          {
            role: 'user',
            content: `Write a description for ${tokenInfo.name} (${tokenInfo.symbol}) in EXACTLY 850 characters or less. Include: technology, use cases, market position (currently ranked #${tokenInfo.market_cap_rank || 'N/A'} with $${tokenInfo.market_cap?.toLocaleString() || 'N/A'} market cap). End with complete sentence. Base on: ${tokenInfo.description || `${tokenInfo.name} is a cryptocurrency`}.`
          }
        ],
        model: 'openai/gpt-4o-mini',
        max_tokens: 120,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate description');
    }

    const data = await response.json();
    const aiDescription = data.choices?.[0]?.message?.content || tokenInfo.description || `${tokenInfo.name} is a digital cryptocurrency that operates on blockchain technology.`;
    
    // Ensure the description is exactly 850 characters or less
    return truncateToSentence(aiDescription, 850);
  } catch (error) {
    console.error('Error generating AI description:', error);
    const fallbackDescription = tokenInfo.description || `${tokenInfo.name} is a digital cryptocurrency that operates on blockchain technology, offering various features and use cases in the decentralized finance ecosystem.`;
    return truncateToSentence(fallbackDescription, 850);
  }
};

interface TokenHeaderProps {
  tokenId?: string;
}

export const TokenHeader: React.FC<TokenHeaderProps> = ({ tokenId }) => {
  const { selectedToken } = useToken();
  const { data: tokenInfo } = useTokenInfo(tokenId || selectedToken?.value || '');

  const { data: aiDescription, isLoading: descriptionLoading } = useQuery<string>({
    queryKey: ['ai-description', tokenId || selectedToken?.value, tokenInfo?.name],
    queryFn: () => generateAIDescription(tokenInfo),
    enabled: !!tokenInfo,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

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
      
      {descriptionLoading ? (
        <div className="space-y-3 animate-pulse mb-6">
          <div className="h-4 bg-gray-700/50 rounded w-full"></div>
          <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700/50 rounded w-4/5"></div>
          <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
        </div>
      ) : (
        <p className="text-gray-300 text-base lg:text-lg mb-6 leading-relaxed">
          {aiDescription || selectedToken.description || `Learn more about ${selectedToken.name} and its role in the cryptocurrency ecosystem.`}
        </p>
      )}
      
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
