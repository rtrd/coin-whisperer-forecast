class AdRefreshService {
  private static instance: AdRefreshService;

  private constructor() {}

  static getInstance(): AdRefreshService {
    if (!AdRefreshService.instance) {
      AdRefreshService.instance = new AdRefreshService();
    }
    return AdRefreshService.instance;
  }

  canRefresh(): boolean {
    return false;
  }

  refreshSlot(_slotId: string): void {}

  refreshAllVisibleSlots(): void {}

  markSlotAsDisplayed(_slotId: string): void {}

  reset(): void {}
}

export const adRefreshService = AdRefreshService.getInstance();
