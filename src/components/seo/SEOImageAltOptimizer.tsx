import React from 'react';
import { OptimizedSEOImage } from './OptimizedSEOImage';

interface SEOImageAltOptimizerProps {
  src: string;
  tokenName?: string;
  tokenSymbol?: string;
  price?: number;
  context?: 'logo' | 'chart' | 'icon' | 'graph' | 'analysis';
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const SEOImageAltOptimizer: React.FC<SEOImageAltOptimizerProps> = ({
  src,
  tokenName,
  tokenSymbol,
  price,
  context = 'icon',
  width,
  height,
  className,
  priority = false
}) => {
  // Generate SEO-optimized alt text based on context
  const generateAltText = (): string => {
    const symbol = tokenSymbol?.toUpperCase();
    const name = tokenName;
    const priceText = price ? ` trading at $${price.toFixed(2)}` : '';

    switch (context) {
      case 'logo':
        return `${name} (${symbol}) cryptocurrency logo and brand icon`;
      
      case 'chart':
        return `${name} (${symbol}) price chart and technical analysis${priceText}`;
      
      case 'graph':
        return `${name} (${symbol}) price graph showing market trends${priceText}`;
      
      case 'analysis':
        return `${name} (${symbol}) technical analysis and price prediction chart${priceText}`;
      
      case 'icon':
      default:
        return `${name} (${symbol}) cryptocurrency icon${priceText}`;
    }
  };

  // Generate title attribute for additional SEO context
  const generateTitle = (): string => {
    const symbol = tokenSymbol?.toUpperCase();
    const name = tokenName;
    
    switch (context) {
      case 'chart':
        return `View ${name} (${symbol}) price chart and market analysis`;
      
      case 'analysis':
        return `${name} (${symbol}) AI-powered price prediction and technical analysis`;
      
      default:
        return `${name} (${symbol}) - Live price and market data`;
    }
  };

  // Determine appropriate sizes attribute for responsive images
  const getSizes = (): string => {
    if (context === 'chart' || context === 'graph' || context === 'analysis') {
      return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw';
    }
    if (context === 'logo') {
      return '(max-width: 768px) 50vw, 200px';
    }
    return '(max-width: 768px) 20vw, 64px'; // Default for icons
  };

  return (
    <OptimizedSEOImage
      src={src}
      alt={generateAltText()}
      title={generateTitle()}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={getSizes()}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
};