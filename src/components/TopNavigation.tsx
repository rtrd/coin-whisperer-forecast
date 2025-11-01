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
    title: "Real-Time Market Intelligence",
    href: "/real-time-data",
    description: "Live market data and intelligence",
    icon: Activity
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
  },
  {
    title: "DeFi Pulse",
    href: "/defi-pulse",
    description: "Real-time DeFi analytics & TVL",
    icon: Activity
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

  const FeatureCard = ({ title, href, icon: Icon }: {
    title: string;
    href: string; 
    icon: any;
  }) => (
    <Link 
      to={href} 
      className="group block select-none rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-gray-700/50 hover:text-white focus:bg-gray-700/50 focus:text-white border border-transparent hover:border-gray-600/50"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
          <Icon className="h-3 w-3 text-primary" />
        </div>
        <div className="text-sm font-medium leading-none text-gray-200 group-hover:text-white">{title}</div>
      </div>
    </Link>
  );

  const MobileFeatureSection = ({ title, features }: { title: string; features: any[] }) => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 px-3 uppercase tracking-wider">{title}</h3>
      {features.map((feature) => (
        <Link
          key={feature.href}
          to={feature.href}
          className="flex items-center gap-3 px-3 py-3 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200 border border-transparent hover:border-gray-600/50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
            <feature.icon className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{feature.title}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50 shadow-xl">{/* Added specific high z-index */}
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
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800/80 hover:text-white focus:bg-gray-800/80 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive('/') && "bg-gray-800/80 text-white"
                    )}
                  >
                    <Home className="mr-2 h-4 w-4 text-blue-400" />
                    <span className="text-gray-200">Home</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/blog"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800/80 hover:text-white focus:bg-gray-800/80 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive('/blog') && "bg-gray-800/80 text-white"
                    )}
                  >
                    <BookOpen className="mr-2 h-4 w-4 text-blue-400" />
                    <span className="text-gray-200">Blog</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/lock-portfolio-dashboard"
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800/80 hover:text-white focus:bg-gray-800/80 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                      isActive('/lock-portfolio-dashboard') && "bg-gray-800/80 text-white"
                    )}
                  >
                    <PieChart className="mr-2 h-4 w-4 text-blue-400" />
                    <span className="text-gray-200">AI Portfolio Analysis</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {aiAnalysisFeatures.map((feature) => (
                <NavigationMenuItem key={feature.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={feature.href}
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-800/80 hover:text-white focus:bg-gray-800/80 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive(feature.href) && "bg-gray-800/80 text-white"
                      )}
                    >
                      <feature.icon className="mr-2 h-4 w-4 text-blue-400" />
                      <span className="text-gray-200">{feature.title}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PumpParade</span>
            </Link>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-700/50 hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-gray-900/95 backdrop-blur-lg border-l border-gray-700/50">
              <div className="flex flex-col space-y-6 mt-6">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-3 text-lg text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5 text-primary" />
                  Home
                </Link>
                
                <Link
                  to="/blog"
                  className="flex items-center gap-3 px-3 py-3 text-lg text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  Blog
                </Link>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold px-3 text-white">Features</h2>
                  
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