import { useEffect } from 'react';

export const useAdScript = () => {
  useEffect(() => {
    // Remove existing script if it exists
    const existingScript = document.querySelector('script[src*="appsha-prm.ctengine.io"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append new script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://appsha-prm.ctengine.io/js/script.js?wkey=Fkrv2lWxUV';
    
    // Add timestamp to prevent caching
    script.src += `&t=${Date.now()}`;
    
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[src*="appsha-prm.ctengine.io"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []); // Empty dependency array means this runs on every mount
};