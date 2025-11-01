import { useState, useEffect } from 'react';

export interface DefiProtocol {
  id: string;
  name: string;
  symbol: string;
  tvl: number;
  change24h: number;
  change7d: number;
  category: string;
  chains: string[];
  logo?: string;
}

export interface ChainTVL {
  name: string;
  tvl: number;
  tvlPrevDay: number;
  change24h: number;
  protocols: number;
}

export interface DefiCategory {
  name: string;
  tvl: number;
  change24h: number;
  protocols: number;
}

export const useDefiData = () => {
  const [protocols, setProtocols] = useState<DefiProtocol[]>([]);
  const [chains, setChains] = useState<ChainTVL[]>([]);
  const [categories, setCategories] = useState<DefiCategory[]>([]);
  const [totalTVL, setTotalTVL] = useState(0);
  const [totalChange24h, setTotalChange24h] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefiData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch protocols data
        const protocolsResponse = await fetch('https://api.llama.fi/protocols');
        if (!protocolsResponse.ok) throw new Error('Failed to fetch protocols');
        const protocolsData = await protocolsResponse.json();

        // Transform and filter top protocols
        const topProtocols: DefiProtocol[] = protocolsData
          .filter((p: any) => p.tvl && p.tvl > 0)
          .sort((a: any, b: any) => b.tvl - a.tvl)
          .slice(0, 100)
          .map((p: any) => ({
            id: p.slug,
            name: p.name,
            symbol: p.symbol || p.name.substring(0, 3).toUpperCase(),
            tvl: p.tvl,
            change24h: p.change_1d || 0,
            change7d: p.change_7d || 0,
            category: p.category || 'Other',
            chains: p.chains || [],
            logo: p.logo
          }));

        setProtocols(topProtocols);

        // Fetch chains data
        const chainsResponse = await fetch('https://api.llama.fi/v2/chains');
        if (!chainsResponse.ok) throw new Error('Failed to fetch chains');
        const chainsData = await chainsResponse.json();

        const transformedChains: ChainTVL[] = chainsData
          .filter((c: any) => c.tvl && c.tvl > 0)
          .sort((a: any, b: any) => b.tvl - a.tvl)
          .slice(0, 20)
          .map((c: any) => ({
            name: c.name,
            tvl: c.tvl,
            tvlPrevDay: c.tvlPrevDay || c.tvl,
            change24h: c.tvlPrevDay ? ((c.tvl - c.tvlPrevDay) / c.tvlPrevDay) * 100 : 0,
            protocols: c.protocols || 0
          }));

        setChains(transformedChains);

        // Calculate total TVL
        const total = transformedChains.reduce((sum, chain) => sum + chain.tvl, 0);
        setTotalTVL(total);

        // Calculate weighted 24h change
        const weightedChange = transformedChains.reduce(
          (sum, chain) => sum + (chain.change24h * chain.tvl),
          0
        ) / total;
        setTotalChange24h(weightedChange);

        // Aggregate categories from protocols
        const categoryMap = new Map<string, { tvl: number; protocols: number; changes: number[] }>();
        
        topProtocols.forEach(protocol => {
          const existing = categoryMap.get(protocol.category) || { tvl: 0, protocols: 0, changes: [] };
          categoryMap.set(protocol.category, {
            tvl: existing.tvl + protocol.tvl,
            protocols: existing.protocols + 1,
            changes: [...existing.changes, protocol.change24h]
          });
        });

        const transformedCategories: DefiCategory[] = Array.from(categoryMap.entries())
          .map(([name, data]) => ({
            name,
            tvl: data.tvl,
            change24h: data.changes.reduce((sum, c) => sum + c, 0) / data.changes.length,
            protocols: data.protocols
          }))
          .sort((a, b) => b.tvl - a.tvl)
          .slice(0, 15);

        setCategories(transformedCategories);

      } catch (err) {
        console.error('Error fetching DeFi data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch DeFi data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefiData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDefiData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    protocols,
    chains,
    categories,
    totalTVL,
    totalChange24h,
    isLoading,
    error
  };
};
