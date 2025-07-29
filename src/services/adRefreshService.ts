declare global {
  interface Window {
    googletag: any;
  }
}

class AdRefreshService {
  private static instance: AdRefreshService;
  private lastRefreshTime = 0;
  private readonly MIN_REFRESH_INTERVAL = 30000; // 30 seconds minimum between refreshes
  private refreshedSlots = new Set<string>();

  private constructor() {}

  static getInstance(): AdRefreshService {
    if (!AdRefreshService.instance) {
      AdRefreshService.instance = new AdRefreshService();
    }
    return AdRefreshService.instance;
  }

  canRefresh(): boolean {
    const now = Date.now();
    return (now - this.lastRefreshTime) >= this.MIN_REFRESH_INTERVAL;
  }

  refreshSlot(slotId: string): void {
    if (!this.canRefresh()) {
      console.log(`Ad refresh rate limited for slot: ${slotId}`);
      return;
    }

    if (window.googletag && window.googletag.pubads) {
      try {
        window.googletag.cmd.push(() => {
          const slots = window.googletag.pubads().getSlots();
          const targetSlot = slots.find((slot: any) => 
            slot.getSlotElementId() === slotId
          );
          
          if (targetSlot) {
            window.googletag.pubads().refresh([targetSlot]);
            this.refreshedSlots.add(slotId);
            this.lastRefreshTime = Date.now();
            console.log(`Refreshed ad slot: ${slotId}`);
          } else {
            console.warn(`Slot not found for refresh: ${slotId}`);
          }
        });
      } catch (error) {
        console.error(`Error refreshing ad slot ${slotId}:`, error);
      }
    }
  }

  refreshAllVisibleSlots(): void {
    if (!this.canRefresh()) {
      console.log('Ad refresh rate limited for all slots');
      return;
    }

    if (window.googletag && window.googletag.pubads) {
      try {
        window.googletag.cmd.push(() => {
          const slots = window.googletag.pubads().getSlots();
          const visibleSlots = slots.filter((slot: any) => {
            const element = document.getElementById(slot.getSlotElementId());
            return element && this.isElementVisible(element);
          });
          
          if (visibleSlots.length > 0) {
            window.googletag.pubads().refresh(visibleSlots);
            visibleSlots.forEach((slot: any) => {
              this.refreshedSlots.add(slot.getSlotElementId());
            });
            this.lastRefreshTime = Date.now();
            console.log(`Refreshed ${visibleSlots.length} visible ad slots`);
          }
        });
      } catch (error) {
        console.error('Error refreshing all visible ad slots:', error);
      }
    }
  }

  private isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  markSlotAsDisplayed(slotId: string): void {
    this.refreshedSlots.add(slotId);
  }

  reset(): void {
    this.refreshedSlots.clear();
    this.lastRefreshTime = 0;
  }
}

export const adRefreshService = AdRefreshService.getInstance();