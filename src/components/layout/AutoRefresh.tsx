import { useEffect } from 'react';

export const AutoRefresh: React.FC = () => {
  useEffect(() => {
    // Simple auto-refresh every 1 minute (60000ms)
    const refreshInterval = setInterval(() => {
      window.location.reload();
    }, 60000);

    // Cleanup on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return null; // This component doesn't render anything
};