#!/usr/bin/env node
/**
 * import-cube-diamond.js
 * Importe le sauna "Cube Diamond" (Passion Spas) dans Supabase.
 * - Crée le produit (univers: bien-etre, catégorie: sauna)
 * - Upload toutes les photos (dédupliquées par contenu) des 4 tailles (120/180/220/260)
 * - Crée l'option "Dimensions" (prix + schéma technique lié par taille)
 * - Crée l'option "Chauffage" (Traditionnel / Traditionnel + Infrarouge, même prix)
 * - Crée la section de specs techniques
 *
 * Usage: node import-cube-diamond.js
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
  "E:\\DEVELOPPMENT WEB\\TempelOutdoor-Dev\\Passion Spas\\09) Passion Saunas\\03) Photos\\Cube Diamond";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SLUG = "cube-diamond";
const NAME = "Cube Diamond";
const ALT_BASE = `${NAME} - sauna haut de gamme Tempel Outdoor`;

const SIZES = [
  { size: "120", label: "205 x 120 x 207 cm", price: 3990, featuredFile: "Sauna Cube 120.webp" },
  { size: "180", label: "205 x 180 x 207 cm", price: 4990, featuredFile: null },
  { size: "220", label: "205 x 220 x 207 cm", price: 5790, featuredFile: null },
  { size: "260", label: "205 x 260 x 207 cm", price: 6790, featuredFile: null },
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
  const { error: dimError } = await supabase.from("product_options").insert({
    product_id: productId,
    name: "Dimensions",
    values: SIZES.map(
      ({ label, price, size }) =>
        `${label} | ${price} | ${schematicMediaIds[size]} | ${size}`
    ),
    required: true,
    position: 0,
  });

  if (dimError) throw new Error(`Dimensions option error: ${dimError.message}`);

  const { error: heaterError } = await supabase.from("product_options").insert({
    product_id: productId,
    name: "Chauffage",
    values: ["Traditionnel", "Traditionnel + Infrarouge"],
    required: true,
    position: 1,
  });

  if (heaterError) throw new Error(`Chauffage option error: ${heaterError.message}`);
}

async function createSpecSections(productId) {
  const { data: section, error: sectionError } = await supabase
    .from("product_spec_sections")
    .insert({ product_id: productId, title: "DÉTAILS D'ARTICLE", position: 0 })
    .select("id")
    .single();

  if (sectionError) throw new Error(`Spec section error: ${sectionError.message}`);

  const items = [
    { label: "Dimensions extérieures (120)", value: "205 x 120 x 207 cm" },
    { label: "Dimensions extérieures (180)", value: "205 x 180 x 207 cm" },
    { label: "Dimensions extérieures (220)", value: "205 x 220 x 207 cm" },
    { label: "Dimensions extérieures (260)", value: "205 x 260 x 207 cm" },
    { label: "Dimensions intérieures (120)", value: "192 x 94 cm" },
    { label: "Dimensions intérieures (180)", value: "192 x 154 cm" },
    { label: "Dimensions intérieures (220)", value: "192 x 194 cm" },
    { label: "Dimensions intérieures (260)", value: "192 x 194 cm" },
    { label: "Capacité (120)", value: "2 personnes" },
    { label: "Capacité (180)", value: "4 personnes" },
    { label: "Capacité (220)", value: "5 personnes" },
    { label: "Capacité (260)", value: "5 personnes" },
    { label: "Poêle électrique (120)", value: "3,6 kW, inclus" },
    { label: "Poêle électrique (180)", value: "8 kW, inclus" },
    { label: "Poêle électrique (220)", value: "8 kW, inclus" },
    { label: "Poêle électrique (260)", value: "8 kW, inclus" },
    { label: "Poids (120)", value: "450 kg" },
    { label: "Poids (180)", value: "550 kg" },
    { label: "Poids (220)", value: "610 kg" },
    { label: "Poids (260)", value: "680 kg" },
    { label: "Matériau", value: "Thermo Wood (garantie 5 ans)" },
    { label: "Banquette et dossier", value: "Clear Aspen" },
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
  console.log("Import Cube Diamond -> Supabase\n");

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
        "Sauna extérieur 2 à 5 places — Cube Diamond, 4 dimensions disponibles",
      description:
        "Découvrez le Cube Diamond, un sauna extérieur en Thermo Wood (garantie 5 ans), disponible en quatre dimensions — 120, 180, 220 ou 260 — pour accueillir de 2 à 5 personnes. " +
        "Choisissez également votre mode de chauffe : poêle traditionnel seul, ou combiné à des panneaux infrarouges pour une expérience de chaleur complète. " +
        "Chaque sauna est livré avec son poêle électrique, son éclairage, sa vitre de sécurité teintée bronze et tous les accessoires nécessaires. " +
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

  const seenHashes = new Map(); // hash -> true once uploaded
  const schematicMediaIds = {};
  let position = 0;
  let uploadedCount = 0;
  let skippedDuplicates = 0;

  for (const { size } of SIZES) {
    const folder = path.join(IMAGES_BASE, `Cube Diamond ${size}`);
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

      const isFeatured = fileName === "Sauna Cube 120.webp";
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
  console.log("Options Dimensions + Chauffage créées.");

  await createSpecSections(productId);
  console.log("Specs techniques créées.");

  console.log(`\nTerminé. Produit disponible sur /fr/products/${SLUG}`);
}

main().catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
