
// Re-export from the new centralized API service
export { apiService } from '../src/services/apiService';

// Legacy exports for backward compatibility
export const getAllCryptos = async () => {
  const { apiService } = await import('../src/services/apiService');
  return apiService.getAllCryptos();
};

export const getWordPressPost = async <T>(): Promise<T> => {
  const { apiService } = await import('../src/services/apiService');
  return apiService.getWordPressPost<T>();
};
