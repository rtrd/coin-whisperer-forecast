import React, { useEffect, useRef } from 'react';
import { useBitmedialAdContainer } from '@/hooks/useBitmedialAdContainer';

interface BitmedialAdContainerProps {
  id: string;
  className?: string;
  size?: 'banner' | 'rectangle' | 'leaderboard' | 'mobile';
}

export const BitmedialAdContainer: React.FC<BitmedialAdContainerProps> = ({ 
  id, 
  className = '',
  size = 'banner'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Register container with the ad service
  useBitmedialAdContainer(id);

  useEffect(() => {
    // Add data attributes for debugging
    if (containerRef.current) {
      console.log(`BitmedialAdContainer: Setting up container ${id}`);
      containerRef.current.setAttribute('data-bitmedia-container', id);
      containerRef.current.setAttribute('data-bitmedia-size', size);
    }
  }, [id, size]);

  const getSizeClasses = () => {
    switch (size) {
      case 'banner':
        return 'h-24 md:h-32';
      case 'rectangle':
        return 'h-64 w-80';
      case 'leaderboard':
        return 'h-24 w-full max-w-4xl';
      case 'mobile':
        return 'h-16 w-full md:h-24';
      default:
        return 'h-24';
    }
  };

  return (
    <div 
      ref={containerRef}
      id={`bitmedia-ad-${id}`}
      className={`
        bitmedia-ad-container 
        ${getSizeClasses()} 
        bg-gray-100 dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-lg 
        flex items-center justify-center
        text-gray-500 dark:text-gray-400
        text-sm
        ${className}
      `}
      data-ad-type="bitmedia"
      data-ad-id={id}
    >
      <span className="opacity-50">Advertisement Loading...</span>
    </div>
  );
};