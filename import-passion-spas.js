#!/usr/bin/env node
/**
 * import-passion-spas.js
 * Importe tous les spas Passion Spas dans Supabase
 * - Crée les produits (univers: bien-etre, catégorie: spa)
 * - Upload les images vers le bucket "product-media"
 * - Crée les options de couleur (Gris / Beige)
 * - Crée les sections de specs techniques
 *
 * Usage: node import-passion-spas.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// ─── Config ────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://hbjnqfmmfggvvoitdylu.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhiam5xZm1tZmdndnZvaXRkeWx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ0MDg2OCwiZXhwIjoyMDk2MDE2ODY4fQ.9uDsaVhvSxwGrNqvHi9vb7-eqU9xmMAHr4-grYdaONE'
const IMAGES_BASE = 'E:\\DEVELOPPMENT WEB\\TempelOutdoor-Dev\\Passion Spas\\02) Pictures\\01) Product Pictures\\01) Spas'
const BUCKET = 'product-media'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Données des spas (prix Dealer HT) ─────────────────────────────────────
const SPA_DATA = {
  // PURE Collection
  'Renew':      { collection: 'Pure',      dimensions: '208 × 155 × 83 cm', jets: 40,  places: 2, pumps: '1 pompe massage · 1 souffleur · 1 pompe filtration',   price: 3900 },
  'Recharge':   { collection: 'Pure',      dimensions: 'Ø 200 × 85 cm',     jets: 60,  places: 4, pumps: '1 pompe massage · 1 souffleur · 1 pompe filtration',   price: 4100 },
  'Refresh':    { collection: 'Pure',      dimensions: '204 × 204 × 85 cm', jets: 50,  places: 4, pumps: '1 pompe massage · 1 souffleur · 1 pompe filtration',   price: 4100 },
  'Relax':      { collection: 'Pure',      dimensions: '204 × 204 × 85 cm', jets: 36,  places: 4, pumps: '1 pompe massage · 1 souffleur · 1 pompe filtration',   price: 4100 },
  'Rewind':     { collection: 'Pure',      dimensions: '204 × 204 × 85 cm', jets: 56,  places: 4, pumps: '1 pompe massage · 1 souffleur · 1 pompe filtration',   price: 4100 },
  'Retreat':    { collection: 'Pure',      dimensions: '228 × 228 × 85 cm', jets: 70,  places: 5, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 4900 },
  'Resettle':   { collection: 'Pure',      dimensions: '228 × 228 × 85 cm', jets: 75,  places: 5, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 4900 },
  'Reflect':    { collection: 'Pure',      dimensions: '228 × 228 × 85 cm', jets: 70,  places: 5, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 4900 },
  'Repose':     { collection: 'Pure',      dimensions: '254 × 204 × 85 cm', jets: 60,  places: 6, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 5700 },

  // SIGNATURE Collection
  'Bliss':      { collection: 'Signature', dimensions: '225 × 100 × 80 cm', jets: 22,  places: 2, pumps: '1 pompe massage · 1 pompe filtration',                 price: 3500 },
  'Indulgence': { collection: 'Signature', dimensions: '214 × 143 × 63 cm', jets: 40,  places: 3, pumps: '1 pompe massage · 1 pompe filtration',                 price: 3500 },
  'Heart':      { collection: 'Signature', dimensions: '210 × 170 × 80 cm', jets: 39,  places: 4, pumps: '1 pompe massage · 1 pompe filtration',                 price: 4400 },
  'Soulmate':   { collection: 'Signature', dimensions: '213 × 165 × 85 cm', jets: 52,  places: 4, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 5100 },
  'Happy':      { collection: 'Signature', dimensions: '213 × 175 × 83 cm', jets: 54,  places: 5, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 5100 },
  'Pleasure':   { collection: 'Signature', dimensions: '215 × 200 × 91 cm', jets: 60,  places: 5, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 5400 },
  'Solace':     { collection: 'Signature', dimensions: '213 × 213 × 91 cm', jets: 58,  places: 6, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 6400 },
  'Delight':    { collection: 'Signature', dimensions: '225 × 225 × 91 cm', jets: 80,  places: 6, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 6400 },
  'Joy':        { collection: 'Signature', dimensions: '226 × 226 × 91 cm', jets: 87,  places: 7, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 7000 },
  'Admire':     { collection: 'Signature', dimensions: '230 × 230 × 91 cm', jets: 60,  places: 6, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 7000 },
  'Devotion':   { collection: 'Signature', dimensions: '230 × 230 × 91 cm', jets: 82,  places: 6, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 7100 },
  'Desire':     { collection: 'Signature', dimensions: '274 × 228 × 91 cm', jets: 68,  places: 7, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration',  price: 7500 },
  'Harmony':    { collection: 'Signature', dimensions: '300 × 228 × 91 cm', jets: 90,  places: 7, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration · LED Starbrite · Bluetooth audio', price: 9600 },

  // EXCLUSIVE Collection (Mighty Wave)
  'Sensation':   { collection: 'Exclusive', dimensions: '230 × 155 × 86 cm', jets: 60,  places: 4, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration · 1 pompe Wave Therapy', price: 6200 },
  'Felicity':    { collection: 'Exclusive', dimensions: '213 × 213 × 91 cm', jets: 97,  places: 6, pumps: '2 pompes massage · 1 souffleur · 1 pompe filtration · 1 pompe Wave Therapy', price: 7300 },
  'Excite':      { collection: 'Exclusive', dimensions: '224 × 224 × 91 cm', jets: 105, places: 6, pumps: '3 pompes massage · 1 souffleur · 1 pompe filtration · 1 pompe Wave Therapy', price: 8000 },
  'Euphoria':    { collection: 'Exclusive', dimensions: '230 × 230 × 91 cm', jets: 115, places: 6, pumps: '3 pompes massage · 1 souffleur · 1 pompe filtration · 1 pompe Wave Therapy', price: 8100 },
  'Ecstatic':    { collection: 'Exclusive', dimensions: '305 × 228 × 91 cm', jets: 150, places: 7, pumps: '3 pompes massage · 1 souffleur · 1 pompe filtration · 1 pompe Wave Therapy', price: 10200 },
  'Exhilarate':  { collection: 'Exclusive', dimensions: '230 × 230 × 91 cm', jets: 122, places: 6, pumps: '3 pompes massage · 1 souffleur · 1 pompe filtration · 1 pompe Wave Therapy', price: 8000 },

  // MODERN Collection
  'Serene 2':   { collection: 'Modern',    dimensions: '210 × 110 × 79 cm', jets: 20,  places: 2, pumps: '1 pompe massage · 1 pompe filtration',                 price: 4300 },
  'Serene 3':   { collection: 'Modern',    dimensions: '210 × 130 × 81 cm', jets: 32,  places: 3, pumps: '1 pompe massage · 1 pompe filtration',                 price: 4700 },
  'Serene 5':   { collection: 'Modern',    dimensions: '210 × 190 × 85 cm', jets: 24,  places: 5, pumps: '1 pompe massage · 1 pompe filtration',                 price: 5900 },
  'Serene 6':   { collection: 'Modern',    dimensions: '243 × 224 × 93 cm', jets: 48,  places: 6, pumps: '2 pompes massage · 1 pompe filtration',                price: 7500 },
}

// Noms des dossiers couleur → label affiché sur le site
const COLOR_LABELS = {
  'Mystic Mountain - Oak with Grey': 'Gris — Mystic Mountain',
  'Sterling White - Grey with Oak':  'Beige — Sterling White',
  'Solid White - Grey with Oak':     'Beige — Solid White',
  'Sterling White - Grey Oak':       'Beige — Sterling White',
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function generateSlug(name) {
  return 'spa-' + name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function generateShortDescription(data) {
  return `Spa extérieur ${data.places} places — ${data.jets} jets — Collection ${data.collection}`
}

function generateDescription(name, data) {
  return `Le spa <strong>${name}</strong> de la collection <strong>${data.collection}</strong> de Passion Spas est conçu pour offrir une expérience de détente exceptionnelle. ` +
    `Avec ses ${data.jets} jets de massage répartis sur ${data.dimensions}, il s'intègre parfaitement dans votre espace extérieur. ` +
    `Disponible en revêtement Gris (Mystic Mountain) ou Beige (Sterling White) pour s'adapter à votre décoration.`
}

async function uploadImage(productId, imagePath, position, isFeatured) {
  const fileBuffer = fs.readFileSync(imagePath)
  const ext = path.extname(imagePath).slice(1).toLowerCase()
  const fileName = `${Date.now()}-${position}.${ext}`
  const storagePath = `${productId}/${fileName}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
      upsert: false,
    })

  if (uploadError) throw new Error(`Upload error ${imagePath}: ${uploadError.message}`)

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path)

  const { error: dbError } = await supabase.from('product_media').insert({
    product_id: productId,
    url: publicUrl,
    type: 'image',
    alt: path.basename(imagePath, path.extname(imagePath)),
    is_featured: isFeatured,
    position,
  })

  if (dbError) throw new Error(`DB error media: ${dbError.message}`)
  return publicUrl
}

async function createProductOption(productId, colorLabels) {
  const { error } = await supabase.from('product_options').insert({
    product_id: productId,
    name: 'Revêtement',
    values: colorLabels,
    required: true,
    position: 0,
  })
  if (error) throw new Error(`Option error: ${error.message}`)
}

async function createSpecSections(productId, name, data) {
  // Section 1: Dimensions & caractéristiques
  const { data: section1, error: s1Err } = await supabase
    .from('product_spec_sections')
    .insert({ product_id: productId, title: 'Caractéristiques techniques', position: 0 })
    .select('id')
    .single()

  if (s1Err) throw new Error(`Spec section error: ${s1Err.message}`)

  const items = [
    { label: 'Dimensions',    value: data.dimensions },
    { label: 'Nombre de jets', value: `${data.jets} jets` },
    { label: 'Places',        value: `${data.places} personnes` },
    { label: 'Équipements',   value: data.pumps },
    { label: 'Collection',    value: `Passion Spas — ${data.collection}` },
  ]

  for (let i = 0; i < items.length; i++) {
    const { error } = await supabase.from('product_spec_items').insert({
      section_id: section1.id,
      label: items[i].label,
      value: items[i].value,
      position: i,
    })
    if (error) throw new Error(`Spec item error: ${error.message}`)
  }
}

// ─── Import principal ───────────────────────────────────────────────────────
async function importSpa(folderName) {
  const spaName = folderName  // e.g. "Admire", "Serene 2"
  const data = SPA_DATA[spaName]

  if (!data) {
    console.log(`  ⚠️  Pas de données pour "${spaName}" — ignoré`)
    return
  }

  const slug = generateSlug(spaName)

  // Vérifier si ce produit existe déjà
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    console.log(`  ↩️  "${spaName}" existe déjà (slug: ${slug}) — ignoré`)
    return
  }

  // Créer le produit
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      slug,
      name: spaName,
      universe: 'bien-etre',
      category: 'spa',
      price: data.price,
      short_description: generateShortDescription(data),
      description: generateDescription(spaName, data),
      featured: false,
      status: 'active',
      stock: 10,
    })
    .select('id')
    .single()

  if (productError) throw new Error(`Product error for "${spaName}": ${productError.message}`)
  const productId = product.id

  // Scanner les dossiers couleur
  const spaFolder = path.join(IMAGES_BASE, folderName)
  const colorFolders = fs.readdirSync(spaFolder).filter(f => {
    return fs.statSync(path.join(spaFolder, f)).isDirectory()
  })

  const colorLabels = []
  let imagePosition = 0
  let firstImage = true

  for (const colorFolder of colorFolders) {
    const colorLabel = COLOR_LABELS[colorFolder] || colorFolder
    colorLabels.push(colorLabel)

    const colorPath = path.join(spaFolder, colorFolder)
    const imageFiles = fs.readdirSync(colorPath)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .sort()

    for (const imgFile of imageFiles) {
      const imgPath = path.join(colorPath, imgFile)
      await uploadImage(productId, imgPath, imagePosition, firstImage)
      firstImage = false
      imagePosition++
    }
  }

  // Créer l'option couleur (seulement si plusieurs couleurs)
  if (colorLabels.length > 1) {
    await createProductOption(productId, colorLabels)
  }

  // Créer les specs techniques
  await createSpecSections(productId, spaName, data)

  return { slug, colorLabels, imageCount: imagePosition }
}

async function main() {
  console.log('🚀 Import Passion Spas → Supabase\n')

  // Lister tous les dossiers de spas (exclure Eden Spas car pas de prix)
  const allFolders = fs.readdirSync(IMAGES_BASE).filter(f => {
    const fullPath = path.join(IMAGES_BASE, f)
    return fs.statSync(fullPath).isDirectory() && f !== 'Eden Spas'
  }).sort()

  console.log(`📁 ${allFolders.length} dossiers trouvés: ${allFolders.join(', ')}\n`)

  let successCount = 0
  let skipCount = 0
  const errors = []

  for (const folder of allFolders) {
    process.stdout.write(`⏳ Import "${folder}"...`)
    try {
      const result = await importSpa(folder)
      if (result) {
        console.log(` ✅ (${result.imageCount} images, ${result.colorLabels.length} couleurs)`)
        successCount++
      } else {
        skipCount++
      }
    } catch (err) {
      console.log(` ❌ ERREUR: ${err.message}`)
      errors.push({ folder, error: err.message })
    }
  }

  console.log('\n─────────────────────────────────────')
  console.log(`✅ Importés:  ${successCount}`)
  console.log(`↩️  Ignorés:   ${skipCount}`)
  console.log(`❌ Erreurs:   ${errors.length}`)
  if (errors.length > 0) {
    console.log('\nDétail des erreurs:')
    errors.forEach(e => console.log(`  - ${e.folder}: ${e.error}`))
  }
  console.log('\n🎉 Import terminé!')
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err)
  process.exit(1)
})