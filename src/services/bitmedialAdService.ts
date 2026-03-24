class BitmedialAdService {
  private static instance: BitmedialAdService;

  private constructor() {}

  static getInstance(): BitmedialAdService {
    if (!BitmedialAdService.instance) {
      BitmedialAdService.instance = new BitmedialAdService();
    }
    return BitmedialAdService.instance;
  }

  async refreshAds(): Promise<void> {
    return;
  }

  async initializeAds(): Promise<void> {
    return;
  }

  cleanup(): void {
    return;
  }

  isAdLoading(): boolean {
    return false;
  }
}

export const bitmedialAdService = BitmedialAdService.getInstance();
