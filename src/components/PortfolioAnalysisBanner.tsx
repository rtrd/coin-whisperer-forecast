import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PortfolioAnalysisBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 border border-purple-500/30 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10" />
      
      <div className="relative px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm uppercase tracking-wide">New Feature</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              AI-Powered Portfolio Analysis
            </h3>
            
            <p className="text-gray-300 text-base md:text-lg max-w-2xl">
              Scan your crypto portfolio and get AI-driven insights, risk analysis, and personalized recommendations for maximum performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/lock-portfolio-dashboard">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Analyze Portfolio
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
