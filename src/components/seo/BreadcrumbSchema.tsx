import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
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

// Helper function to generate breadcrumbs based on path
export const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const baseUrl = 'https://pumpparade.com';
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: baseUrl }
  ];

  const pathSegments = pathname.split('/').filter(Boolean);
  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    const breadcrumbNames: Record<string, string> = {
      'blog': 'Blog',
      'article': 'Article', 
      'tokens': 'All Tokens',
      'token': 'Token',
      'ai-prediction': 'AI Prediction',
      'moti-meter': 'MOTI Meter',
      'pump-fun': 'Pump.fun',
      'technical-analysis': 'Technical Analysis',
      'sentiment-analysis': 'Sentiment Analysis',
      'subscribe': 'Subscribe'
    };

    const name = breadcrumbNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({
      name,
      url: `${baseUrl}${currentPath}`
    });
  });

  return breadcrumbs;
};