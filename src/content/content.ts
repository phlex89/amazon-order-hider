import { storage } from '../utils/storage'
import { AmazonSelectors } from '../utils/amazon-selectors'
import type { AmazonOrderData, OrderElement } from '../types'
import { OrderStatus } from '../types'

class AmazonOrderCleaner {
  private observer: MutationObserver | null = null
  private isEnabled = true
  private showHidden = false
  private hiddenOrderIds = new Set<string>()
  private processedElements = new WeakSet<Element>()

  constructor() {
    this.init()
  }

  private async init(): Promise<void> {
    console.log('Amazon Order Cleaner: Initializing...')
    
    // Carica lo stato iniziale
    await this.loadState()
    
    // Inizializza l'observer per il DOM
    this.setupMutationObserver()
    
    // Processa gli ordini già presenti
    this.processExistingOrders()
    
    // Ascolta i cambiamenti di storage
    this.setupStorageListener()
    
    console.log('Amazon Order Cleaner: Initialized successfully')
  }

  private async loadState(): Promise<void> {
    try {
      const data = await storage.getAll()
      this.isEnabled = data.isEnabled
      this.showHidden = data.showHidden
      this.hiddenOrderIds = new Set(data.hiddenOrders.map(order => order.id))
    } catch (error) {
      console.error('Error loading state:', error)
    }
  }

  private setupMutationObserver(): void {
    const container = AmazonSelectors.findOrderContainer()
    if (!container) {
      console.warn('Order container not found, retrying in 2 seconds...')
      setTimeout(() => this.setupMutationObserver(), 2000)
      return
    }

    this.observer = new MutationObserver((mutations) => {
      let shouldProcess = false
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldProcess = true
        }
      })
      
      if (shouldProcess) {
        // Debounce per evitare troppi aggiornamenti
        setTimeout(() => this.processNewOrders(), 100)
      }
    })

    this.observer.observe(container, {
      childList: true,
      subtree: true
    })
  }

  private processExistingOrders(): void {
    const orders = AmazonSelectors.findOrderElements()
    orders.forEach(order => this.processOrder(order))
  }

  private processNewOrders(): void {
    const orders = AmazonSelectors.findOrderElements()
    orders.forEach(order => {
      if (!this.processedElements.has(order)) {
        this.processOrder(order)
        this.processedElements.add(order)
      }
    })
  }

  private processOrder(orderElement: OrderElement): void {
    if (!this.isEnabled) return

    const orderData = AmazonSelectors.extractOrderData(orderElement)
    if (!orderData) return

    // Aggiungi il pulsante di nascondere se non esiste già
    this.addHideButton(orderElement, orderData)

    // Nascondi l'ordine se è nella lista degli ordini nascosti
    if (this.hiddenOrderIds.has(orderData.orderId)) {
      this.setOrderVisibility(orderElement, this.showHidden ? OrderStatus.TEMPORARILY_SHOWN : OrderStatus.HIDDEN)
    } else {
      this.setOrderVisibility(orderElement, OrderStatus.VISIBLE)
    }
  }

  private addHideButton(orderElement: OrderElement, orderData: AmazonOrderData): void {
    // Controlla se il pulsante esiste già
    if (orderElement.querySelector('.aoc-hide-button')) return

    const button = document.createElement('button')
    button.className = 'aoc-hide-button'
    button.textContent = '👁️ Nascondi'
    button.title = 'Nascondi questo ordine dalla cronologia'
    button.type = 'button'
    
    // Stili inline per integrazione con Amazon
    button.style.cssText = `
      background: #ffd814;
      border: 1px solid #fcd200;
      border-radius: 8px;
      color: #0f1111;
      cursor: pointer;
      font-size: 13px;
      font-weight: 400;
      line-height: 29px;
      padding: 0 10px 0 11px;
      text-align: center;
      text-decoration: none;
      vertical-align: middle;
      margin-left: 8px;
      white-space: nowrap;
      min-width: 80px;
      transition: all 0.2s ease;
    `

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#f7ca00'
      button.style.borderColor = '#f2c200'
    })

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = '#ffd814'
      button.style.borderColor = '#fcd200'
    })

    button.addEventListener('click', async (e) => {
      e.preventDefault()
      e.stopPropagation()
      await this.hideOrder(orderData)
    })

    // Trova il posto migliore per inserire il pulsante
    const insertionPoint = this.findButtonInsertionPoint(orderElement)
    if (insertionPoint) {
      insertionPoint.appendChild(button)
    }
  }

  private findButtonInsertionPoint(orderElement: OrderElement): Element | null {
    // Cerca elementi comuni dove inserire il pulsante
    const selectors = [
      '.order-actions',
      '.order-header',
      '.a-row.a-spacing-base',
      '.a-row:first-child'
    ]

    for (const selector of selectors) {
      const element = orderElement.querySelector(selector)
      if (element) return element
    }

    // Fallback: crea un container
    const container = document.createElement('div')
    container.className = 'aoc-button-container'
    container.style.cssText = 'margin: 8px 0; text-align: right;'
    
    orderElement.insertBefore(container, orderElement.firstChild)
    return container
  }

  private async hideOrder(orderData: AmazonOrderData): Promise<void> {
    try {
      await storage.hideOrder({
        id: orderData.orderId,
        title: orderData.title,
        date: orderData.date,
        price: orderData.price
      })

      this.hiddenOrderIds.add(orderData.orderId)
      this.setOrderVisibility(orderData.element, OrderStatus.HIDDEN)
      
      // Mostra notifica
      this.showNotification(`Ordine nascosto: ${orderData.title}`)
    } catch (error) {
      console.error('Error hiding order:', error)
      this.showNotification('Errore nel nascondere l\'ordine', 'error')
    }
  }

  private setOrderVisibility(orderElement: OrderElement, status: OrderStatus): void {
    switch (status) {
      case OrderStatus.HIDDEN:
        orderElement.style.display = 'none'
        orderElement.setAttribute('data-aoc-status', 'hidden')
        break
      case OrderStatus.TEMPORARILY_SHOWN:
        orderElement.style.display = ''
        orderElement.style.opacity = '0.5'
        orderElement.style.filter = 'grayscale(50%)'
        orderElement.setAttribute('data-aoc-status', 'temporarily-shown')
        break
      case OrderStatus.VISIBLE:
      default:
        orderElement.style.display = ''
        orderElement.style.opacity = ''
        orderElement.style.filter = ''
        orderElement.setAttribute('data-aoc-status', 'visible')
        break
    }
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    const notification = document.createElement('div')
    notification.className = 'aoc-notification'
    notification.textContent = message
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4caf50' : '#f44336'};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
    `

    // Aggiungi animation CSS
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `
    document.head.appendChild(style)

    document.body.appendChild(notification)

    // Rimuovi dopo 3 secondi
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  private setupStorageListener(): void {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.isEnabled) {
        this.isEnabled = changes.isEnabled.newValue
        this.processExistingOrders()
      }
      
      if (changes.showHidden) {
        this.showHidden = changes.showHidden.newValue
        this.processExistingOrders()
      }
      
      if (changes.hiddenOrders) {
        const newHiddenOrders = changes.hiddenOrders.newValue || []
        this.hiddenOrderIds = new Set(newHiddenOrders.map((order: { id: string }) => order.id))
        this.processExistingOrders()
      }
    })
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AmazonOrderCleaner()
  })
} else {
  new AmazonOrderCleaner()
}

// Cleanup quando la pagina viene scaricata
window.addEventListener('beforeunload', () => {
  // Cleanup se necessario
})

// TEST
export default window.onload = () => {
  const textElement = document.createElement("h1");

  textElement.style.color = "red";
  textElement.style.position = "absolute";
  textElement.style.zIndex = "10000";
  textElement.style.top = "0";
  textElement.style.right = "1";
  textElement.textContent = "TEST";

  document.body.appendChild(textElement);
};