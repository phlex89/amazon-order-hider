// Service Worker per Amazon Order Cleaner
// Gestisce eventi dell'estensione e comunicazione tra componenti

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Amazon Order Cleaner installed:', details.reason)
  
  if (details.reason === 'install') {
    // Prima installazione - inizializza storage con valori di default
    chrome.storage.local.set({
      hiddenOrders: [],
      isEnabled: true,
      showHidden: false
    })
  }
})

// Gestisce messaggi dai content script e popup
// @ts-ignore
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_STORAGE_DATA':
      handleGetStorageData(sendResponse)
      return true // Indica che la risposta sarà asincrona
      
    case 'HIDE_ORDER':
      handleHideOrder(message.data, sendResponse)
      return true
      
    case 'UNHIDE_ORDER':
      handleUnhideOrder(message.data, sendResponse)
      return true
      
    case 'TOGGLE_ENABLED':
      handleToggleEnabled(sendResponse)
      return true
      
    case 'TOGGLE_SHOW_HIDDEN':
      handleToggleShowHidden(sendResponse)
      return true
      
    case 'CLEAR_ALL_HIDDEN':
      handleClearAllHidden(sendResponse)
      return true
      
    default:
      sendResponse({ success: false, error: 'Unknown message type' })
  }
})

async function handleGetStorageData(sendResponse: (response: unknown) => void): Promise<void> {
  try {
    const result = await chrome.storage.local.get()
    sendResponse({
      success: true,
      data: {
        hiddenOrders: result.hiddenOrders || [],
        isEnabled: result.isEnabled ?? true,
        showHidden: result.showHidden ?? false
      }
    })
  } catch (error) {
    sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

async function handleHideOrder(orderData: unknown, sendResponse: (response: unknown) => void): Promise<void> {
  try {
    const result = await chrome.storage.local.get('hiddenOrders')
    const hiddenOrders = result.hiddenOrders || []
    
    // Evita duplicati
    if (!hiddenOrders.some((order: { id: string }) => order.id === (orderData as { id: string }).id)) {
      hiddenOrders.push({
        ...(orderData as object),
        hiddenAt: new Date().toISOString()
      })
      
      await chrome.storage.local.set({ hiddenOrders })
    }
    
    sendResponse({ success: true })
  } catch (error) {
    sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

async function handleUnhideOrder(orderId: string, sendResponse: (response: unknown) => void): Promise<void> {
  try {
    const result = await chrome.storage.local.get('hiddenOrders')
    const hiddenOrders = result.hiddenOrders || []
    const filteredOrders = hiddenOrders.filter((order: { id: string }) => order.id !== orderId)
    
    await chrome.storage.local.set({ hiddenOrders: filteredOrders })
    sendResponse({ success: true })
  } catch (error) {
    sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

async function handleToggleEnabled(sendResponse: (response: unknown) => void): Promise<void> {
  try {
    const result = await chrome.storage.local.get('isEnabled')
    const newState = !(result.isEnabled ?? true)
    
    await chrome.storage.local.set({ isEnabled: newState })
    sendResponse({ success: true, isEnabled: newState })
  } catch (error) {
    sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

async function handleToggleShowHidden(sendResponse: (response: unknown) => void): Promise<void> {
  try {
    const result = await chrome.storage.local.get('showHidden')
    const newState = !(result.showHidden ?? false)
    
    await chrome.storage.local.set({ showHidden: newState })
    sendResponse({ success: true, showHidden: newState })
  } catch (error) {
    sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

async function handleClearAllHidden(sendResponse: (response: unknown) => void): Promise<void> {
  try {
    await chrome.storage.local.set({ hiddenOrders: [] })
    sendResponse({ success: true })
  } catch (error) {
    sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

// Gestisce l'aggiornamento dell'icona in base allo stato
chrome.storage.onChanged.addListener((changes) => {
  if (changes.isEnabled) {
    // updateIcon(changes.isEnabled.newValue)
  }
})

function updateIcon(isEnabled: boolean): void {
  const iconPath = isEnabled ? 'icons/icon-128.png' : 'icons/icon-128-disabled.png'
  
  chrome.action.setIcon({
    path: {
      16: iconPath.replace('128', '16'),
      32: iconPath.replace('128', '32'),
      48: iconPath.replace('128', '48'),
      128: iconPath
    }
  })
  
  chrome.action.setTitle({
    title: `Amazon Order Cleaner ${isEnabled ? '(Attivo)' : '(Disattivato)'}`
  })
} 