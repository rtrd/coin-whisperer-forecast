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

  private clearAdContainers(): void {
    // Clear the static ad containers from index.html
    const adContainers = [
      '688243f4cd78b050d770b5b9', 
      '688245f4f6b31129f0439a03'
    ];
    
    adContainers.forEach(className => {
      const adElement = document.querySelector(`ins.${className}`);
      if (adElement) {
        // Clear the ad content by removing and recreating the element
        const parent = adElement.parentNode;
        const newAdElement = adElement.cloneNode(false) as HTMLElement;
        parent?.replaceChild(newAdElement, adElement);
        console.log(`BitmedialAdService: Cleared ad container ${className}`);
      }
    });
  }

  private reloadBitmedialScripts(): Promise<void> {
    return new Promise((resolve) => {
      // Remove existing bmcdn6 scripts
      const existingScripts = document.querySelectorAll('script[src*="bmcdn6.com"]');
      existingScripts.forEach(script => script.remove());

      // Reload the bmcdn6 scripts with new timestamps
      const scriptConfigs = [
        { className: '688243f4cd78b050d770b5b9', domain: 'cdn.bmcdn6.com' },
        { className: '688245f4f6b31129f0439a03', domain: 'cdn.bmcdn6.com' }
      ];

      let loadedScripts = 0;
      scriptConfigs.forEach(config => {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://${config.domain}/js/${config.className}.js?v=${Date.now()}`;
        
        script.onload = () => {
          loadedScripts++;
          console.log(`BitmedialAdService: Reloaded script for ${config.className}`);
          if (loadedScripts === scriptConfigs.length) {
            resolve();
          }
        };

        script.onerror = () => {
          loadedScripts++;
          console.warn(`BitmedialAdService: Failed to reload script for ${config.className}`);
          if (loadedScripts === scriptConfigs.length) {
            resolve();
          }
        };

        document.head.appendChild(script);
      });
    });
  }

  async refreshAds(): Promise<void> {
    if (!this.canRefresh()) {
      console.log('BitmedialAdService: Refresh rate limited, skipping refresh');
      return;
    }

    console.log('BitmedialAdService: Starting comprehensive ad refresh...');
    this.isLoading = true;

    try {
      // Step 1: Clear existing ad containers
      console.log('BitmedialAdService: Clearing existing ad containers...');
      this.clearAdContainers();
      
      // Step 2: Wait for DOM cleanup
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Step 3: Reload bmcdn6 scripts to refresh static ads
      console.log('BitmedialAdService: Reloading bmcdn6 ad scripts...');
      await this.reloadBitmedialScripts();
      
      // Step 4: Refresh the appsha-prm script as well
      console.log('BitmedialAdService: Refreshing appsha-prm script...');
      await this.createBitmedialScript();
      
      // Step 5: Final delay to allow all ads to initialize
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('BitmedialAdService: Comprehensive ad refresh completed successfully');
    } catch (error) {
      console.warn('BitmedialAdService: Ad refresh failed:', error);
      this.isLoading = false;
    }
  }

  async initializeAds(): Promise<void> {
    if (this.scriptElement) {
      console.log('BitmedialAdService: Already initialized, skipping');
      return; // Already initialized
    }

    console.log('BitmedialAdService: Initializing ads...');
    this.isLoading = true;
    
    try {
      await this.createBitmedialScript();
      console.log('BitmedialAdService: Ad initialization completed successfully');
    } catch (error) {
      console.warn('BitmedialAdService: Ad initialization failed:', error);
      this.isLoading = false;
    }
  }

  cleanup(): void {
    console.log('BitmedialAdService: Cleaning up ads...');
    this.removeExistingScript();
    this.lastRefreshTime = 0;
    this.isLoading = false;
  }

  isAdLoading(): boolean {
    return this.isLoading;
  }
}

export const bitmedialAdService = BitmedialAdService.getInstance();