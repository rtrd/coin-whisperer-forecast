import React, { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdBlockDetector: React.FC = () => {
  const [isAdBlockDetected, setIsAdBlockDetected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Create a test element that adblock would typically hide
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-10000px';
    testAd.style.width = '1px';
    testAd.style.height = '1px';
    
    document.body.appendChild(testAd);

    // Check if the element is hidden by adblock
    setTimeout(() => {
      const isBlocked = testAd.offsetHeight === 0 || 
                       window.getComputedStyle(testAd).display === 'none' ||
                       window.getComputedStyle(testAd).visibility === 'hidden';
      
      setIsAdBlockDetected(isBlocked);
      setIsVisible(isBlocked);
      document.body.removeChild(testAd);
    }, 100);
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