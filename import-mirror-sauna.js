#!/usr/bin/env node
/**
 * import-mirror-sauna.js
 * Importe le sauna "Mirror Sauna" (Passion Spas) dans Supabase.
 * - Crée le produit (univers: bien-etre, catégorie: sauna)
 * - Upload les photos (une seule taille, un seul jeu de photos partagé
 *   entre les deux finitions de vitrage — vérifié identiques au pixel près)
 * - Crée l'option "Vitrage" (Safety Glass / Heat Bounce Safety Glass), qui
 *   ne change que le prix — pas d'image ni de fiche technique différente
 * - Crée la section de specs techniques
 *
 * Usage: node import-mirror-sauna.js
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-media";

const IMAGES_FOLDER =
  "E:\\DEVELOPPMENT WEB\\TempelOutdoor-Dev\\Passion Spas\\09) Passion Saunas\\03) Photos\\Mirror Sauna\\Mirror Sauna Luxury 200";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SLUG = "mirror-sauna";
const NAME = "Mirror Sauna";
const ALT_BASE = `${NAME} - sauna haut de gamme Tempel Outdoor`;

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

  const { error: dbError } = await supabase.from("product_media").insert({
    product_id: productId,
    url: publicUrl,
    type: "image",
    alt,
    is_featured: isFeatured,
    position,
  });

  if (dbError) throw new Error(`DB error media: ${dbError.message}`);
}

async function createOptions(productId) {
  const { error } = await supabase.from("product_options").insert({
    product_id: productId,
    name: "Vitrage",
    values: ["Safety Glass | 6490", "Heat Bounce Safety Glass | 15900"],
    required: true,
    position: 0,
  });

  if (error) throw new Error(`Vitrage option error: ${error.message}`);
}

async function createSpecSections(productId) {
  const { data: section, error: sectionError } = await supabase
    .from("product_spec_sections")
    .insert({ product_id: productId, title: "DÉTAILS D'ARTICLE", position: 0 })
    .select("id")
    .single();

  if (sectionError) throw new Error(`Spec section error: ${sectionError.message}`);

  const items = [
    { label: "Dimensions extérieures", value: "200 x 170 x 210 cm" },
    { label: "Dimensions intérieures", value: "190 x 160 cm" },
    { label: "Capacité", value: "3 à 4 personnes" },
    { label: "Banquette", value: "190 x 60 cm, Clear Aspen" },
    { label: "Toiture et plancher", value: "Thermo Wood (garantie 5 ans)" },
    { label: "Poêle électrique", value: "9,0 kW, inclus" },
    { label: "Porte", value: "Battante" },
    { label: "Toiture", value: "Feutre bitumé, inclus" },
    { label: "Éclairage", value: "Inclus" },
    {
      label: "Accessoires inclus",
      value: "Seau, louche, pierres de sauna, thermo-hygromètre, sablier",
    },
    { label: "Installation", value: "Montage DIY" },
    { label: "Poids", value: "450 kg" },
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
  console.log("Import Mirror Sauna -> Supabase\n");

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
      price: 6490,
      short_description:
        "Sauna extérieur miroir 3 à 4 places — Mirror Sauna, vitrage Safety Glass ou Heat Bounce",
      description:
        "Le Mirror Sauna est un sauna extérieur à la façade entièrement miroir, qui se fond dans son environnement tout en préservant l'intimité de ses occupants. " +
        "Choisissez entre le vitrage Safety Glass classique ou le vitrage Heat Bounce, qui renvoie la chaleur vers l'intérieur pour une efficacité thermique renforcée. " +
        "Livré avec son poêle électrique 9 kW, son éclairage et tous les accessoires nécessaires. " +
        "Sélectionnez votre vitrage ci-contre : le prix s'ajuste automatiquement.",
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

  const files = fs
    .readdirSync(IMAGES_FOLDER)
    .filter((f) => /\.webp$/i.test(f))
    .sort();

  let position = 0;
  for (const fileName of files) {
    const filePath = path.join(IMAGES_FOLDER, fileName);
    const isSchematic = /Technische Tekening/i.test(fileName);
    const isFeatured = fileName === "Mirror Sauna.webp";
    const alt = isSchematic ? `${NAME} - schéma des dimensions` : ALT_BASE;

    await uploadImage(productId, filePath, position++, { isFeatured, alt });
  }

  console.log(`${position} images importées.`);

  await createOptions(productId);
  console.log("Option Vitrage créée (Safety Glass 6490 EUR / Heat Bounce 15900 EUR).");

  await createSpecSections(productId);
  console.log("Specs techniques créées.");

  console.log(`\nTerminé. Produit disponible sur /fr/products/${SLUG}`);
}

main().catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
