
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
              <li><Link to="/lock-portfolio-dashboard" className="hover:text-white transition-colors">AI Portfolio Analysis</Link></li>
            </ul>
          </div>

          {/* Cryptocurrencies */}
          <div>
            <h3 className="text-white font-semibold mb-4">Supported Coins</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/token/bitcoin" className="hover:text-white transition-colors">Bitcoin (BTC)</Link></li>
              <li><Link to="/token/ethereum" className="hover:text-white transition-colors">Ethereum (ETH)</Link></li>
              <li><Link to="/token/solana" className="hover:text-white transition-colors">Solana (SOL)</Link></li>
              <li><Link to="/token/cardano" className="hover:text-white transition-colors">Cardano (ADA)</Link></li>
              <li><Link to="/tokens" className="hover:text-white transition-colors">View All Tokens</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex flex-wrap gap-4">
              <a href="https://x.com/PumpParade_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/pump-parade" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.producthunt.com/products/pump-parade" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 40 40">
                  <path d="M20 40C8.954 40 0 31.046 0 20S8.954 0 20 0s20 8.954 20 20-8.954 20-20 20zm9.032-21.936c0-3.584-2.912-6.496-6.496-6.496H12.8v16h3.2v-3.2h6.336c3.584 0 6.496-2.912 6.496-6.496v-2.208zm-3.2 2.208c0 1.792-1.408 3.2-3.296 3.2H16v-8.736h6.336c1.888 0 3.296 1.408 3.296 3.2v2.336z"/>
                </svg>
              </a>
              <a href="https://www.reddit.com/r/PumpParade/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </a>
              <a href="https://medium.com/@pumpparade" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 0 0-.143.362v9.067a.376.376 0 0 0 .143.361l1.257 1.234v.271h-6.322v-.27l1.302-1.265c.128-.128.128-.165.128-.36V8.99l-3.62 9.195h-.49L6.69 8.99v6.163a.85.85 0 0 0 .233.707L8.768 17.9v.271H4.456v-.27L6.301 15.86a.82.82 0 0 0 .218-.707V8.027a.624.624 0 0 0-.203-.527L4.456 5.686v-.271h4.551l3.515 7.707 3.09-7.707h4.326v.271z"/>
                </svg>
              </a>
              <a href="mailto:info@pumpparade.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            
            {/* Product Hunt Badge */}
            <div className="mt-4">
              <a href="https://www.producthunt.com/products/pump-parade?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-pump&#0045;parade" target="_blank">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=984296&theme=light&t=1753864643402" alt="Pump&#0032;Parade - AI&#0045;powered&#0032;crypto&#0032;research&#0032;tools&#0032;for&#0032;smarter&#0032;decisions | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 PumpParade. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
