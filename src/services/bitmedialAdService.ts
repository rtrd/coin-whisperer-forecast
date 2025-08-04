// Bitmedia Ad Service for handling ad refreshes and management
class BitmedialAdService {
  private static instance: BitmedialAdService;
  private lastRefreshTime = 0;
  private readonly refreshInterval = 2000; // 2 seconds between refreshes
  private isLoading = false;
  private scriptElement: HTMLScriptElement | null = null;
  private adContainers = new Set<string>();
  private initialized = false;

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
    console.log('BitmedialAdService: Removing existing Bitmedia scripts and containers');
    
    // Remove existing Bitmedia script
    const existingScript = document.querySelector('script[src*="appsha-prm.ctengine.io"]');
    if (existingScript) {
      existingScript.remove();
      console.log('BitmedialAdService: Removed existing appsha script');
    }
    
    // Remove old static ad containers
    const oldContainers = document.querySelectorAll('ins[class*="688"]');
    oldContainers.forEach(container => {
      container.remove();
      console.log('BitmedialAdService: Removed old static ad container');
    });
    
    if (this.scriptElement) {
      this.scriptElement.remove();
      this.scriptElement = null;
      console.log('BitmedialAdService: Removed current script element');
    }
    
    // Clear all ad containers content
    this.clearAdContainers();
  }

  private clearAdContainers(): void {
    this.adContainers.forEach(containerId => {
      const container = document.getElementById(`bitmedia-ad-${containerId}`);
      if (container) {
        container.innerHTML = '<span class="opacity-50">Advertisement Loading...</span>';
        console.log(`BitmedialAdService: Cleared container ${containerId}`);
      }
    });
  }

  registerContainer(containerId: string): void {
    this.adContainers.add(containerId);
    console.log(`BitmedialAdService: Registered container ${containerId}. Total containers: ${this.adContainers.size}`);
  }

  unregisterContainer(containerId: string): void {
    this.adContainers.delete(containerId);
    console.log(`BitmedialAdService: Unregistered container ${containerId}. Total containers: ${this.adContainers.size}`);
  }

  private createBitmedialScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.removeExistingScript();

      console.log('BitmedialAdService: Creating new Bitmedia script with dynamic containers');
      
      // Create dynamic ad containers first
      this.createDynamicAdContainers();

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://appsha-prm.ctengine.io/js/script.js?wkey=Fkrv2lWxUV&t=${Date.now()}`;
      
      script.onload = () => {
        console.log('BitmedialAdService: Script loaded successfully');
        this.isLoading = false;
        this.lastRefreshTime = Date.now();
        this.populateAdContainers();
        resolve();
      };

      script.onerror = () => {
        console.error('BitmedialAdService: Script failed to load');
        this.isLoading = false;
        reject(new Error('Failed to load Bitmedia script'));
      };

      this.scriptElement = script;
      document.head.appendChild(script);
    });
  }

  private createDynamicAdContainers(): void {
    // Create dynamic ad containers that Bitmedia can populate
    this.adContainers.forEach(containerId => {
      const container = document.getElementById(`bitmedia-ad-${containerId}`);
      if (container) {
        // Create a unique ins element for each container
        const insElement = document.createElement('ins');
        insElement.className = `bitmedia-${containerId}-${Date.now()}`;
        insElement.style.display = 'inline-block';
        insElement.style.width = '100%';
        insElement.style.height = '100%';
        insElement.setAttribute('data-ad-slot', containerId);
        
        container.innerHTML = '';
        container.appendChild(insElement);
        
        console.log(`BitmedialAdService: Created dynamic container for ${containerId}`);
      }
    });
  }

  private populateAdContainers(): void {
    // Wait a bit for the script to initialize
    setTimeout(() => {
      this.adContainers.forEach(containerId => {
        const container = document.getElementById(`bitmedia-ad-${containerId}`);
        if (container) {
          // Update container to show that ads are ready
          const loadingSpan = container.querySelector('span');
          if (loadingSpan) {
            loadingSpan.textContent = '';
          }
          console.log(`BitmedialAdService: Populated container ${containerId}`);
        }
      });
    }, 1000);
  }

  async refreshAds(): Promise<void> {
    if (!this.canRefresh()) {
      console.log('BitmedialAdService: Refresh rate limited, skipping refresh');
      return;
    }

    console.log('BitmedialAdService: Starting ad refresh...');
    this.isLoading = true;

    try {
      // Wait a bit for any existing ads to finish loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('BitmedialAdService: Removing existing script and reloading...');
      // Remove and reload the Bitmedia script
      await this.createBitmedialScript();
      
      // Additional delay to allow ads to initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('BitmedialAdService: Ad refresh completed successfully');
    } catch (error) {
      console.warn('BitmedialAdService: Ad refresh failed:', error);
      this.isLoading = false;
    }
  }

  async initializeAds(): Promise<void> {
    if (this.initialized && this.scriptElement) {
      console.log('BitmedialAdService: Already initialized, skipping');
      return;
    }

    console.log(`BitmedialAdService: Initializing ads with ${this.adContainers.size} containers...`);
    this.isLoading = true;
    
    try {
      await this.createBitmedialScript();
      this.initialized = true;
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
    this.initialized = false;
    this.adContainers.clear();
  }

  isAdLoading(): boolean {
    return this.isLoading;
  }
}

export const bitmedialAdService = BitmedialAdService.getInstance();