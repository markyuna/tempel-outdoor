#!/usr/bin/env node
/**
 * import-barrel-sauna-luxury.js
 * Importe le sauna "Barrel Sauna Luxury" (Passion Spas) dans Supabase.
 * - Crée le produit (univers: bien-etre, catégorie: sauna)
 * - Upload les images communes + les 2 schémas de dimensions (120 / 180)
 * - Crée l'option "Dimensions" (120 / 180) avec prix et image liée par valeur,
 *   pour que la galerie bascule sur le bon schéma quand le client change de taille
 * - Crée la section de specs techniques
 *
 * Usage: node import-barrel-sauna-luxury.js
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "product-media";

const IMAGES_BASE =
  "E:\\DEVELOPPMENT WEB\\TempelOutdoor-Dev\\Passion Spas\\09) Passion Saunas\\03) Photos\\Barrel Sauna Luxury";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SLUG = "barrel-sauna-luxury";
const NAME = "Barrel Sauna Luxury";
const ALT_BASE = `${NAME} - sauna haut de gamme Tempel Outdoor`;

// Images communes aux deux tailles (issues du dossier "120", identiques dans "180")
const SHARED_IMAGES = [
  "Photo 22-05-2026, 23 12 25.webp",
  "Photo 22-05-2026, 23 12 33.webp",
  "Photo 29-05-2026, 09 26 29.webp",
  "Photo 29-05-2026, 09 26 54.webp",
  "Photo 29-05-2026, 09 26 54 (1).webp",
  "Photo 29-05-2026, 09 26 54 (2).webp",
  "Photo 29-05-2026, 09 26 54 (3).webp",
  "Photo 29-05-2026, 09 26 54 (4).webp",
  "Photo 29-05-2026, 09 30 15.webp",
  "Photo 29-05-2026, 09 30 15 (1).webp",
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

async function createDimensionsOption(productId, { media120Id, media180Id }) {
  const { error } = await supabase.from("product_options").insert({
    product_id: productId,
    name: "Dimensions",
    values: [
      `185 x 120 x 190 cm | 2599 | ${media120Id} | 120`,
      `185 x 180 x 190 cm | 3499 | ${media180Id} | 180`,
    ],
    required: false,
    position: 0,
  });

  if (error) throw new Error(`Option error: ${error.message}`);
}

async function createSpecSections(productId) {
  const { data: section, error: sectionError } = await supabase
    .from("product_spec_sections")
    .insert({ product_id: productId, title: "DÉTAILS D'ARTICLE", position: 0 })
    .select("id")
    .single();

  if (sectionError) throw new Error(`Spec section error: ${sectionError.message}`);

  const items = [
    { label: "Dimensions extérieures (120)", value: "188 x 120 x 192 cm" },
    { label: "Dimensions extérieures (180)", value: "188 x 180 x 192 cm" },
    { label: "Dimensions intérieures (120)", value: "177 x 94 cm" },
    { label: "Dimensions intérieures (180)", value: "277 x 154 cm" },
    { label: "Capacité (120)", value: "2 personnes" },
    { label: "Capacité (180)", value: "4 personnes" },
    { label: "Poêle électrique (120)", value: "3,6 kW, inclus" },
    { label: "Poêle électrique (180)", value: "6,0 kW, inclus" },
    { label: "Poids (120)", value: "350 kg" },
    { label: "Poids (180)", value: "450 kg" },
    { label: "Matériau", value: "Épicéa (parois et banquette)" },
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
  console.log("Import Barrel Sauna Luxury -> Supabase\n");

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
      price: 2599,
      short_description: "Sauna traditionnel extérieur 2 à 4 places — Barrel Sauna Luxury",
      description:
        "Découvrez le Barrel Sauna Luxury, un sauna extérieur traditionnel en épicéa massif, disponible en deux dimensions pour s'adapter à votre espace et à votre foyer : 120 (2 personnes) ou 180 (4 personnes). " +
        "Chaque sauna est livré avec son poêle électrique, son éclairage, sa vitre de sécurité teintée bronze et tous les accessoires nécessaires pour profiter pleinement de votre rituel bien-être. " +
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

  let position = 0;

  // Photo studio 120 (image principale)
  await uploadImage(
    productId,
    path.join(IMAGES_BASE, "Barrel Sauna Luxury 120", "Barrel Sauna 120 Luxury.webp"),
    position++,
    { isFeatured: true }
  );

  // Photos studio / ambiance 180
  await uploadImage(
    productId,
    path.join(IMAGES_BASE, "Barrel Sauna Luxury 180", "Barrel Sauna Luxury 180.webp"),
    position++
  );
  await uploadImage(
    productId,
    path.join(IMAGES_BASE, "Barrel Sauna Luxury 180", "Barrel Sauna Luxury 180 Sfeer.webp"),
    position++
  );

  // Photos lifestyle communes aux deux tailles
  for (const fileName of SHARED_IMAGES) {
    await uploadImage(
      productId,
      path.join(IMAGES_BASE, "Barrel Sauna Luxury 120", fileName),
      position++
    );
  }

  // Schémas techniques (un par dimension), utilisés aussi comme image liée à l'option
  const media120Id = await uploadImage(
    productId,
    path.join(IMAGES_BASE, "Barrel Sauna Luxury 120", "Barrel Sauna Luxury 120 Technische Tekening.webp"),
    position++,
    { alt: `${NAME} 120 - schéma des dimensions` }
  );

  const media180Id = await uploadImage(
    productId,
    path.join(IMAGES_BASE, "Barrel Sauna Luxury 180", "Barrel Sauna Luxury 180 Technische Tekening.webp"),
    position++,
    { alt: `${NAME} 180 - schéma des dimensions` }
  );

  console.log(`${position} images importées.`);

  await createDimensionsOption(productId, { media120Id, media180Id });
  console.log("Option Dimensions créée (120 -> 2599 EUR, 180 -> 3499 EUR).");

  await createSpecSections(productId);
  console.log("Specs techniques créées.");

  console.log(`\nTerminé. Produit disponible sur /fr/products/${SLUG}`);
}

main().catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
