import type { AmazonOrderData, OrderElement } from '@/types'

export class AmazonSelectors {
  // Selettori per gli ordini (basati sulla struttura reale di Amazon)
  static readonly ORDER_SELECTORS = [
    '.order-card__list',
    '.order-card.js-order-card',
    '.order-card',
    '.a-box-group.a-spacing-base[data-aoc-status="visible"]',
    '[data-order-id]',
    '[data-testid="order-card"]'
  ]

  // Selettori per i contenitori degli ordini
  static readonly ORDER_CONTAINER_SELECTORS = [
    '#ordersContainer',
    '.order-list',
    '[data-testid="order-history-list"]',
    '.a-section.a-spacing-none.order-list',
    'ul[role="list"]', // Per contenitori di liste di ordini
    '.order-card__list' // Container specifico di Amazon
  ]

  // Selettori per i titoli/prodotti degli ordini
  static readonly ORDER_TITLE_SELECTORS = [
    '.yohtmlc-product-title a',
    '.yohtmlc-product-title .a-link-normal',
    '.product-title a',
    '.a-link-normal[href*="/dp/"]',
    '.order-title',
    '[data-testid="order-title"]'
  ]

  // Selettori per le date degli ordini
  static readonly ORDER_DATE_SELECTORS = [
    '.order-header__header-list-item .a-size-base.a-color-secondary.aok-break-word',
    '.order-date',
    '.a-color-secondary[title*="20"]', // Fallback per date
    '[data-testid="order-date"]'
  ]

  // Selettori per i prezzi/totali degli ordini
  static readonly ORDER_PRICE_SELECTORS = [
    '.order-header__header-list-item .a-size-base.a-color-secondary.aok-break-word',
    '.order-price',
    '.a-price-whole',
    '[data-testid="order-price"]',
    '.a-color-price'
  ]

  // Selettori per l'ID dell'ordine
  static readonly ORDER_ID_SELECTORS = [
    '.yohtmlc-order-id .a-color-secondary[dir="ltr"]',
    '.yohtmlc-order-id span:last-child',
    '.order-id',
    '[data-order-id]'
  ]

  // Selettori per lo stato di consegna
  static readonly DELIVERY_STATUS_SELECTORS = [
    '.delivery-box__primary-text',
    '.a-size-medium.delivery-box__primary-text.a-text-bold',
    '.yohtmlc-shipment-status-primaryText',
    '.delivery-status'
  ]

  // Selettori per l'indirizzo di spedizione
  static readonly SHIPPING_ADDRESS_SELECTORS = [
    '.yohtmlc-recipient',
    '.insert-encrypted-trigger-text',
    '.a-popover-trigger.a-declarative'
  ]

  /**
   * Trova tutti gli elementi ordine nella pagina
   */
  static findOrderElements(): OrderElement[] {
    const orders: OrderElement[] = []
    
    for (const selector of this.ORDER_SELECTORS) {
      try {
        const elements = document.querySelectorAll(selector) as NodeListOf<OrderElement>
        elements.forEach(element => {
          if (!orders.includes(element) && this.isValidOrderElement(element)) {
            orders.push(element)
          }
        })
      } catch (error) {
        console.debug(`Selector ${selector} failed:`, error)
      }
    }
    
    return orders
  }

  /**
   * Verifica se un elemento è un ordine valido
   */
  private static isValidOrderElement(element: OrderElement): boolean {
    // Verifica che l'elemento contenga almeno alcuni indicatori di un ordine Amazon
    const hasOrderId = element.querySelector('.yohtmlc-order-id') !== null
    const hasProductTitle = element.querySelector('.yohtmlc-product-title') !== null
    const hasOrderHeader = element.querySelector('.order-header') !== null
    
    return hasOrderId || hasProductTitle || hasOrderHeader
  }

  /**
   * Trova il contenitore principale degli ordini
   */
  static findOrderContainer(): Element | null {
    for (const selector of this.ORDER_CONTAINER_SELECTORS) {
      try {
        const container = document.querySelector(selector)
        if (container) {
          return container
        }
      } catch (error) {
        console.debug(`Container selector ${selector} failed:`, error)
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
    const deliveryStatus = this.extractDeliveryStatus(element)

    return {
      orderId,
      title: title || 'Ordine senza titolo',
      date: date || 'Data non disponibile',
      price: price || 'Prezzo non disponibile',
      deliveryStatus: deliveryStatus || undefined,
      element
    }
  }

  /**
   * Estrae l'ID dell'ordine dall'elemento
   */
  private static extractOrderId(element: OrderElement): string | null {
    // Prova con i selettori specifici per l'ID ordine
    for (const selector of this.ORDER_ID_SELECTORS) {
      try {
        const idElement = element.querySelector(selector)
        if (idElement?.textContent?.trim()) {
          return idElement.textContent.trim()
        }
      } catch (error) {
        console.debug(`Order ID selector ${selector} failed:`, error)
      }
    }

    // Prova con data-order-id
    if (element.dataset.orderId) {
      return element.dataset.orderId
    }

    // Cerca nell'HTML per pattern di ID ordine Amazon
    const text = element.textContent || ''
    const orderIdPatterns = [
      /(?:Order|Ordine)\s*#?\s*([A-Z0-9-]{10,})/i,
      /([0-9]{3}-[0-9]{7}-[0-9]{7})/g, // Pattern specifico Amazon
      /orderID=([A-Z0-9-]+)/i
    ]

    for (const pattern of orderIdPatterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1]
      }
    }

    // Fallback: usa un hash dell'elemento
    const elementText = element.textContent?.trim() || ''
    const elementHtml = element.innerHTML
    return this.generateHash(elementText + elementHtml)
  }

  /**
   * Estrae il titolo dell'ordine (primo prodotto)
   */
  private static extractOrderTitle(element: OrderElement): string | null {
    for (const selector of this.ORDER_TITLE_SELECTORS) {
      try {
        const titleElement = element.querySelector(selector)
        if (titleElement?.textContent?.trim()) {
          return titleElement.textContent.trim()
        }
      } catch (error) {
        console.debug(`Title selector ${selector} failed:`, error)
      }
    }
    return null
  }

  /**
   * Estrae la data dell'ordine
   */
  private static extractOrderDate(element: OrderElement): string | null {
    // Prima prova con i selettori più specifici
    try {
      const orderDateSection = element.querySelector('.order-header__header-list-item')
      if (orderDateSection) {
        const capsSpan = orderDateSection.querySelector('.a-text-caps')
        if (capsSpan?.textContent?.includes('Ordine effettuato') || 
            capsSpan?.textContent?.includes('Order placed')) {
          const dateSpan = orderDateSection.querySelector('.a-size-base.a-color-secondary.aok-break-word')
          if (dateSpan?.textContent?.trim()) {
            return dateSpan.textContent.trim()
          }
        }
      }
    } catch (error) {
      console.debug('Specific date extraction failed:', error)
    }

    // Fallback con selettori generici
    for (const selector of this.ORDER_DATE_SELECTORS) {
      try {
        const dateElement = element.querySelector(selector)
        if (dateElement?.textContent?.trim()) {
          return dateElement.textContent.trim()
        }
      } catch (error) {
        console.debug(`Date selector ${selector} failed:`, error)
      }
    }
    return null
  }

  /**
   * Estrae il prezzo dell'ordine
   */
  private static extractOrderPrice(element: OrderElement): string | null {
    // Prima prova con i selettori più specifici per il prezzo
    try {
      // Trova tutti gli elementi che potrebbero contenere il prezzo
      const priceElements = element.querySelectorAll('.a-size-base.a-color-secondary.aok-break-word')
      
      for (const priceElement of priceElements) {
        const text = priceElement.textContent?.trim()
        if (text && this.containsPricePattern(text)) {
          return text
        }
      }
      
      // Prova con il metodo precedente per compatibilità
      const orderHeaderItems = element.querySelectorAll('.order-header__header-list-item')
      for (const item of orderHeaderItems) {
        const capsSpan = item.querySelector('.a-text-caps')
        if (capsSpan?.textContent?.includes('Totale') || 
            capsSpan?.textContent?.includes('Total')) {
          const priceSpan = item.querySelector('.a-size-base.a-color-secondary.aok-break-word')
          if (priceSpan?.textContent?.trim()) {
            return priceSpan.textContent.trim()
          }
        }
      }
    } catch (error) {
      console.debug('Specific price extraction failed:', error)
    }

    // Fallback con selettori generici
    for (const selector of this.ORDER_PRICE_SELECTORS) {
      try {
        const priceElement = element.querySelector(selector)
        if (priceElement?.textContent?.trim()) {
          const text = priceElement.textContent.trim()
          if (this.containsPricePattern(text)) {
            return text
          }
        }
      } catch (error) {
        console.debug(`Price selector ${selector} failed:`, error)
      }
    }
    return null
  }

  /**
   * Estrae lo stato di consegna
   */
  private static extractDeliveryStatus(element: OrderElement): string | null {
    for (const selector of this.DELIVERY_STATUS_SELECTORS) {
      try {
        const statusElement = element.querySelector(selector)
        if (statusElement?.textContent?.trim()) {
          return statusElement.textContent.trim()
        }
      } catch (error) {
        console.debug(`Delivery status selector ${selector} failed:`, error)
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

  /**
   * Verifica se una stringa contiene un pattern di prezzo
   */
  private static containsPricePattern(text: string): boolean {
    const pricePatterns = [
      /\d+[.,]\d+\s*€/,
      /€\s*\d+[.,]\d+/,
      /\$\s*\d+[.,]\d+/,
      /\d+[.,]\d+\s*\$/,
      /\d+[.,]\d+\s*EUR/i,
      /\d+[.,]\d+\s*USD/i
    ]
    
    return pricePatterns.some(pattern => pattern.test(text))
  }
} 