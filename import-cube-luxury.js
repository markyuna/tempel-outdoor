#!/usr/bin/env node
/**
 * import-cube-luxury.js
 * Importe le sauna "Cube Luxury" (Passion Spas) dans Supabase.
 * - Crée le produit (univers: bien-etre, catégorie: sauna)
 * - Upload toutes les photos (dédupliquées par contenu) des 2 tailles (220/300)
 * - Crée l'option "Dimensions" (prix + schéma technique lié par taille)
 * - Crée la section de specs techniques
 *
 * Usage: node import-cube-luxury.js
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-media";

const IMAGES_BASE =
  "E:\\DEVELOPPMENT WEB\\TempelOutdoor-Dev\\Passion Spas\\09) Passion Saunas\\03) Photos\\Cube Luxury";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SLUG = "cube-luxury";
const NAME = "Cube Luxury";
const ALT_BASE = `${NAME} - sauna haut de gamme Tempel Outdoor`;

const SIZES = [
  { size: "220", label: "228 x 220 x 225 cm", price: 6990, featuredFile: "Cube 220 New.webp" },
  { size: "300", label: "300 x 220 x 225 cm", price: 7990, featuredFile: null },
];

function md5(filePath) {
  return crypto.createHash("md5").update(fs.readFileSync(filePath)).digest("hex");
}

async function uploadImage(productId, imagePath, position, { isFeatured = false, alt = ALT_BASE } = {}) {
  const fileBuffer = fs.readFileSync(imagePath);
  const fileName = `sauna-${SLUG}-image-${String(position).padStart(2, "0")}-${Date.now()}.webp`;
  const storagePath = `${productId}/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: "image/webp",
      upsert: false,
    });

  if (uploadError) throw new Error(`Upload error ${imagePath}: ${uploadError.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);

  const { data: mediaRow, error: dbError } = await supabase
    .from("product_media")
    .insert({
      product_id: productId,
      url: publicUrl,
      type: "image",
      alt,
      is_featured: isFeatured,
      position,
    })
    .select("id")
    .single();

  if (dbError) throw new Error(`DB error media: ${dbError.message}`);
  return mediaRow.id;
}

async function createOptions(productId, schematicMediaIds) {
  const { error } = await supabase.from("product_options").insert({
    product_id: productId,
    name: "Dimensions",
    values: SIZES.map(
      ({ label, price, size }) =>
        `${label} | ${price} | ${schematicMediaIds[size]} | ${size}`
    ),
    required: true,
    position: 0,
  });

  if (error) throw new Error(`Dimensions option error: ${error.message}`);
}

async function createSpecSections(productId) {
  const { data: section, error: sectionError } = await supabase
    .from("product_spec_sections")
    .insert({ product_id: productId, title: "DÉTAILS D'ARTICLE", position: 0 })
    .select("id")
    .single();

  if (sectionError) throw new Error(`Spec section error: ${sectionError.message}`);

  const items = [
    { label: "Dimensions extérieures (220)", value: "228 x 220 x 225 cm" },
    { label: "Dimensions extérieures (300)", value: "300 x 220 x 225 cm" },
    { label: "Dimensions intérieures (220)", value: "212 x 154 cm" },
    { label: "Dimensions intérieures (300)", value: "194 x 170 cm" },
    { label: "Capacité (220)", value: "2 à 3 personnes" },
    { label: "Capacité (300)", value: "6 personnes" },
    { label: "Configuration (300)", value: "Multiroom — deux espaces séparés" },
    { label: "Poids (220)", value: "720 kg" },
    { label: "Poids (300)", value: "1000 kg" },
    { label: "Matériau", value: "Thermo Wood (garantie 5 ans)" },
    { label: "Banquette et dossier", value: "Clear Aspen" },
    { label: "Poêle électrique", value: "8,0 kW, inclus" },
    { label: "Vitrage", value: "Verre de sécurité bronze, 8 mm" },
    { label: "Porte", value: "Battante" },
    { label: "Toiture", value: "Bardeaux bitumés noirs, inclus" },
    { label: "Éclairage", value: "Inclus" },
    {
      label: "Accessoires inclus",
      value: "Seau, louche, pierres de sauna, thermomètre, sablier",
    },
    { label: "Installation", value: "Montage DIY" },
    { label: "Certification", value: "CE" },
  ];

  for (let i = 0; i < items.length; i++) {
    const { error } = await supabase.from("product_spec_items").insert({
      section_id: section.id,
      label: items[i].label,
      value: items[i].value,
      position: i,
    });
    if (error) throw new Error(`Spec item error: ${error.message}`);
  }
}

async function main() {
  console.log("Import Cube Luxury -> Supabase\n");

  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("slug", SLUG)
    .single();

  if (existing) {
    console.log(`"${NAME}" existe déjà (slug: ${SLUG}) — abandon.`);
    return;
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      slug: SLUG,
      name: NAME,
      universe: "bien-etre",
      category: "sauna",
      price: SIZES[0].price,
      short_description:
        "Sauna extérieur 2 à 6 places — Cube Luxury, disponible en 220 ou 300 Multiroom",
      description:
        "Découvrez le Cube Luxury, un sauna extérieur en Thermo Wood (garantie 5 ans), disponible en deux dimensions. " +
        "Le 220 accueille 2 à 3 personnes dans un espace unique, tandis que le 300 Multiroom propose deux espaces séparés pour recevoir jusqu'à 6 personnes. " +
        "Chaque sauna est livré avec son poêle électrique 8 kW, son éclairage, sa vitre de sécurité teintée bronze et tous les accessoires nécessaires. " +
        "Sélectionnez votre dimension ci-contre : le prix et le schéma des mesures s'ajustent automatiquement.",
      featured: true,
      status: "active",
      stock: 1,
      delivery_time: "entre 2 et 3 semaines.",
    })
    .select("id")
    .single();

  if (productError) throw new Error(`Product error: ${productError.message}`);
  const productId = product.id;
  console.log(`Produit créé: ${productId}`);

  const seenHashes = new Map();
  const schematicMediaIds = {};
  let position = 0;
  let uploadedCount = 0;
  let skippedDuplicates = 0;

  for (const { size } of SIZES) {
    const folder = path.join(IMAGES_BASE, `Cube Luxury ${size}`);
    const files = fs
      .readdirSync(folder)
      .filter((f) => /\.webp$/i.test(f))
      .sort();

    for (const fileName of files) {
      const filePath = path.join(folder, fileName);
      const hash = md5(filePath);
      const isSchematic = /Technische Tekening/i.test(fileName);

      if (seenHashes.has(hash) && !isSchematic) {
        skippedDuplicates++;
        continue;
      }
      seenHashes.set(hash, true);

      const isFeatured = fileName === "Cube 220 New.webp";
      const alt = isSchematic ? `${NAME} ${size} - schéma des dimensions` : ALT_BASE;

      const mediaId = await uploadImage(productId, filePath, position++, {
        isFeatured,
        alt,
      });

      if (isSchematic) schematicMediaIds[size] = mediaId;
      uploadedCount++;
    }
  }

  console.log(
    `${uploadedCount} images importées (${skippedDuplicates} doublons ignorés).`
  );

  await createOptions(productId, schematicMediaIds);
  console.log("Option Dimensions créée.");

  await createSpecSections(productId);
  console.log("Specs techniques créées.");

  console.log(`\nTerminé. Produit disponible sur /fr/products/${SLUG}`);
}

main().catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
