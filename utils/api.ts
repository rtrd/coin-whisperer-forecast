
// Re-export from the new centralized API service
export { apiService } from '../src/services/apiService';

// Legacy exports for backward compatibility
export const getAllCryptos = async () => {
  return apiService.getAllCryptos();
};

export const getWordPressPost = async <T>(): Promise<T> => {
  return apiService.getWordPressPost<T>();
};
