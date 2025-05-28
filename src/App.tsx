
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Subscribe from "./pages/Subscribe";
import TokenDetail from "./pages/TokenDetail";
import Article from "./pages/Article";
import AllTokens from "./pages/AllTokens";
import Token from "./pages/Token";
import AIPrediction from "./pages/AIPrediction";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/token/:tokenId" element={<TokenDetail />} />
          <Route path="/tokens" element={<AllTokens />} />
          <Route path="/token" element={<Token />} />
          <Route path="/ai-prediction" element={<AIPrediction />} />
          <Route path="/article/:articleId" element={<Article />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
