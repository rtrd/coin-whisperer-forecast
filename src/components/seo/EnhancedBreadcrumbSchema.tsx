import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

interface EnhancedBreadcrumbSchemaProps {
  customBreadcrumbs?: BreadcrumbItem[];
  tokenName?: string;
  articleTitle?: string;
}

export const EnhancedBreadcrumbSchema = ({
  customBreadcrumbs,
  tokenName,
  articleTitle
}) => {
  const location = useLocation();
  
  const generateAutomaticBreadcrumbs = (): BreadcrumbItem[] => {
    const baseUrl = 'https://pumpparade.com';
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', url: baseUrl, position: 1 }
    ];

    const pathSegments = location.pathname.split('/').filter(Boolean);
    let currentPath = '';
    let position = 2;

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      const breadcrumbNames: Record<string, string> = {
        'blog': 'Blog',
        'article': 'Article',
        'tokens': 'All Tokens',
        'token': tokenName || 'Token',
        'ai-prediction': 'AI Prediction',
        'moti-meter': 'MOTI Meter',
        'pump-fun': 'Pump.fun',
        'technical-analysis': 'Technical Analysis',
        'sentiment-analysis': 'Sentiment Analysis',
        'subscribe': 'Subscribe',
        'portfolio': 'Portfolio',
        'real-time-data': 'Real-Time Data'
      };

      // Special handling for dynamic segments
      let name = breadcrumbNames[segment];
      
      if (!name) {
        if (segment === pathSegments[pathSegments.length - 1] && articleTitle) {
          name = articleTitle.length > 60 ? `${articleTitle.substring(0, 60)}...` : articleTitle;
        } else if (segment === pathSegments[pathSegments.length - 1] && tokenName) {
          name = tokenName;
        } else {
          name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        }
      }

      breadcrumbs.push({
        name,
        url: `${baseUrl}${currentPath}`,
        position: position++
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = customBreadcrumbs || generateAutomaticBreadcrumbs();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item) => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": {
        "@type": "WebPage",
        "@id": item.url,
        "url": item.url,
        "name": item.name
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};