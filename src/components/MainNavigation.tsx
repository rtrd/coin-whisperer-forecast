import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const MainNavigation: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="container mx-auto px-6 py-2">
        <div className="flex justify-end">
          <NavigationMenu>
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/" 
                    className="text-white font-medium text-sm px-3 py-1"
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/blog" 
                    className="text-white font-medium text-sm px-3 py-1"
                  >
                    Blog
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white font-medium text-sm px-3 py-1 bg-transparent data-[state=open]:bg-slate-800">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[200] bg-slate-900 border border-slate-700 shadow-xl">
                  <div className="grid gap-1 p-4 w-[350px]">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/ai-price-prediction"
                        className="block select-none space-y-1 p-3 text-white"
                      >
                        <div className="text-sm font-semibold leading-none">
                          AI Price Prediction
                        </div>
                        <p className="text-xs leading-snug text-slate-300 mt-1">
                          Advanced AI-powered cryptocurrency price predictions
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    
                    <NavigationMenuLink asChild>
                      <Link
                        to="/technical-analysis"
                        className="block select-none space-y-1 p-3 text-white"
                      >
                        <div className="text-sm font-semibold leading-none">
                          Technical Analysis
                        </div>
                        <p className="text-xs leading-snug text-slate-300 mt-1">
                          Comprehensive technical analysis tools and charts
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    
                    <NavigationMenuLink asChild>
                      <Link
                        to="/sentiment-analysis"
                        className="block select-none space-y-1 p-3 text-white"
                      >
                        <div className="text-sm font-semibold leading-none">
                          Sentiment Analysis
                        </div>
                        <p className="text-xs leading-snug text-slate-300 mt-1">
                          Market sentiment analysis from social media
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    
                    <NavigationMenuLink asChild>
                      <Link
                        to="/real-time-data"
                        className="block select-none space-y-1 p-3 text-white"
                      >
                        <div className="text-sm font-semibold leading-none">
                          Real-time Data
                        </div>
                        <p className="text-xs leading-snug text-slate-300 mt-1">
                          Live cryptocurrency data and market updates
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    
                    <NavigationMenuLink asChild>
                      <Link
                        to="/portfolio-tracking"
                        className="block select-none space-y-1 p-3 text-white"
                      >
                        <div className="text-sm font-semibold leading-none">
                          Portfolio Tracking
                        </div>
                        <p className="text-xs leading-snug text-slate-300 mt-1">
                          Track and manage your crypto portfolio
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
};