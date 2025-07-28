import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import App from './App.tsx'
import './index.css'

// Initialize web vitals tracking
import { trackWebVitals, trackResourceTiming } from '@/utils/webVitals';

// Performance observer for Core Web Vitals
if (typeof window !== 'undefined') {
  trackWebVitals();
  trackResourceTiming();
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </HelmetProvider>
);

declare global {
  function gtag(...args: any[]): void;
}
