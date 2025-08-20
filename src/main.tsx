
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization'
import App from './App.tsx'
import './index.css'

// Performance optimization initialization with safe React hook usage
const PerformanceWrapper = () => {
  // Only initialize performance optimization if React is properly loaded
  const performanceHooks = usePerformanceOptimization();
  
  return <App />;
};

// Ensure DOM is loaded before mounting React
const initializeApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  try {
    createRoot(rootElement).render(
      <HelmetProvider>
        <ErrorBoundary>
          <PerformanceWrapper />
        </ErrorBoundary>
      </HelmetProvider>
    );
  } catch (error) {
    console.error('Failed to initialize React app:', error);
    // Fallback: render basic content
    rootElement.innerHTML = '<div>Loading...</div>';
  }
};

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

declare global {
  function gtag(...args: any[]): void;
}
