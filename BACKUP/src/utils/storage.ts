import type { HiddenOrder, StorageData } from '@/types'
import { StorageKey } from '@/types'
import { format } from 'date-fns'

class StorageManager {
  private static instance: StorageManager
  
  private constructor() {}
  
  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  async get<T>(key: StorageKey): Promise<T | null> {
    try {
      const result = await chrome.storage.local.get(key)
      return result[key] || null
    } catch (error) {
      console.error('Error getting from storage:', error)
      return null
    }
  }

  async set<T>(key: StorageKey, value: T): Promise<void> {
    try {
      await chrome.storage.local.set({ [key]: value })
    } catch (error) {
      console.error('Error setting to storage:', error)
    }
  }

  async getAll(): Promise<StorageData> {
    try {
      const result = await chrome.storage.local.get()
      return {
        hiddenOrders: result[StorageKey.HIDDEN_ORDERS] || [],
        isEnabled: result[StorageKey.IS_ENABLED] ?? true,
        showHidden: result[StorageKey.SHOW_HIDDEN] ?? false
      }
    } catch (error) {
      console.error('Error getting all from storage:', error)
      return {
        hiddenOrders: [],
        isEnabled: true,
        showHidden: false
      }
    }
  }

  async hideOrder(order: Omit<HiddenOrder, 'hiddenAt'>): Promise<void> {
    const hiddenOrders = await this.get<HiddenOrder[]>(StorageKey.HIDDEN_ORDERS) || []
    
    // Evita duplicati
    if (hiddenOrders.some(h => h.id === order.id)) {
      return
    }

    const hiddenOrder: HiddenOrder = {
      ...order,
      hiddenAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }

    hiddenOrders.push(hiddenOrder)
    await this.set(StorageKey.HIDDEN_ORDERS, hiddenOrders)
  }

  async unhideOrder(orderId: string): Promise<void> {
    const hiddenOrders = await this.get<HiddenOrder[]>(StorageKey.HIDDEN_ORDERS) || []
    const filteredOrders = hiddenOrders.filter(order => order.id !== orderId)
    await this.set(StorageKey.HIDDEN_ORDERS, filteredOrders)
  }

  async isOrderHidden(orderId: string): Promise<boolean> {
    const hiddenOrders = await this.get<HiddenOrder[]>(StorageKey.HIDDEN_ORDERS) || []
    return hiddenOrders.some(order => order.id === orderId)
  }

  async clearAllHiddenOrders(): Promise<void> {
    await this.set(StorageKey.HIDDEN_ORDERS, [])
  }

  async toggleEnabled(): Promise<boolean> {
    const currentState = await this.get<boolean>(StorageKey.IS_ENABLED) ?? true
    const newState = !currentState
    await this.set(StorageKey.IS_ENABLED, newState)
    return newState
  }

  async toggleShowHidden(): Promise<boolean> {
    const currentState = await this.get<boolean>(StorageKey.SHOW_HIDDEN) ?? false
    const newState = !currentState
    await this.set(StorageKey.SHOW_HIDDEN, newState)
    return newState
  }
}

export const storage = StorageManager.getInstance() 