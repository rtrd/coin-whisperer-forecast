// Sitemap generation utilities
import { getTokenInfo } from "./tokenMapping";

// List of all supported tokens for sitemap generation
const SUPPORTED_TOKENS = [
  'bitcoin', 'ethereum', 'bnb', 'solana', 'cardano', 'xrp', 'doge', 'shib', 
  'pepe', 'bonk', 'uniswap', 'aave', 'fetch-ai', 'render-token', 'polygon', 
  'avalanche-2', 'chainlink', 'polkadot', 'litecoin', 'tron', 'nexo', 'xlm', 
  'xmr', 'etc', 'eos', 'xtz', 'vet', 'miota', 'neo', 'dash', 'zec', 'mkr', 
  'comp', 'sushi', 'cake', 'crv', 'yfi', 'snx', '1inch', 'grt', 'ftm', 
  'matic', 'atom', 'luna', 'algo', 'near', 'icp', 'hbar', 'egld', 'hnt', 
  'theta', 'fil', 'mana', 'sand', 'axs', 'enj', 'gala', 'flow', 'chz', 
  'bat', 'lrc', 'imx', 'arb', 'op', 'apt', 'sui'
];

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const generateSitemapXML = (): string => {
  const baseUrl = 'https://pumpparade.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [
    // Static pages
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/tokens`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/ai-prediction`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/technical-analysis`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/sentiment-analysis`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/real-time-data`,
      lastmod: currentDate,
      changefreq: 'always',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/pump-fun`,
      lastmod: currentDate,
      changefreq: 'hourly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/moti-meter`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/subscribe`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      loc: `${baseUrl}/portfolio-tracking`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.7'
    },
    // Token detail pages - these are the critical ones for SEO
    ...SUPPORTED_TOKENS.map(tokenId => {
      const tokenInfo = getTokenInfo(tokenId);
      return {
        loc: `${baseUrl}/token/${tokenId}`,
        lastmod: currentDate,
        changefreq: 'hourly' as const,
        priority: tokenInfo.name === 'Bitcoin' || tokenInfo.name === 'Ethereum' ? '0.9' : '0.8'
      };
    })
  ];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
};

// Generate sitemap and save to public folder (this would typically be called during build)
export const saveSitemap = () => {
  const sitemapContent = generateSitemapXML();
  
  // In a real application, you would write this to public/sitemap.xml
  // For now, we'll log it so it can be manually created
  console.log('Sitemap XML Content:');
  console.log(sitemapContent);
  
  return sitemapContent;
};