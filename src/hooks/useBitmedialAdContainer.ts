import { useEffect } from 'react';
import { bitmedialAdService } from '@/services/bitmedialAdService';

export const useBitmedialAdContainer = (containerId: string) => {
  useEffect(() => {
    // Register container when component mounts
    bitmedialAdService.registerContainer(containerId);
    
    // Cleanup when component unmounts
    return () => {
      bitmedialAdService.unregisterContainer(containerId);
    };
  }, [containerId]);
};

export const useBitmedialAdContainers = (containerIds: string[]) => {
  useEffect(() => {
    // Register all containers when component mounts
    containerIds.forEach(id => {
      bitmedialAdService.registerContainer(id);
    });
    
    // Cleanup when component unmounts
    return () => {
      containerIds.forEach(id => {
        bitmedialAdService.unregisterContainer(id);
      });
    };
  }, [containerIds]);
};