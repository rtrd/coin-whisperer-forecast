import { useQuery } from '@tanstack/react-query';

export interface LunarCrushMetrics {
  galaxy_score?: number;
  alt_rank?: number;
  social_volume_24h?: number;
  social_engagement_24h?: number;
  social_contributors?: number;
  social_dominance?: number;
  sentiment?: number;
  price_score?: number;
  bullish_sentiment?: number;
  bearish_sentiment?: number;
}

// Use relative edge function URL and optional anon key for auth
const invokeLunarCrush = async (body: any) => {
  const url = `/functions/v1/lunarcrush-proxy`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (anon) headers['Authorization'] = `Bearer ${anon}`;

  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    let details: any = null;
    try {
      details = contentType.includes('application/json') ? await res.json() : await res.text();
    } catch {}
    throw new Error(typeof details === 'string' ? details : details?.error || `LunarCrush proxy error: ${res.status}`);
  }

  // Safely parse JSON, handle empty body
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

export const useLunarCrushMetrics = (tokenSymbol: string) => {
  return useQuery({
    queryKey: ['lunarcrush-metrics', tokenSymbol],
    queryFn: async (): Promise<LunarCrushMetrics> => {
      try {
        const data = await invokeLunarCrush({ tokenSymbol });
        return data as LunarCrushMetrics;
      } catch (error) {
        console.error('LunarCrush metrics fetch error:', error);
        throw error;
      }
    },
    enabled: !!tokenSymbol,
    staleTime: 900000, // 15 minutes
    retry: 1,
  });
};
