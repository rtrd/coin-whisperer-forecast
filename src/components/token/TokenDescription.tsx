import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTokenInfo } from '@/hooks/useTokenInfo';

interface TokenDescriptionProps {
  tokenId: string;
}

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
            content: 'You are a cryptocurrency analyst. Generate comprehensive, SEO-optimized descriptions for crypto tokens. Write in a professional, informative tone that would be suitable for investors and traders. Focus on utility, technology, market position, and potential use cases.'
          },
          {
            role: 'user',
            content: `Generate a detailed description (600-800 characters) for ${tokenInfo.name} (${tokenInfo.symbol}). Include information about its technology, use cases, market position, and what makes it unique in the crypto space. The current market cap is $${tokenInfo.market_cap?.toLocaleString() || 'N/A'} and it ranks #${tokenInfo.market_cap_rank || 'N/A'} by market capitalization. End with a complete sentence, no ellipsis. Base your response on: ${tokenInfo.description || `${tokenInfo.name} is a cryptocurrency`}.`
          }
        ],
        model: 'openai/gpt-4o-mini',
        max_tokens: 250,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate description');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || tokenInfo.description || `${tokenInfo.name} is a digital cryptocurrency that operates on blockchain technology.`;
  } catch (error) {
    console.error('Error generating AI description:', error);
    return tokenInfo.description || `${tokenInfo.name} is a digital cryptocurrency that operates on blockchain technology, offering various features and use cases in the decentralized finance ecosystem.`;
  }
};

export const TokenDescription: React.FC<TokenDescriptionProps> = ({ tokenId }) => {
  const { data: tokenInfo, isLoading: tokenLoading } = useTokenInfo(tokenId);

  const { data: aiDescription, isLoading: descriptionLoading } = useQuery<string>({
    queryKey: ['ai-description', tokenId, tokenInfo?.name],
    queryFn: () => generateAIDescription(tokenInfo),
    enabled: !!tokenInfo,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  if (tokenLoading || descriptionLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-700/50 rounded w-full"></div>
        <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700/50 rounded w-4/5"></div>
        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
      </div>
    );
  }

  const displayDescription = aiDescription || tokenInfo?.description || `Learn more about ${tokenInfo?.name || tokenId} and its role in the cryptocurrency ecosystem.`;

  return (
    <div className="bg-gray-700/20 border border-gray-600/30 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
        About {tokenInfo?.name || tokenId}
      </h3>
      <p className="text-gray-300 text-base leading-relaxed">
        {displayDescription}
      </p>
    </div>
  );
};