export interface HiddenOrder {
  id: string
  title: string
  date: string
  price?: string
  hiddenAt: string
}

export interface StorageData {
  hiddenOrders: HiddenOrder[]
  isEnabled: boolean
  showHidden: boolean
}

export const enum OrderStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  TEMPORARILY_SHOWN = 'temporarily_shown'
}

export const enum StorageKey {
  HIDDEN_ORDERS = 'hiddenOrders',
  IS_ENABLED = 'isEnabled',
  SHOW_HIDDEN = 'showHidden'
}

export interface OrderElement extends HTMLElement {
  dataset: {
    orderId?: string
    asin?: string
  }
}

export interface AmazonOrderData {
  orderId: string
  title: string
  date: string
  price?: string
  deliveryStatus?: string
  element: OrderElement
} 