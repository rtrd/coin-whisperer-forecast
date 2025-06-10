const API_KEY = import.meta.env.VITE_TOKEN_KEY;

export const getWordPressPost = async <T>(): Promise<T> => {
  try {
    const response = await fetch("https://blog.pumpparade.com//wp-json/wp/v2/posts");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);    
    throw error;
  }
};


export const getAllCryptos = async <T>(): Promise<T> => {
  try {
    const queryParams = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '200',
      page: '1',
      sparkline: 'false'
    });

    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?${queryParams.toString()}`, {
      headers: {
        accept: 'application/json',
        'key': API_KEY 
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

