# Amazon Order Cleaner

Un'estensione Chrome moderna per nascondere ordini dalla cronologia di Amazon, sviluppata con Vite + Vue.js + TypeScript.

## 🚀 Caratteristiche

- **Nascondi ordini**: Aggiungi un pulsante "Nascondi" accanto a ogni ordine Amazon
- **Gestione avanzata**: Popup intuitivo per gestire gli ordini nascosti
- **Toggle visibilità**: Mostra/nascondi temporaneamente gli ordini nascosti
- **Storage locale**: Tutti i dati restano nel tuo browser (privacy garantita)
- **UI moderna**: Interfaccia sviluppata con Vue.js e design responsive
- **Multi-Amazon**: Supporta tutti i principali domini Amazon (.it, .com, .co.uk, .de, .fr, .es)
- **Performance**: MutationObserver per gestire il caricamento dinamico
- **Accessibilità**: Design accessibile e compatibile con screen reader

## 🛠️ Sviluppo

### Prerequisiti

- Node.js (versione 18 o superiore)
- npm o yarn

### Installazione dipendenze

```bash
npm install
```

### Sviluppo

```bash
# Avvia il server di sviluppo
npm run dev

# Type checking
npm run type-check
```

### Build per produzione

```bash
# Build dell'estensione
npm run build
```

I file compilati saranno nella cartella `dist/`.

## 📦 Installazione estensione

### Installazione manuale (Developer Mode)

1. Esegui `npm run build` per compilare l'estensione
2. Apri Chrome e vai su `chrome://extensions/`
3. Abilita "Modalità sviluppatore" in alto a destra
4. Clicca "Carica estensione non pacchettizzata"
5. Seleziona la cartella `dist/`
6. L'estensione sarà installata e attiva

### Uso

1. Vai su Amazon (https://www.amazon.it/gp/your-account/order-history)
2. Vedrai un pulsante "👁️ Nascondi" accanto a ogni ordine
3. Clicca per nascondere un ordine
4. Usa il popup dell'estensione per gestire gli ordini nascosti
5. Toggle "Mostra ordini nascosti" per vedere temporaneamente gli ordini nascosti

## 🏗️ Architettura

### Struttura del progetto

```
amazon-order-hider/
├── public/
│   ├── manifest.json          # Manifest dell'estensione Chrome
│   └── icons/                 # Icone dell'estensione
├── src/
│   ├── types/                 # Definizioni TypeScript
│   ├── utils/                 # Utility (storage, selettori Amazon)
│   ├── content/               # Content script
│   ├── background/            # Service worker
│   └── popup/                 # UI Vue.js per il popup
├── vite.config.ts            # Configurazione Vite
└── package.json
```

### Componenti principali

- **Content Script** (`src/content/content.ts`): Iniettato nelle pagine Amazon, gestisce DOM e pulsanti
- **Background Script** (`src/background/background.ts`): Service worker per comunicazione e storage
- **Popup** (`src/popup/`): Interfaccia Vue.js per gestire gli ordini nascosti
- **Storage Manager** (`src/utils/storage.ts`): Gestione centralizzata di chrome.storage.local
- **Amazon Selectors** (`src/utils/amazon-selectors.ts`): Selettori CSS robusti per Amazon

## 🔧 Tecnologie utilizzate

- **Vite**: Build tool veloce e moderno
- **Vue.js 3**: Framework reattivo con Composition API
- **TypeScript**: Type safety e migliore DX
- **Chrome Extension Manifest V3**: Ultima versione delle API Chrome
- **date-fns**: Gestione date moderne e tree-shakable
- **CSS moderno**: Grid, Flexbox, animazioni, media queries

## 🔒 Privacy e sicurezza

- **Nessun tracking**: L'estensione non raccoglie dati personali
- **Storage locale**: Tutti i dati restano nel browser dell'utente
- **Permessi minimi**: Solo `storage` e `activeTab`
- **Codice open source**: Trasparenza totale

## 📱 Compatibilità

- **Browser**: Chrome, Edge, altri browser Chromium
- **Amazon**: .it, .com, .co.uk, .de, .fr, .es
- **Responsive**: Funziona su desktop e mobile
- **Accessibilità**: WCAG 2.1 compliant

## 🔧 Personalizzazioni necessarie

1. **Icone**: 
   - Ho incluso un'icona SVG di base in `public/icon.svg`
   - Per creare le icone PNG, puoi convertire l'SVG o sostituire i placeholder in `public/icons/` con icone reali
   - Dimensioni necessarie: 16x16, 32x32, 48x48, 128x128 px

2. **Selettori Amazon**: Potrebbe essere necessario aggiornare i selettori CSS in `amazon-selectors.ts` in base ai cambiamenti di Amazon

3. **Stili**: Personalizza i colori e l'aspetto in `content.css`

## 🚀 Funzionalità future

- [ ] Filtri automatici per categoria/parole chiave
- [ ] Esportazione/importazione configurazione
- [ ] Statistiche utilizzo
- [ ] Supporto per altri siti e-commerce
- [ ] Sincronizzazione cloud (opzionale)

## 🤝 Contribuire

1. Fork del repository
2. Crea un branch per la feature (`git checkout -b feature/nuova-feature`)
3. Commit delle modifiche (`git commit -am 'Aggiungi nuova feature'`)
4. Push del branch (`git push origin feature/nuova-feature`)
5. Apri una Pull Request

## 📄 Licenza

MIT License - vedi il file [LICENSE](LICENSE) per i dettagli.

## 🐛 Bug e supporto

Apri un [issue](https://github.com/tuonome/amazon-order-hider/issues) per:
- Segnalare bug
- Richiedere nuove funzionalità
- Problemi di compatibilità con Amazon

## ⭐ Roadmap

### v1.0.0 (Attuale)
- [x] Funzionalità base nascondi/mostra ordini
- [x] Popup di gestione
- [x] Storage locale
- [x] Multi-Amazon support

### v1.1.0 (Prossima)
- [ ] Filtri avanzati
- [ ] Statistiche
- [ ] Miglioramenti UX

### v2.0.0 (Futuro)
- [ ] Supporto altri siti
- [ ] Sincronizzazione cloud
- [ ] API avanzate