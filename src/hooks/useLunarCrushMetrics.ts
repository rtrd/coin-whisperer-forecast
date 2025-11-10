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

// Enhanced LunarCrush invocation with better error handling
const invokeLunarCrush = async (body: any) => {
  const url = `/functions/v1/lunarcrush-proxy`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (anon) headers['Authorization'] = `Bearer ${anon}`;

  console.log('[LunarCrush] Invoking proxy:', { url, body });

  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    // Special handling for 404 - function not deployed
    if (res.status === 404) {
      console.error('[LunarCrush] Edge function not found (404). Ensure lunarcrush-proxy is deployed.');
      throw new Error('LunarCrush proxy not deployed or not accessible');
    }

    let details: any = null;
    try {
      details = contentType.includes('application/json') ? await res.json() : await res.text();
    } catch {}
    
    console.error('[LunarCrush] Proxy error:', { status: res.status, details });
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
