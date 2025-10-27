import { useEffect } from 'react';

export const AutoRefresh: React.FC = () => {
  useEffect(() => {
    // Simple auto-refresh every 2 minutes (120000ms)
    const refreshInterval = setInterval(() => {
      window.location.reload();
    }, 120000);

    // Cleanup on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return null; // This component doesn't render anything
};