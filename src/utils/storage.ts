import type { HiddenOrder, StorageData } from '@/types';
import { StorageKey } from '@/types';
import { format } from 'date-fns';

class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * Returns the appropriate storage instance based on environment
   * - chrome.storage.sync in extension environment
   * - localStorage wrapper in browser environment
   */
  private get storageInstance() {
    if (
      typeof chrome !== 'undefined' &&
      chrome.storage &&
      chrome.storage.sync
    ) {
      return chrome.storage.sync;
    }

    // localStorage wrapper to match chrome.storage.sync API
    return {
      get: (
        keys: string | string[] | Record<string, any> | null = null,
      ): Promise<Record<string, any>> => {
        return new Promise((resolve) => {
          const result: Record<string, any> = {};

          if (keys === null) {
            // Get all items
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key) {
                try {
                  result[key] = JSON.parse(localStorage.getItem(key) || 'null');
                } catch {
                  result[key] = localStorage.getItem(key);
                }
              }
            }
          } else if (typeof keys === 'string') {
            // Get single key
            try {
              result[keys] = JSON.parse(localStorage.getItem(keys) || 'null');
            } catch {
              result[keys] = localStorage.getItem(keys);
            }
          } else if (Array.isArray(keys)) {
            // Get multiple keys
            keys.forEach((key) => {
              try {
                result[key] = JSON.parse(localStorage.getItem(key) || 'null');
              } catch {
                result[key] = localStorage.getItem(key);
              }
            });
          } else if (typeof keys === 'object') {
            // Get keys with defaults
            Object.keys(keys).forEach((key) => {
              try {
                const stored = localStorage.getItem(key);
                result[key] = stored ? JSON.parse(stored) : keys[key];
              } catch {
                result[key] = localStorage.getItem(key) || keys[key];
              }
            });
          }

          resolve(result);
        });
      },

      set: (items: Record<string, any>): Promise<void> => {
        return new Promise((resolve) => {
          Object.keys(items).forEach((key) => {
            try {
              localStorage.setItem(key, JSON.stringify(items[key]));
            } catch (error) {
              console.error('Error setting localStorage item:', error);
            }
          });
          resolve();
        });
      },
    };
  }

  async get<T>(key: StorageKey): Promise<T | null> {
    try {
      const result = await this.storageInstance.get(key);
      return result[key] || null;
    } catch (error) {
      console.error('Error getting from storage:', error);
      return null;
    }
  }

  async set<T>(key: StorageKey, value: T): Promise<void> {
    try {
      await this.storageInstance.set({ [key]: value });
    } catch (error) {
      console.error('Error setting to storage:', error);
    }
  }

  async getAll(): Promise<StorageData> {
    try {
      const result = await this.storageInstance.get();
      return {
        hiddenOrders: result[StorageKey.HIDDEN_ORDERS] || [],
        isEnabled: result[StorageKey.IS_ENABLED] ?? true,
        showHidden: result[StorageKey.SHOW_HIDDEN] ?? false,
      };
    } catch (error) {
      console.error('Error getting all from storage:', error);
      return {
        hiddenOrders: [],
        isEnabled: true,
        showHidden: false,
      };
    }
  }

  async hideOrder(order: Omit<HiddenOrder, 'hiddenAt'>): Promise<void> {
    const hiddenOrders =
      (await this.get<HiddenOrder[]>(StorageKey.HIDDEN_ORDERS)) || [];

    // Evita duplicati
    if (hiddenOrders.some((h) => h.id === order.id)) {
      return;
    }

    const hiddenOrder: HiddenOrder = {
      ...order,
      hiddenAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    };

    hiddenOrders.push(hiddenOrder);
    await this.set(StorageKey.HIDDEN_ORDERS, hiddenOrders);
  }

  async unhideOrder(orderId: string): Promise<void> {
    const hiddenOrders =
      (await this.get<HiddenOrder[]>(StorageKey.HIDDEN_ORDERS)) || [];
    const filteredOrders = hiddenOrders.filter((order) => order.id !== orderId);
    await this.set(StorageKey.HIDDEN_ORDERS, filteredOrders);
  }

  async isOrderHidden(orderId: string): Promise<boolean> {
    const hiddenOrders =
      (await this.get<HiddenOrder[]>(StorageKey.HIDDEN_ORDERS)) || [];
    return hiddenOrders.some((order) => order.id === orderId);
  }

  async clearAllHiddenOrders(): Promise<void> {
    await this.set(StorageKey.HIDDEN_ORDERS, []);
  }

  async toggleEnabled(): Promise<boolean> {
    const currentState = await this.get<boolean>(StorageKey.IS_ENABLED);
    const newState = !currentState;
    await this.set(StorageKey.IS_ENABLED, newState);
    return newState;
  }

  async toggleShowHidden(): Promise<boolean> {
    const currentState = await this.get<boolean>(StorageKey.SHOW_HIDDEN);
    const newState = !currentState;
    await this.set(StorageKey.SHOW_HIDDEN, newState);
    return newState;
  }
}

export const storage = StorageManager.getInstance();
