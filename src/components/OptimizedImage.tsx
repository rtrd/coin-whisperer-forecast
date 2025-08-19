import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  webpSrc?: string;
  avifSrc?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  priority?: boolean;
}

// Optimized image component with lazy loading and modern formats
export const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  fallback = '/placeholder.svg',
  webpSrc,
  avifSrc,
  sizes,
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL,
  className = '',
  priority = false,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(
    placeholder === 'blur' && blurDataURL ? blurDataURL : ''
  );
  
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Use intersection observer for lazy loading (unless priority)
  const { ref: observerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  const shouldLoad = priority || isIntersecting;

  useEffect(() => {
    if (!shouldLoad || isLoaded || hasError) return;

    const img = new Image();
    
    // Handle load
    img.onload = (e) => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.(e as any);
    };
    
    // Handle error with fallback
    img.onerror = (e) => {
      setHasError(true);
      setCurrentSrc(fallback);
      onError?.(e as any);
    };

    // Load appropriate format based on browser support
    if (avifSrc && supportsAvif()) {
      img.src = avifSrc;
    } else if (webpSrc && supportsWebp()) {
      img.src = webpSrc;
    } else {
      img.src = src;
    }
  }, [shouldLoad, src, webpSrc, avifSrc, fallback, isLoaded, hasError, onLoad, onError]);

  // Set refs for intersection observer
  const combinedRef = useCallback((node: HTMLImageElement) => {
    imgRef.current = node;
    if (!priority && node && observerRef) {
      (observerRef as any)(node);
    }
  }, [observerRef, priority]);

  return (
    <img
      ref={combinedRef}
      src={currentSrc || (shouldLoad ? src : '')}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      sizes={sizes}
      {...props}
    />
  );
});

// Browser support detection
const supportsWebp = (() => {
  let cached: boolean | undefined;
  return () => {
    if (cached !== undefined) return cached;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    cached = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return cached;
  };
})();

const supportsAvif = (() => {
  let cached: boolean | undefined;
  return () => {
    if (cached !== undefined) return cached;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    try {
      cached = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      cached = false;
    }
    return cached;
  };
})();

OptimizedImage.displayName = 'OptimizedImage';