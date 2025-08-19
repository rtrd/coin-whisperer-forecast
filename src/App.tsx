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
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

// Optimized loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="space-y-4 w-full max-w-4xl px-4">
      <Skeleton className="h-16 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const AppRoutes = () => {
  useAdRefresh(); // Initialize ad refresh functionality
  usePerformanceOptimization(); // Initialize performance optimizations

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/token/:tokenId" element={<TokenDetail />} />
        <Route path="/article/:articleId" element={<Article />} />
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
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
