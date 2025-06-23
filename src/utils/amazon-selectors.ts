import type { AmazonOrderData, OrderElement } from '@/types'

export class AmazonSelectors {
  // Selettori per gli ordini (possono cambiare nel tempo)
  static readonly ORDER_SELECTORS = [
    '[data-order-id]',
    '.order-card',
    '.a-box-group.a-spacing-base',
    '.order-info',
    '[data-testid="order-card"]'
  ]

  // Selettori per i contenitori degli ordini
  static readonly ORDER_CONTAINER_SELECTORS = [
    '#ordersContainer',
    '.order-list',
    '[data-testid="order-history-list"]',
    '.a-section.a-spacing-none.order-list'
  ]

  // Selettori per i titoli degli ordini
  static readonly ORDER_TITLE_SELECTORS = [
    '.a-link-normal',
    '.order-title',
    '[data-testid="order-title"]',
    '.a-size-medium.a-color-base'
  ]

  // Selettori per le date degli ordini
  static readonly ORDER_DATE_SELECTORS = [
    '.order-date',
    '.a-color-secondary',
    '[data-testid="order-date"]',
    '.a-size-base.a-color-secondary'
  ]

  // Selettori per i prezzi degli ordini
  static readonly ORDER_PRICE_SELECTORS = [
    '.order-price',
    '.a-price-whole',
    '[data-testid="order-price"]',
    '.a-color-price'
  ]

  /**
   * Trova tutti gli elementi ordine nella pagina
   */
  static findOrderElements(): OrderElement[] {
    const orders: OrderElement[] = []
    
    for (const selector of this.ORDER_SELECTORS) {
      const elements = document.querySelectorAll(selector) as NodeListOf<OrderElement>
      elements.forEach(element => {
        if (!orders.includes(element)) {
          orders.push(element)
        }
      })
    }
    
    return orders
  }

  /**
   * Trova il contenitore principale degli ordini
   */
  static findOrderContainer(): Element | null {
    for (const selector of this.ORDER_CONTAINER_SELECTORS) {
      const container = document.querySelector(selector)
      if (container) {
        return container
      }
    }
    return document.body
  }

  /**
   * Estrae i dati dell'ordine da un elemento DOM
   */
  static extractOrderData(element: OrderElement): AmazonOrderData | null {
    const orderId = this.extractOrderId(element)
    if (!orderId) return null

    const title = this.extractOrderTitle(element)
    const date = this.extractOrderDate(element)
    const price = this.extractOrderPrice(element)

    return {
      orderId,
      title: title || 'Ordine senza titolo',
      date: date || 'Data non disponibile',
      price: price || 'Prezzo non disponibile',
      element
    }
  }

  /**
   * Estrae l'ID dell'ordine dall'elemento
   */
  private static extractOrderId(element: OrderElement): string | null {
    // Prova con data-order-id
    if (element.dataset.orderId) {
      return element.dataset.orderId
    }

    // Prova con data-asin
    if (element.dataset.asin) {
      return element.dataset.asin
    }

    // Cerca nell'HTML per pattern di ID ordine Amazon
    const text = element.textContent || ''
    const orderIdMatch = text.match(/(?:Order|Ordine)\s*#?\s*([A-Z0-9-]{10,})/i)
    if (orderIdMatch) {
      return orderIdMatch[1]
    }

    // Fallback: usa un hash dell'elemento
    const elementText = element.textContent?.trim() || ''
    const elementHtml = element.innerHTML
    return this.generateHash(elementText + elementHtml)
  }

  /**
   * Estrae il titolo dell'ordine
   */
  private static extractOrderTitle(element: OrderElement): string | null {
    for (const selector of this.ORDER_TITLE_SELECTORS) {
      const titleElement = element.querySelector(selector)
      if (titleElement?.textContent?.trim()) {
        return titleElement.textContent.trim()
      }
    }
    return null
  }

  /**
   * Estrae la data dell'ordine
   */
  private static extractOrderDate(element: OrderElement): string | null {
    for (const selector of this.ORDER_DATE_SELECTORS) {
      const dateElement = element.querySelector(selector)
      if (dateElement?.textContent?.trim()) {
        return dateElement.textContent.trim()
      }
    }
    return null
  }

  /**
   * Estrae il prezzo dell'ordine
   */
  private static extractOrderPrice(element: OrderElement): string | null {
    for (const selector of this.ORDER_PRICE_SELECTORS) {
      const priceElement = element.querySelector(selector)
      if (priceElement?.textContent?.trim()) {
        return priceElement.textContent.trim()
      }
    }
    return null
  }

  /**
   * Genera un hash semplice per identificare univocamente un elemento
   */
  private static generateHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return `order_${Math.abs(hash).toString(36)}`
  }
} 