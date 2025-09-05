import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
  Brain,
  TrendingUp,
  BarChart3,
  Heart,
  Coins,
  Activity,
  Wallet,
  PieChart,
  Zap,
  Target,
  Crown,
  Home,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const aiAnalysisFeatures = [
  {
    title: "AI Prediction Analysis",
    href: "/ai-prediction",
    description: "Advanced AI-powered price predictions",
    icon: Brain
  },
  {
    title: "AI Price Prediction", 
    href: "/ai-price-prediction",
    description: "Detailed price forecasting models",
    icon: TrendingUp
  },
  {
    title: "Technical Analysis",
    href: "/technical-analysis", 
    description: "Comprehensive technical indicators",
    icon: BarChart3
  },
  {
    title: "Sentiment Analysis",
    href: "/sentiment-analysis",
    description: "Market sentiment and social signals",
    icon: Heart
  }
];

const marketDataFeatures = [
  {
    title: "All Tokens",
    href: "/tokens",
    description: "Browse all available cryptocurrencies", 
    icon: Coins
  },
  {
    title: "Real-time Data",
    href: "/real-time-data",
    description: "Live market data and updates",
    icon: Activity
  },
  {
    title: "Portfolio Tracking", 
    href: "/portfolio-tracking",
    description: "Track your crypto portfolio",
    icon: Wallet
  },
  {
    title: "Portfolio Dashboard",
    href: "/portfolio-dashboard", 
    description: "Advanced portfolio analytics",
    icon: PieChart
  }
];

const trendsFeatures = [
  {
    title: "Pump.Fun Insights",
    href: "/pump-fun",
    description: "Memecoin trends and analytics",
    icon: Zap
  },
  {
    title: "MOTI Meter",
    href: "/moti-meter", 
    description: "Market momentum indicators",
    icon: Target
  }
];

const premiumFeatures = [
  {
    title: "Subscribe",
    href: "/subscribe",
    description: "Unlock premium features",
    icon: Crown
  }
];

export const TopNavigation: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const FeatureCard = ({ title, href, description, icon: Icon }: {
    title: string;
    href: string; 
    description: string;
    icon: any;
  }) => (
    <Link to={href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <div className="text-sm font-medium leading-none">{title}</div>
      </div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {description}
      </p>
    </Link>
  );

  const MobileFeatureSection = ({ title, features }: { title: string; features: any[] }) => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground px-3">{title}</h3>
      {features.map((feature) => (
        <Link
          key={feature.href}
          to={feature.href}
          className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md"
          onClick={() => setMobileMenuOpen(false)}
        >
          <feature.icon className="h-4 w-4" />
          <span>{feature.title}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive('/') && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/blog"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive('/blog') && "bg-accent text-accent-foreground"
                    )}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Blog
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[800px] gap-3 p-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium leading-none">AI Analysis</h4>
                      {aiAnalysisFeatures.map((feature) => (
                        <FeatureCard key={feature.href} {...feature} />
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium leading-none">Market Data</h4>
                      {marketDataFeatures.map((feature) => (
                        <FeatureCard key={feature.href} {...feature} />
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium leading-none">Trends & Insights</h4>
                      {trendsFeatures.map((feature) => (
                        <FeatureCard key={feature.href} {...feature} />
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium leading-none">Premium</h4>
                      {premiumFeatures.map((feature) => (
                        <FeatureCard key={feature.href} {...feature} />
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-lg">PumpParade</span>
            </Link>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-2 text-lg hover:bg-accent rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                
                <Link
                  to="/blog"
                  className="flex items-center gap-3 px-3 py-2 text-lg hover:bg-accent rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  Blog
                </Link>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold px-3">Features</h2>
                  
                  <MobileFeatureSection title="AI Analysis" features={aiAnalysisFeatures} />
                  <MobileFeatureSection title="Market Data" features={marketDataFeatures} />
                  <MobileFeatureSection title="Trends & Insights" features={trendsFeatures} />
                  <MobileFeatureSection title="Premium" features={premiumFeatures} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};