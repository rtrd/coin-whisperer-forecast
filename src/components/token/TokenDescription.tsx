import React from 'react';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { getCoinGeckoId } from '@/utils/tokenMapping';
import { Skeleton } from '@/components/ui/skeleton';

interface TokenDescriptionProps {
  tokenId: string;
}

export const TokenDescription: React.FC<TokenDescriptionProps> = ({ tokenId }) => {
  const cryptoId = getCoinGeckoId(tokenId);
  const { data: tokenInfo, isLoading, error } = useTokenInfo(cryptoId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-700/50" />
        <Skeleton className="h-4 w-3/4 bg-gray-700/50" />
        <Skeleton className="h-4 w-5/6 bg-gray-700/50" />
      </div>
    );
  }

  if (error || !tokenInfo?.description) {
    return null;
  }

  // Clean up HTML tags from description and limit length
  const cleanDescription = tokenInfo.description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();

  // Truncate to reasonable length for SEO (around 155-200 characters)
  const truncatedDescription = cleanDescription.length > 200 
    ? cleanDescription.substring(0, 200) + '...'
    : cleanDescription;

  if (!truncatedDescription) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-4">
      <p className="text-gray-300 text-sm leading-relaxed">
        {truncatedDescription}
      </p>
    </div>
  );
};