import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization'
import App from './App.tsx'
import './index.css'

// Performance optimization initialization
const PerformanceWrapper = () => {
  usePerformanceOptimization();
  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ErrorBoundary>
      <PerformanceWrapper />
    </ErrorBoundary>
  </HelmetProvider>
);

declare global {
  function gtag(...args: any[]): void;
}
