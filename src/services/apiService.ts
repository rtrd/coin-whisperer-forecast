
import { CryptoToken } from '@/types/crypto';

const API_KEY = import.meta.env.VITE_TOKEN_KEY;

class ApiService {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  async getAllCryptos(): Promise<CryptoToken[]> {
    try {
      const queryParams = new URLSearchParams({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '200',
        page: '1',
        sparkline: 'false'
      });

      const response = await fetch(`${this.baseUrl}/coins/markets?${queryParams.toString()}`, {
        headers: {
          accept: 'application/json',
          'key': API_KEY || ''
        }
      });

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("API fetch error:", error);
      throw error;
    }
  }

  async getWordPressPost<T>(): Promise<T> {
    try {
      const response = await fetch("https://blog.pumpparade.com//wp-json/wp/v2/posts");

      if (!response.ok) {
        throw new Error(`WordPress API error! status: ${response.status}`);
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error("WordPress fetch error:", error);    
      throw error;
    }
  }
}

export const apiService = new ApiService();
