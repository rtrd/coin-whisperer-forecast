
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";
import { BicepsFlexed, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BicepsFlexed className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">PumpParade</span>
            </div>
            <p className="text-gray-400 text-sm">
              Advanced cryptocurrency price prediction using machine learning and market analysis.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/ai-price-prediction" className="hover:text-white transition-colors">AI Price Prediction</Link></li>
              <li><Link to="/technical-analysis" className="hover:text-white transition-colors">Technical Analysis</Link></li>
              <li><Link to="/sentiment-analysis" className="hover:text-white transition-colors">Sentiment Analysis</Link></li>
              <li><Link to="/real-time-data" className="hover:text-white transition-colors">Real-time Data</Link></li>
              <li><Link to="/portfolio-tracking" className="hover:text-white transition-colors">Portfolio Tracking</Link></li>
            </ul>
          </div>

          {/* Cryptocurrencies */}
          <div>
            <h3 className="text-white font-semibold mb-4">Supported Coins</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Bitcoin (BTC)</li>
              <li>Ethereum (ETH)</li>
              <li>Altcoins</li>
              <li>DeFi Tokens</li>
              <li>Meme Coins</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/PumpParade_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/pump-parade" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.reddit.com/r/PumpParade/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 1v6"/>
                  <path d="M12 17v6"/>
                  <path d="M4.22 4.22l4.24 4.24"/>
                  <path d="M15.54 15.54l4.24 4.24"/>
                  <path d="M1 12h6"/>
                  <path d="M17 12h6"/>
                  <path d="M4.22 19.78l4.24-4.24"/>
                  <path d="M15.54 8.46l4.24-4.24"/>
                </svg>
              </a>
              <a href="mailto:info@pumpparade.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 PumpParade. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
