// Bitmedia Ad Service for handling ad refreshes and management
class BitmedialAdService {
  private static instance: BitmedialAdService;
  private lastRefreshTime = 0;
  private readonly refreshInterval = 2000; // 2 seconds between refreshes
  private isLoading = false;
  private scriptElement: HTMLScriptElement | null = null;

  private constructor() {}

  static getInstance(): BitmedialAdService {
    if (!BitmedialAdService.instance) {
      BitmedialAdService.instance = new BitmedialAdService();
    }
    return BitmedialAdService.instance;
  }

  private canRefresh(): boolean {
    const now = Date.now();
    return now - this.lastRefreshTime >= this.refreshInterval && !this.isLoading;
  }

  private removeExistingScript(): void {
    // Remove existing Bitmedia script
    const existingScript = document.querySelector('script[src*="appsha-prm.ctengine.io"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    if (this.scriptElement) {
      this.scriptElement.remove();
      this.scriptElement = null;
    }
  }

  private createBitmedialScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.removeExistingScript();

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://appsha-prm.ctengine.io/js/script.js?wkey=Fkrv2lWxUV&t=${Date.now()}`;
      
      script.onload = () => {
        this.isLoading = false;
        this.lastRefreshTime = Date.now();
        resolve();
      };

      script.onerror = () => {
        this.isLoading = false;
        reject(new Error('Failed to load Bitmedia script'));
      };

      this.scriptElement = script;
      document.head.appendChild(script);
    });
  }

  async refreshAds(): Promise<void> {
    if (!this.canRefresh()) {
      return;
    }

    this.isLoading = true;

    try {
      // Wait a bit for any existing ads to finish loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Remove and reload the Bitmedia script
      await this.createBitmedialScript();
      
      // Additional delay to allow ads to initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.warn('Bitmedia ad refresh failed:', error);
      this.isLoading = false;
    }
  }

  async initializeAds(): Promise<void> {
    if (this.scriptElement) {
      return; // Already initialized
    }

    this.isLoading = true;
    
    try {
      await this.createBitmedialScript();
    } catch (error) {
      console.warn('Bitmedia ad initialization failed:', error);
      this.isLoading = false;
    }
  }

  cleanup(): void {
    this.removeExistingScript();
    this.lastRefreshTime = 0;
    this.isLoading = false;
  }

  isAdLoading(): boolean {
    return this.isLoading;
  }
}

export const bitmedialAdService = BitmedialAdService.getInstance();