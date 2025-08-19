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
    <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link 
                  to="/" 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-accent/80 hover:text-accent-foreground font-medium text-foreground/90 transition-all duration-200"
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
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-accent/80 hover:text-accent-foreground font-medium text-foreground/90 transition-all duration-200"
                  )}
                >
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-accent/80 hover:text-accent-foreground font-medium text-foreground/90 transition-all duration-200">
                Features
              </NavigationMenuTrigger>
              <NavigationMenuContent className="z-[100] bg-popover/95 backdrop-blur-md border border-border/50 shadow-lg">
                <div className="grid gap-2 p-4 w-[450px] lg:w-[500px]">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/ai-price-prediction"
                      className="group block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/80 hover:shadow-md focus:bg-accent focus:text-accent-foreground border border-transparent hover:border-border/30"
                    >
                      <div className="text-sm font-semibold leading-none text-foreground group-hover:text-accent-foreground">
                        AI Price Prediction
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-accent-foreground/80 mt-2">
                        Advanced AI-powered cryptocurrency price predictions with machine learning algorithms
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  
                  <NavigationMenuLink asChild>
                    <Link
                      to="/technical-analysis"
                      className="group block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/80 hover:shadow-md focus:bg-accent focus:text-accent-foreground border border-transparent hover:border-border/30"
                    >
                      <div className="text-sm font-semibold leading-none text-foreground group-hover:text-accent-foreground">
                        Technical Analysis
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-accent-foreground/80 mt-2">
                        Comprehensive technical analysis tools, charts, and market indicators
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  
                  <NavigationMenuLink asChild>
                    <Link
                      to="/sentiment-analysis"
                      className="group block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/80 hover:shadow-md focus:bg-accent focus:text-accent-foreground border border-transparent hover:border-border/30"
                    >
                      <div className="text-sm font-semibold leading-none text-foreground group-hover:text-accent-foreground">
                        Sentiment Analysis
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-accent-foreground/80 mt-2">
                        Market sentiment analysis from social media and news sources
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  
                  <NavigationMenuLink asChild>
                    <Link
                      to="/real-time-data"
                      className="group block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/80 hover:shadow-md focus:bg-accent focus:text-accent-foreground border border-transparent hover:border-border/30"
                    >
                      <div className="text-sm font-semibold leading-none text-foreground group-hover:text-accent-foreground">
                        Real-time Data
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-accent-foreground/80 mt-2">
                        Live cryptocurrency data feeds and real-time market updates
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  
                  <NavigationMenuLink asChild>
                    <Link
                      to="/portfolio-tracking"
                      className="group block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/80 hover:shadow-md focus:bg-accent focus:text-accent-foreground border border-transparent hover:border-border/30"
                    >
                      <div className="text-sm font-semibold leading-none text-foreground group-hover:text-accent-foreground">
                        Portfolio Tracking
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-accent-foreground/80 mt-2">
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
    </div>
  );
};