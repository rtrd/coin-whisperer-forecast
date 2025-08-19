import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const MainNavigation: React.FC = () => {
  return (
    <div className="absolute top-6 right-6 z-50">
      <NavigationMenu className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl px-2 py-1">
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link 
                to="/" 
                className={cn(
                  "text-white/90 hover:text-white hover:bg-white/20 font-medium transition-all duration-300 rounded-xl px-4 py-2 text-sm backdrop-blur-sm",
                  "border border-transparent hover:border-white/30"
                )}
              >
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link 
                to="/blog" 
                className={cn(
                  "text-white/90 hover:text-white hover:bg-white/20 font-medium transition-all duration-300 rounded-xl px-4 py-2 text-sm backdrop-blur-sm",
                  "border border-transparent hover:border-white/30"
                )}
              >
                Blog
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-white/90 hover:text-white hover:bg-white/20 font-medium transition-all duration-300 rounded-xl px-4 py-2 text-sm backdrop-blur-sm border border-transparent hover:border-white/30 bg-transparent data-[state=open]:bg-white/20 data-[state=open]:text-white">
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent className="z-[200] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
              <div className="grid gap-1 p-4 w-[400px] lg:w-[450px]">
                <NavigationMenuLink asChild>
                  <Link
                    to="/ai-price-prediction"
                    className="group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:text-white border border-transparent hover:border-white/30"
                  >
                    <div className="text-sm font-semibold leading-none text-white group-hover:text-white">
                      AI Price Prediction
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-white/70 group-hover:text-white/90 mt-2">
                      Advanced AI-powered cryptocurrency price predictions with machine learning algorithms
                    </p>
                  </Link>
                </NavigationMenuLink>
                
                <NavigationMenuLink asChild>
                  <Link
                    to="/technical-analysis"
                    className="group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:text-white border border-transparent hover:border-white/30"
                  >
                    <div className="text-sm font-semibold leading-none text-white group-hover:text-white">
                      Technical Analysis
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-white/70 group-hover:text-white/90 mt-2">
                      Comprehensive technical analysis tools, charts, and market indicators
                    </p>
                  </Link>
                </NavigationMenuLink>
                
                <NavigationMenuLink asChild>
                  <Link
                    to="/sentiment-analysis"
                    className="group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:text-white border border-transparent hover:border-white/30"
                  >
                    <div className="text-sm font-semibold leading-none text-white group-hover:text-white">
                      Sentiment Analysis
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-white/70 group-hover:text-white/90 mt-2">
                      Market sentiment analysis from social media and news sources
                    </p>
                  </Link>
                </NavigationMenuLink>
                
                <NavigationMenuLink asChild>
                  <Link
                    to="/real-time-data"
                    className="group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:text-white border border-transparent hover:border-white/30"
                  >
                    <div className="text-sm font-semibold leading-none text-white group-hover:text-white">
                      Real-time Data
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-white/70 group-hover:text-white/90 mt-2">
                      Live cryptocurrency data feeds and real-time market updates
                    </p>
                  </Link>
                </NavigationMenuLink>
                
                <NavigationMenuLink asChild>
                  <Link
                    to="/portfolio-tracking"
                    className="group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:text-white border border-transparent hover:border-white/30"
                  >
                    <div className="text-sm font-semibold leading-none text-white group-hover:text-white">
                      Portfolio Tracking
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-white/70 group-hover:text-white/90 mt-2">
                      Track, manage, and analyze your cryptocurrency investment portfolio
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};