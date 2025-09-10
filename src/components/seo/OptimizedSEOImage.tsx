import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedSEOImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  title?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const OptimizedSEOImage: React.FC<OptimizedSEOImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  title,
  sizes,
  loading = 'lazy',
  fetchPriority = 'auto'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(priority ? src : null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use intersection observer for lazy loading
  const { ref: observerRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  // Generate WebP and AVIF versions
  const getOptimizedSrc = (originalSrc: string, format: 'webp' | 'avif' = 'webp') => {
    if (originalSrc.includes('coingecko.com') || originalSrc.includes('external')) {
      return originalSrc; // Don't modify external URLs
    }
    const ext = originalSrc.split('.').pop();
    return originalSrc.replace(`.${ext}`, `.${format}`);
  };

  // Set src when intersecting or priority
  useEffect(() => {
    if ((isIntersecting || priority) && !currentSrc) {
      setCurrentSrc(src);
    }
  }, [isIntersecting, priority, src, currentSrc]);

  const handleLoad = () => {
    setImageLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setImageLoaded(false);
    // Fallback to original src if optimized version fails
    if (currentSrc !== src) {
      setCurrentSrc(src);
    }
  };

  // Structured data for image
  const imageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": src,
    "width": width,
    "height": height,
    "caption": alt,
    "description": alt
  };

  return (
    <div className="relative overflow-hidden" ref={observerRef}>
      {/* Structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageStructuredData) }}
      />
      
      {/* Picture element with modern formats */}
      <picture>
        {/* AVIF format for supported browsers */}
        <source 
          srcSet={currentSrc ? getOptimizedSrc(currentSrc, 'avif') : undefined}
          type="image/avif"
          sizes={sizes}
        />
        
        {/* WebP format fallback */}
        <source 
          srcSet={currentSrc ? getOptimizedSrc(currentSrc, 'webp') : undefined}
          type="image/webp"
          sizes={sizes}
        />
        
        {/* Original format fallback */}
        <img
          src={currentSrc || undefined}
          alt={alt}
          title={title}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={loading}
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      </picture>

      {/* Loading placeholder */}
      {!imageLoaded && currentSrc && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse rounded"
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground"
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        >
          <span className="text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
};