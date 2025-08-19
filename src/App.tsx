import React, { Suspense, lazy, StrictMode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BitmedialAdManager } from "@/components/ads/BitmedialAdManager";
import { AutoRefresh } from "@/components/layout/AutoRefresh";
import { HeadImprovements } from "@/components/layout/HeadImprovements";
import { useAdRefresh } from "./hooks/useAdRefresh";
import { usePerformanceOptimization } from "./hooks/usePerformanceOptimization";
import ScrollToTop from "./components/ScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

// Lazy load all pages for optimal code splitting
const Index = lazy(() => import("./pages/Index"));
const Subscribe = lazy(() => import("./pages/Subscribe"));
const TokenDetail = lazy(() => import("./pages/TokenDetail"));
const Article = lazy(() => import("./pages/Article"));
const Blog = lazy(() => import("./pages/Blog"));
const AllTokens = lazy(() => import("./pages/AllTokens"));
const AIPrediction = lazy(() => import("./pages/AIPrediction"));
const PumpFun = lazy(() => import("./pages/PumpFun"));
const AIPricePrediction = lazy(() => import("./pages/AIPricePrediction"));
const TechnicalAnalysisPage = lazy(() => import("./pages/TechnicalAnalysisPage"));
const SentimentAnalysisPage = lazy(() => import("./pages/SentimentAnalysisPage"));
const RealTimeData = lazy(() => import("./pages/RealTimeData"));
const PortfolioTracking = lazy(() => import("./pages/PortfolioTracking"));
const MotiMeter = lazy(() => import("./pages/MotiMeter"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ViewEmails = lazy(() => import("./pages/EmailList"));

// Enhanced loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
    <div className="space-y-4 text-center">
      <Skeleton className="h-8 w-64 mx-auto bg-gray-700" />
      <Skeleton className="h-4 w-48 mx-auto bg-gray-700" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 px-4 max-w-4xl">
        <Skeleton className="h-32 bg-gray-700" />
        <Skeleton className="h-32 bg-gray-700" />
        <Skeleton className="h-32 bg-gray-700" />
      </div>
    </div>
  </div>
);

// Enhanced error fallback for navigation issues
const NavigationErrorFallback = () => (
  <div className="fixed top-0 left-0 w-full z-50 bg-slate-900 border-b border-slate-700 shadow-lg">
    <div className="container mx-auto px-6 py-2">
      <div className="flex justify-end">
        <div className="text-white font-medium text-sm px-3 py-1">
          Navigation Loading...
        </div>
      </div>
    </div>
  </div>
);

// Create a single QueryClient instance to avoid re-initializing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

const AppRoutes = () => {
  // Initialize ad refresh and performance optimizations
  useAdRefresh();
  usePerformanceOptimization();

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/token/:tokenId" element={<TokenDetail />} />
          <Route path="/article/:articleId" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoadingFallback />}>
                <Article />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tokens" element={<AllTokens />} />
          <Route path="/ai-prediction" element={<AIPrediction />} />
          <Route path="/pump-fun" element={<PumpFun />} />
          <Route path="/ai-price-prediction" element={<AIPricePrediction />} />
          <Route path="/technical-analysis" element={<TechnicalAnalysisPage />} />
          <Route path="/sentiment-analysis" element={<SentimentAnalysisPage />} />
          <Route path="/view-emails" element={<ViewEmails />} />
          <Route path="/real-time-data" element={<RealTimeData />} />
          <Route path="/portfolio-tracking" element={<PortfolioTracking />} />
          <Route path="/moti-meter" element={<MotiMeter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <PerformanceMonitor />
          <HeadImprovements />
          <Toaster />
          <Sonner />
          <AutoRefresh />
          <BrowserRouter>
            <BitmedialAdManager>
              <ScrollToTop />
              <AppRoutes />
            </BitmedialAdManager>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;
