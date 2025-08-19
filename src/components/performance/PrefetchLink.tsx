import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useHoverPrefetch } from '@/hooks/usePrefetch';

interface PrefetchLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  prefetchDelay?: number;
}

export const PrefetchLink: React.FC<PrefetchLinkProps> = memo(({
  to,
  children,
  className,
  prefetchDelay = 100
}) => {
  const { handleLinkHover } = useHoverPrefetch();
  let hoverTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => {
      handleLinkHover(to);
    }, prefetchDelay);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
  };

  return (
    <Link
      to={to}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
});

PrefetchLink.displayName = 'PrefetchLink';