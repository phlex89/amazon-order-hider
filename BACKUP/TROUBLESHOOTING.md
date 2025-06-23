# Troubleshooting - Amazon Order Cleaner

## 🔧 Problemi comuni e soluzioni

### Errori di build

#### "Cannot resolve popup.js"
**Problema**: Vite non trova il file popup.js  
**Soluzione**: Assicurati che il file `src/popup/popup.html` punti a `popup.ts` non `popup.js`

#### "date-fns module not found"
**Problema**: Dipendenza mancante  
**Soluzione**: 
```bash
npm install date-fns
```

#### "Chrome types not found"
**Problema**: Tipi TypeScript per Chrome mancanti  
**Soluzione**:
```bash
npm install --save-dev @types/chrome
```

### Problemi di caricamento estensione

#### Estensione non si carica in Chrome
**Controlli da fare**:
1. Verifica che `dist/manifest.json` esista
2. Controlla che le icone siano presenti in `dist/icons/`
3. Assicurati che Developer Mode sia abilitato
4. Controlla la console di Chrome per errori

#### Pulsanti "Nascondi" non appaiono su Amazon
**Possibili cause**:
1. **Selettori CSS obsoleti**: Amazon cambia spesso il layout
2. **Content script non iniettato**: Controlla i permessi nel manifest
3. **JavaScript disabilitato**: L'estensione richiede JS attivo

**Soluzioni**:
1. Aggiorna i selettori in `src/utils/amazon-selectors.ts`
2. Verifica i `host_permissions` nel manifest
3. Controlla la console del browser per errori

### Problemi di storage

#### Gli ordini nascosti non persistono
**Causa**: Problemi con chrome.storage.local  
**Soluzione**: Controlla i permessi nel manifest:
```json
"permissions": ["storage"]
```

#### Popup non mostra ordini nascosti
**Debug steps**:
1. Apri DevTools sul popup (right-click → Inspect)
2. Controlla la console per errori
3. Verifica che `chrome.storage.local` funzioni

### Problemi di performance

#### Pagina Amazon rallenta
**Cause possibili**:
1. MutationObserver troppo aggressivo
2. Troppi event listener
3. Memory leak nel content script

**Soluzioni**:
1. Ottimizza i selettori CSS
2. Usa event delegation
3. Pulisci i listener quando non necessari

### Debug avanzato

#### Abilitare logging dettagliato
Aggiungi questo al content script:
```javascript
const DEBUG = true;
if (DEBUG) {
  console.log('Amazon Order Cleaner: Debug mode enabled');
}
```

#### Ispezionare lo storage
Nella console del browser:
```javascript
chrome.storage.local.get(null, (data) => console.log(data));
```

#### Reset completo dell'estensione
```javascript
chrome.storage.local.clear();
```

## 🐛 Segnalazione bug

Quando segnali un bug, includi:

1. **Versione Chrome**: `chrome://version/`
2. **URL Amazon**: Pagina specifica dove si verifica il problema
3. **Console errors**: Screenshot degli errori in DevTools
4. **Steps to reproduce**: Passi per riprodurre il bug
5. **Expected vs Actual**: Comportamento atteso vs reale

## 📧 Supporto

Per supporto aggiuntivo:
1. Controlla le [Issues GitHub](https://github.com/tuonome/amazon-order-hider/issues)
2. Apri una nuova issue con i dettagli del problema
3. Includi tutti i log e screenshot rilevanti

## 🔄 Aggiornamenti

### Aggiornare l'estensione
1. Scarica la versione più recente
2. Esegui `npm run build`
3. In Chrome, vai su `chrome://extensions/`
4. Clicca "Ricarica" sull'estensione

### Backup delle impostazioni
Prima di aggiornare, esporta le impostazioni:
```javascript
chrome.storage.local.get(null, (data) => {
  console.log('Backup:', JSON.stringify(data));
  // Salva questo JSON in un file
});
```

### Ripristino delle impostazioni
```javascript
const backup = { /* il tuo JSON di backup */ };
chrome.storage.local.set(backup);
``` 