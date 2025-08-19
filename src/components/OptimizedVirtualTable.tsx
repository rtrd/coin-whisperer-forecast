import React, { memo, useMemo } from 'react';
import { useVirtualScroll } from '@/hooks/useVirtualScroll';
import { CryptoToken } from '@/types/crypto';

interface OptimizedVirtualTableProps {
  data: CryptoToken[];
  containerHeight: number;
  itemHeight: number;
  onRowClick?: (token: CryptoToken) => void;
  className?: string;
}

// Memoized row component to prevent unnecessary re-renders
const VirtualTableRow = memo<{
  token: CryptoToken;
  index: number;
  style: React.CSSProperties;
  onClick?: (token: CryptoToken) => void;
}>(({ token, index, style, onClick }) => {
  return (
    <div
      style={style}
      className="flex items-center px-4 py-3 border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer transition-colors"
      onClick={() => onClick?.(token)}
      data-index={index}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          {token.image && (
            <img
              src={token.image}
              alt={token.name}
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-medium text-white truncate">{token.name}</div>
            <div className="text-sm text-gray-400 uppercase">{token.symbol}</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 text-right">
        <div className="text-white font-mono">
          ${token.current_price?.toLocaleString() || 'N/A'}
        </div>
      </div>
      
      <div className="flex-1 text-right">
        <div className={`font-medium ${
          (token.price_change_percentage_24h || 0) >= 0
            ? 'text-green-400'
            : 'text-red-400'
        }`}>
          {token.price_change_percentage_24h
            ? `${token.price_change_percentage_24h.toFixed(2)}%`
            : 'N/A'
          }
        </div>
      </div>
      
      <div className="flex-1 text-right">
        <div className="text-white font-mono">
          ${token.market_cap?.toLocaleString() || 'N/A'}
        </div>
      </div>
    </div>
  );
});

VirtualTableRow.displayName = 'VirtualTableRow';

export const OptimizedVirtualTable: React.FC<OptimizedVirtualTableProps> = memo(({
  data,
  containerHeight,
  itemHeight,
  onRowClick,
  className = ''
}) => {
  const {
    virtualItems,
    totalHeight,
    offsetY,
    handleScroll
  } = useVirtualScroll(data, {
    itemHeight,
    containerHeight,
    overscan: 10
  });

  const headerStyle = useMemo(() => ({
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
    backgroundColor: 'rgb(31, 41, 55)',
    borderBottom: '1px solid rgb(75, 85, 99)'
  }), []);

  return (
    <div className={`relative ${className}`}>
      {/* Table Header */}
      <div style={headerStyle} className="flex items-center px-4 py-3">
        <div className="flex-1 text-sm font-medium text-gray-300">Token</div>
        <div className="flex-1 text-sm font-medium text-gray-300 text-right">Price</div>
        <div className="flex-1 text-sm font-medium text-gray-300 text-right">24h Change</div>
        <div className="flex-1 text-sm font-medium text-gray-300 text-right">Market Cap</div>
      </div>

      {/* Virtual Scrollable Content */}
      <div
        style={{ height: containerHeight }}
        className="overflow-auto"
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {virtualItems.map(({ item: token, index, offsetY }) => (
              <VirtualTableRow
                key={`${token.id}-${index}`}
                token={token}
                index={index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: itemHeight,
                  transform: `translateY(${offsetY - offsetY}px)`
                }}
                onClick={onRowClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

OptimizedVirtualTable.displayName = 'OptimizedVirtualTable';