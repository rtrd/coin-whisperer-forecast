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
    console.log('BitmedialAdService: Starting aggressive ad container cleanup...');
    
    // Clear the static ad containers from index.html
    const adContainers = [
      '688243f4cd78b050d770b5b9', 
      '688245f4f6b31129f0439a03'
    ];
    
    adContainers.forEach(className => {
      const adElements = document.querySelectorAll(`ins.${className}`);
      adElements.forEach(adElement => {
        // Complete removal and recreation to force fresh ad requests
        const parent = adElement.parentNode;
        if (parent) {
          // Create completely new ad element with fresh attributes
          const newAdElement = document.createElement('ins');
          newAdElement.className = className;
          newAdElement.setAttribute('data-revive-zoneid', adElement.getAttribute('data-revive-zoneid') || '');
          newAdElement.setAttribute('data-revive-id', adElement.getAttribute('data-revive-id') || '');
          
          // Force browser to treat as new element by adding timestamp
          newAdElement.setAttribute('data-refresh-time', Date.now().toString());
          
          parent.replaceChild(newAdElement, adElement);
          console.log(`BitmedialAdService: Aggressively cleared and recreated ad container ${className}`);
        }
      });
    });
  }

  private forceAdRefresh(): Promise<void> {
    return new Promise((resolve) => {
      console.log('BitmedialAdService: Starting forced ad refresh with cache busting...');
      
      // Remove ALL existing Bitmedia-related scripts
      const existingScripts = document.querySelectorAll('script[src*="bmcdn6.com"], script[src*="ctengine.io"]');
      existingScripts.forEach(script => {
        const scriptElement = script as HTMLScriptElement;
        console.log(`BitmedialAdService: Removing script: ${scriptElement.src}`);
        script.remove();
      });

      // Clear any Bitmedia globals that might prevent refresh
      if (window && (window as any).bmRevive) {
        delete (window as any).bmRevive;
        console.log('BitmedialAdService: Cleared bmRevive global');
      }

      // Reload the bmcdn6 scripts with aggressive cache busting
      const scriptConfigs = [
        { className: '688243f4cd78b050d770b5b9', domain: 'cdn.bmcdn6.com' },
        { className: '688245f4f6b31129f0439a03', domain: 'cdn.bmcdn6.com' }
      ];

      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      
      let loadedScripts = 0;
      scriptConfigs.forEach(config => {
        const script = document.createElement('script');
        script.async = true;
        // Aggressive cache busting with timestamp AND random ID
        script.src = `https://${config.domain}/js/${config.className}.js?v=${timestamp}&r=${randomId}&force=1`;
        
        script.onload = () => {
          loadedScripts++;
          console.log(`BitmedialAdService: Force-reloaded script for ${config.className} with cache buster`);
          if (loadedScripts === scriptConfigs.length) {
            // Additional delay to let scripts initialize
            setTimeout(resolve, 500);
          }
        };

        script.onerror = () => {
          loadedScripts++;
          console.warn(`BitmedialAdService: Failed to force-reload script for ${config.className}`);
          if (loadedScripts === scriptConfigs.length) {
            setTimeout(resolve, 500);
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

    console.log('BitmedialAdService: ===== STARTING AGGRESSIVE AD REFRESH =====');
    this.isLoading = true;

    try {
      // Step 1: Aggressively clear existing ad containers
      console.log('BitmedialAdService: Phase 1 - Aggressive container cleanup...');
      this.clearAdContainers();
      
      // Step 2: Wait for DOM cleanup
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Step 3: Force complete script refresh with cache busting
      console.log('BitmedialAdService: Phase 2 - Force script refresh...');
      await this.forceAdRefresh();
      
      // Step 4: Refresh the main appsha-prm script with cache busting
      console.log('BitmedialAdService: Phase 3 - Refreshing main ad script...');
      await this.createBitmedialScript();
      
      // Step 5: Extended delay to allow fresh ads to load
      console.log('BitmedialAdService: Phase 4 - Waiting for fresh ads to initialize...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      console.log('BitmedialAdService: ===== AGGRESSIVE AD REFRESH COMPLETED =====');
    } catch (error) {
      console.warn('BitmedialAdService: Aggressive ad refresh failed:', error);
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