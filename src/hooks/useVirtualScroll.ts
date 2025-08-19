import { useState, useEffect, useMemo, useCallback } from 'react';

interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualScroll = <T>(
  items: T[],
  options: VirtualScrollOptions
) => {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + overscan, items.length);
    
    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex,
      visibleItems: items.slice(
        Math.max(0, startIndex - overscan),
        endIndex
      )
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    virtualItems: visibleRange.visibleItems.map((item, index) => ({
      item,
      index: visibleRange.startIndex + index,
      offsetY: (visibleRange.startIndex + index) * itemHeight
    })),
    totalHeight,
    offsetY,
    handleScroll,
    startIndex: visibleRange.startIndex,
    endIndex: visibleRange.endIndex
  };
};

// Hook for optimized list rendering with intersection observer
export const useOptimizedList = <T>(
  items: T[],
  options: {
    threshold?: number;
    rootMargin?: string;
    onVisibilityChange?: (index: number, isVisible: boolean) => void;
  } = {}
) => {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const { threshold = 0.1, rootMargin = '100px', onVisibilityChange } = options;

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const newVisibleIndices = new Set(visibleIndices);
      
      entries.forEach((entry) => {
        const index = parseInt(entry.target.getAttribute('data-index') || '0');
        
        if (entry.isIntersecting) {
          newVisibleIndices.add(index);
          onVisibilityChange?.(index, true);
        } else {
          newVisibleIndices.delete(index);
          onVisibilityChange?.(index, false);
        }
      });
      
      setVisibleIndices(newVisibleIndices);
    },
    [visibleIndices, onVisibilityChange]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin
    });

    // Observe all current items
    document.querySelectorAll('[data-index]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [observerCallback, threshold, rootMargin]);

  return {
    isVisible: (index: number) => visibleIndices.has(index),
    visibleCount: visibleIndices.size
  };
};