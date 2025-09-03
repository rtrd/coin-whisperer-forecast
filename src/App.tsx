import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AutoRefresh } from "@/components/layout/AutoRefresh";
import { HeadImprovements } from "@/components/layout/HeadImprovements";
import { useAdRefresh } from "./hooks/useAdRefresh";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Subscribe from "./pages/Subscribe";
import TokenDetail from "./pages/TokenDetail";
import Article from "./pages/Article";
import Blog from "./pages/Blog";
import AllTokens from "./pages/AllTokens";
import AIPrediction from "./pages/AIPrediction";
import PumpFun from "./pages/PumpFun";
import AIPricePrediction from "./pages/AIPricePrediction";
import TechnicalAnalysisPage from "./pages/TechnicalAnalysisPage";
import SentimentAnalysisPage from "./pages/SentimentAnalysisPage";
import RealTimeData from "./pages/RealTimeData";
import PortfolioTracking from "./pages/PortfolioTracking";
import PortfolioDashboard from "./pages/PortfolioDashboard";
import MotiMeter from "./pages/MotiMeter";
import NotFound from "./pages/NotFound";
import ViewEmails from "./pages/EmailList";
import VdoFloatingAd from "./components/ads/VdoFloatingAd";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/token/:tokenId" element={<TokenDetail />} />
            <Route path="/article/:articleId" element={<Article />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/tokens" element={<AllTokens />} />
            <Route path="/ai-prediction" element={<AIPrediction />} />
            <Route path="/pump-fun" element={<PumpFun />} />
            <Route
              path="/ai-price-prediction"
              element={<AIPricePrediction />}
            />
            <Route
              path="/technical-analysis"
              element={<TechnicalAnalysisPage />}
            />
            <Route
              path="/sentiment-analysis"
              element={<SentimentAnalysisPage />}
            />
            <Route path="/view-emails" element={<ViewEmails />} />

            <Route path="/real-time-data" element={<RealTimeData />} />
            <Route path="/portfolio-tracking" element={<PortfolioTracking />} />
            <Route path="/portfolio-dashboard" element={<PortfolioDashboard />} />
            <Route path="/moti-meter" element={<MotiMeter />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppWithHooks = () => {
  useAdRefresh(); // Initialize ad refresh functionality
  usePerformanceOptimization(); // Initialize performance optimizations
  
  return (
    <>
      <VdoFloatingAd />
      <ScrollToTop />
      <AppRoutes />
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HeadImprovements />
        <Toaster />
        <Sonner />
        {/* Temporarily disable AutoRefresh to prevent forced reloads */}
        {/* <AutoRefresh /> */}
        <BrowserRouter>
            <AppWithHooks />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
