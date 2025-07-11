import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdBlockDetector: React.FC = () => {
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple and reliable detection method
    const detectAdBlock = () => {
      // Method 1: Check if ads are being blocked by trying to create ad-like elements
      const bait = document.createElement('div');
      bait.setAttribute('class', 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links ad-text adSense adnxs adnxs');
      bait.setAttribute('style', 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;');
      document.body.appendChild(bait);

      // Check immediately and after a delay
      const checkBlocked = () => {
        const isBlocked = bait.offsetParent === null || 
                         bait.offsetHeight === 0 || 
                         bait.offsetLeft === 0 || 
                         bait.offsetTop === 0 || 
                         bait.offsetWidth === 0 || 
                         bait.clientHeight === 0 || 
                         bait.clientWidth === 0;
        
        setIsAdBlockDetected(isBlocked);
        setIsVisible(isBlocked);
        
        if (document.body.contains(bait)) {
          document.body.removeChild(bait);
        }
      };

      setTimeout(checkBlocked, 100);
      
      // Also try the Google Ads detection
      if (window.getComputedStyle) {
        const ads = document.createElement('ins');
        ads.className = 'adsbygoogle';
        ads.style.display = 'block';
        ads.style.position = 'absolute';
        ads.style.top = '-1px';
        ads.style.height = '1px';
        document.body.appendChild(ads);
        
        setTimeout(() => {
          const isGoogleBlocked = ads.style.display === 'none' || ads.clientHeight === 0;
          if (isGoogleBlocked) {
            setIsAdBlockDetected(true);
            setIsVisible(true);
          }
          if (document.body.contains(ads)) {
            document.body.removeChild(ads);
          }
        }, 200);
      }
    };

    detectAdBlock();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              <strong>AdBlock Detected!</strong> We provide 32+ premium APIs for FREE. 
              Please disable your ad blocker to support our free services.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-white hover:bg-red-700 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};