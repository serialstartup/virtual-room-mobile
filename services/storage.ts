import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TRY_ON_DATA: 'virtual-room-try-on-data',
  ACTIVE_TRY_ONS: 'virtual-room-active-try-ons',
} as const;

export interface TryOnData {
  selectedPersonImage?: string;
  selectedDressImage?: string;
  dressDescription?: string;
  timestamp?: number;
}

export interface ActiveTryOn {
  tryOnId: string;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export const storageService = {
  /**
   * Save try-on form data
   */
  async saveTryOnData(data: TryOnData): Promise<void> {
    try {
      const dataWithTimestamp = {
        ...data,
        timestamp: Date.now(),
      };
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.TRY_ON_DATA,
        JSON.stringify(dataWithTimestamp)
      );
      
    } catch (error) {
      console.error('[STORAGE] ❌ Error saving try-on data:', error);
      throw error;
    }
  },

  /**
   * Load try-on form data
   */
  async loadTryOnData(): Promise<TryOnData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TRY_ON_DATA);
      
      if (!data) {
        return null;
      }
      
      const parsedData: TryOnData = JSON.parse(data);
      
      // Check if data is older than 1 hour (3600000 ms)
      const isExpired = parsedData.timestamp && 
        (Date.now() - parsedData.timestamp) > 3600000;
      
      if (isExpired) {
        await this.clearTryOnData();
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.error('[STORAGE] ❌ Error loading try-on data:', error);
      return null;
    }
  },

  /**
   * Clear try-on form data
   */
  async clearTryOnData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TRY_ON_DATA);
    } catch (error) {
      console.error('[STORAGE] ❌ Error clearing try-on data:', error);
    }
  },

  /**
   * Save active try-on session (when processing starts)
   */
  async saveActiveTryOn(tryOnId: string): Promise<void> {
    try {
      const activeTryOns = await this.getActiveTryOns();
      
      // Remove any existing entry for this tryOnId
      const filtered = activeTryOns.filter(t => t.tryOnId !== tryOnId);
      
      // Add new entry
      const newTryOn: ActiveTryOn = {
        tryOnId,
        timestamp: Date.now(),
        status: 'pending',
      };
      
      filtered.push(newTryOn);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.ACTIVE_TRY_ONS,
        JSON.stringify(filtered)
      );
      
    } catch (error) {
      console.error('[STORAGE] ❌ Error saving active try-on:', error);
    }
  },

  /**
   * Get all active try-on sessions
   */
  async getActiveTryOns(): Promise<ActiveTryOn[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_TRY_ONS);
      
      if (!data) {
        return [];
      }
      
      const activeTryOns: ActiveTryOn[] = JSON.parse(data);
      
      // Filter out old try-ons (older than 1 hour)
      const now = Date.now();
      const filtered = activeTryOns.filter(t => 
        (now - t.timestamp) < 3600000 // 1 hour
      );
      
      // Update storage if we filtered any
      if (filtered.length !== activeTryOns.length) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.ACTIVE_TRY_ONS,
          JSON.stringify(filtered)
        );
      }
      
      return filtered;
    } catch (error) {
      console.error('[STORAGE] ❌ Error getting active try-ons:', error);
      return [];
    }
  },

  /**
   * Remove completed/failed try-on from active list
   */
  async removeActiveTryOn(tryOnId: string): Promise<void> {
    try {
      const activeTryOns = await this.getActiveTryOns();
      const filtered = activeTryOns.filter(t => t.tryOnId !== tryOnId);
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.ACTIVE_TRY_ONS,
        JSON.stringify(filtered)
      );
      
    } catch (error) {
      console.error('[STORAGE] ❌ Error removing active try-on:', error);
    }
  },

  /**
   * Check if there's a try-on in progress for restoration
   */
  async getLastActiveTryOn(): Promise<ActiveTryOn | null> {
    try {
      const activeTryOns = await this.getActiveTryOns();
      
      if (activeTryOns.length === 0) {
        return null;
      }
      
      // Return the most recent one
      const sorted = activeTryOns.sort((a, b) => b.timestamp - a.timestamp);
      return sorted[0];
    } catch (error) {
      console.error('[STORAGE] ❌ Error getting last active try-on:', error);
      return null;
    }
  }
};