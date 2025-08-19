import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';

interface StableDataContextType {
  registerDataFetcher: (key: string, fetcher: () => Promise<any>) => void;
  unregisterDataFetcher: (key: string) => void;
  isLoading: (key: string) => boolean;
}

const StableDataContext = createContext<StableDataContextType | null>(null);

export const useStableDataContext = () => {
  const context = useContext(StableDataContext);
  if (!context) {
    throw new Error('useStableDataContext must be used within StableDataProvider');
  }
  return context;
};

interface StableDataProviderProps {
  children: React.ReactNode;
}

export const StableDataProvider: React.FC<StableDataProviderProps> = ({ children }) => {
  const fetchersRef = useRef<Map<string, () => Promise<any>>>(new Map());
  const loadingStatesRef = useRef<Map<string, boolean>>(new Map());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const registerDataFetcher = useCallback((key: string, fetcher: () => Promise<any>) => {
    fetchersRef.current.set(key, fetcher);
  }, []);

  const unregisterDataFetcher = useCallback((key: string) => {
    // Cancel any pending request
    const controller = abortControllersRef.current.get(key);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(key);
    }
    
    fetchersRef.current.delete(key);
    loadingStatesRef.current.delete(key);
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStatesRef.current.get(key) || false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel all pending requests
      abortControllersRef.current.forEach(controller => controller.abort());
      abortControllersRef.current.clear();
      fetchersRef.current.clear();
      loadingStatesRef.current.clear();
    };
  }, []);

  const contextValue: StableDataContextType = {
    registerDataFetcher,
    unregisterDataFetcher,
    isLoading,
  };

  return (
    <StableDataContext.Provider value={contextValue}>
      {children}
    </StableDataContext.Provider>
  );
};