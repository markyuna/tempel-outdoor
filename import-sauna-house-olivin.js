#!/usr/bin/env node
/**
 * import-sauna-house-olivin.js
 * Importe le sauna "Sauna House Olivin" (Passion Spas) dans Supabase.
 * - Crée le produit (univers: bien-etre, catégorie: sauna)
 * - Upload les photos des 2 tailles (230 / 510) — aucun doublon entre elles
 * - Crée l'option "Dimensions" (prix + schéma technique lié par taille)
 * - Crée la section de specs techniques
 *
 * Usage: node import-sauna-house-olivin.js
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-media";

const IMAGES_BASE =
  "E:\\DEVELOPPMENT WEB\\TempelOutdoor-Dev\\Passion Spas\\09) Passion Saunas\\03) Photos\\Sauna House Olivin";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SLUG = "sauna-house-olivin";
const NAME = "Sauna House Olivin";
const ALT_BASE = `${NAME} - sauna haut de gamme Tempel Outdoor`;

const SIZES = [
  { size: "230", folder: "Sauna House Olivin 230 Combi", label: "230 x 230 x 220 cm", price: 7490, featuredFile: "Sauna House 230 Pantone.webp" },
  { size: "510", folder: "Sauna House Olivin 510 Combi", label: "510 x 240 x 220 cm", price: 10990, featuredFile: null },
];

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
    { label: "Dimensions du toit (230)", value: "230 x 230 x 220 cm" },
    { label: "Dimensions du toit (510)", value: "510 x 240 x 220 cm" },
    { label: "Dimensions extérieures de la cabine", value: "208 x 186 cm" },
    { label: "Dimensions intérieures", value: "200 x 168 cm" },
    { label: "Capacité", value: "4 personnes" },
    { label: "Poids (230)", value: "650 kg" },
    { label: "Poids (510)", value: "950 kg" },
    { label: "Matériau", value: "Thermo Wood (garantie 5 ans)" },
    { label: "Banquette", value: "200 x 70 cm, Clear Aspen" },
    { label: "Poêle électrique", value: "9 kW traditionnel, inclus" },
    {
      label: "Chauffage infrarouge",
      value: "3 panneaux Full Spectrum 400 W, inclus",
    },
    { label: "Vitrage", value: "Verre de sécurité bronze, 8 mm" },
    { label: "Porte", value: "Battante" },
    { label: "Toiture", value: "Feutre bitumé, inclus" },
    { label: "Éclairage", value: "Inclus" },
    {
      label: "Accessoires inclus",
      value: "Seau, louche, pierres de sauna, thermo-hygromètre, sablier",
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
  console.log("Import Sauna House Olivin -> Supabase\n");

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
        "Sauna extérieur 4 places avec auvent — Sauna House Olivin, disponible en 230 ou 510",
      description:
        "Le Sauna House Olivin associe une cabine de sauna en Thermo Wood (garantie 5 ans) à un généreux auvent extérieur, pour un espace de détente à l'abri des regards et des intempéries. " +
        "Le 230 propose un auvent carré compact, tandis que le 510 s'étend en une longue terrasse couverte, idéale pour prolonger la détente après le sauna. " +
        "Chauffage combiné : poêle électrique traditionnel 9 kW et 3 panneaux infrarouges Full Spectrum 400 W inclus. " +
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

  const schematicMediaIds = {};
  let position = 0;
  let uploadedCount = 0;

  for (const { size, folder, featuredFile } of SIZES) {
    const folderPath = path.join(IMAGES_BASE, folder);
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => /\.webp$/i.test(f))
      .sort();

    for (const fileName of files) {
      const filePath = path.join(folderPath, fileName);
      const isSchematic = /Technische Tekening/i.test(fileName);
      const isFeatured = featuredFile ? fileName === featuredFile : false;
      const alt = isSchematic ? `${NAME} ${size} - schéma des dimensions` : ALT_BASE;

      const mediaId = await uploadImage(productId, filePath, position++, {
        isFeatured,
        alt,
      });

      if (isSchematic) schematicMediaIds[size] = mediaId;
      uploadedCount++;
    }
  }

  console.log(`${uploadedCount} images importées.`);

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
