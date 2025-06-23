import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectRoot = resolve(__dirname, '..')
const distDir = resolve(projectRoot, 'dist')
const publicDir = resolve(projectRoot, 'public')

// Assicurati che la directory dist esista
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}

// Copia il manifest.json
console.log('Copying manifest.json...')
copyFileSync(
  resolve(publicDir, 'manifest.json'),
  resolve(distDir, 'manifest.json')
)

// // Crea la directory icons se non esiste
// const iconsDistDir = resolve(distDir, 'icons')
// if (!existsSync(iconsDistDir)) {
//   mkdirSync(iconsDistDir, { recursive: true })
// }

// // Lista delle icone da copiare (anche se sono placeholder)
// const iconSizes = ['16', '32', '48', '128']

// iconSizes.forEach(size => {
//   const iconFile = `icon-${size}.png`
//   const sourcePath = resolve(publicDir, 'icons', iconFile)
//   const destPath = resolve(iconsDistDir, iconFile)
  
//   if (existsSync(sourcePath)) {
//     console.log(`Copying ${iconFile}...`)
//     copyFileSync(sourcePath, destPath)
//   } else {
//     console.warn(`Warning: ${iconFile} not found, skipping...`)
//   }
// })

console.log('Extension build completed!')
console.log('Next steps:')
console.log('1. Go to chrome://extensions/')
console.log('2. Enable Developer mode')
console.log('3. Click "Load unpacked"')
console.log('4. Select the dist/ folder') 