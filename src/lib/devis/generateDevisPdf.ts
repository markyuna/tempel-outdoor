// src/lib/devis/generateDevisPdf.ts

import { readFile } from "node:fs/promises";

import { PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";

type Order = {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  customer_postal_code: string | null;
  customer_city: string | null;
  customer_country: string | null;
  subtotal: number;
  delivery_price: number | null;
  total: number;
};

type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

const COMPANY = {
  name: "TEMPEL OUTDOOR",
  address: "16 Rue Georges Duhamel",
  postalCity: "95300 Herouville-en-Vexin",
  country: "France",
  email: "contact@tempel-outdoor.fr",
  phone: "",
  siret: "49933190800032",
  vat: "FR01499331908",
  rcs: "RCS Pontoise B 499 331 908",
  capital: "Capital social : 12 000 EUR",
};

function sanitizePdfText(text: string) {
  return text
    .replace(/\u202f/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[éèêë]/g, "e")
    .replace(/[àâä]/g, "a")
    .replace(/[îï]/g, "i")
    .replace(/[ôö]/g, "o")
    .replace(/[ùûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[ÉÈÊË]/g, "E")
    .replace(/[ÀÂÄ]/g, "A")
    .replace(/[ÎÏ]/g, "I")
    .replace(/[ÔÖ]/g, "O")
    .replace(/[ÙÛÜ]/g, "U")
    .replace(/[Ç]/g, "C")
    .replace(/€/g, "EUR");
}

function pdfText(text: string | number | null | undefined) {
  return sanitizePdfText(String(text ?? ""));
}

function formatPrice(price: number) {
  return sanitizePdfText(`${Math.round(price).toLocaleString("fr-FR")} EUR`);
}

function drawText(
  page: PDFPage,
  text: string,
  options: Parameters<PDFPage["drawText"]>[1]
) {
  page.drawText(pdfText(text), options);
}

async function drawLogo({
  pdfDoc,
  page,
  logoPath,
}: {
  pdfDoc: PDFDocument;
  page: PDFPage;
  logoPath?: string;
}) {
  if (!logoPath) {
    return false;
  }

  try {
    const logoBytes = await readFile(logoPath);

    const logoImage = logoPath.toLowerCase().endsWith(".jpg")
      ? await pdfDoc.embedJpg(logoBytes)
      : logoPath.toLowerCase().endsWith(".jpeg")
        ? await pdfDoc.embedJpg(logoBytes)
        : await pdfDoc.embedPng(logoBytes);

    const logoDimensions = logoImage.scaleToFit(145, 26);

    page.drawImage(logoImage, {
      x: 50,
      y: 811,
      width: logoDimensions.width,
      height: logoDimensions.height,
    });

    return true;
  } catch (error) {
    console.error("Erreur chargement logo devis:", error);
    return false;
  }
}

export async function generateDevisPdf({
  order,
  items,
  devisNumber,
  logoPath,
}: {
  order: Order;
  items: OrderItem[];
  devisNumber: string;
  logoPath?: string;
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const black = rgb(0.09, 0.08, 0.07);
  const gold = rgb(0.61, 0.48, 0.31);
  const gray = rgb(0.38, 0.38, 0.38);
  const lightGold = rgb(0.9, 0.84, 0.74);
  const lightBg = rgb(0.97, 0.95, 0.91);

  page.drawRectangle({
    x: 0,
    y: 805,
    width: 595,
    height: 37,
    color: black,
  });

  const hasLogo = await drawLogo({
    pdfDoc,
    page,
    logoPath,
  });

  if (!hasLogo) {
    drawText(page, COMPANY.name, {
      x: 50,
      y: 815,
      size: 14,
      font: bold,
      color: rgb(1, 1, 1),
    });
  }

  drawText(page, "DEVIS", {
    x: 465,
    y: 775,
    size: 28,
    font: bold,
    color: gold,
  });

  drawText(page, `N° ${devisNumber}`, {
    x: 50,
    y: 780,
    size: 12,
    font: bold,
    color: black,
  });

  drawText(page, `Date : ${new Date().toLocaleDateString("fr-FR")}`, {
    x: 415,
    y: 748,
    size: 10,
    font,
    color: gray,
  });

  page.drawLine({
    start: { x: 50, y: 735 },
    end: { x: 545, y: 735 },
    thickness: 1,
    color: lightGold,
  });

  drawText(page, COMPANY.name, {
    x: 50,
    y: 705,
    size: 11,
    font: bold,
    color: black,
  });

  const companyLines = [
    COMPANY.address,
    COMPANY.postalCity,
    COMPANY.country,
    COMPANY.email,
    COMPANY.phone,
    `SIRET : ${COMPANY.siret}`,
    `TVA : ${COMPANY.vat}`,
    COMPANY.rcs,
    COMPANY.capital,
  ].filter(Boolean);

  let companyY = 688;

  companyLines.forEach((line) => {
    drawText(page, line, {
      x: 50,
      y: companyY,
      size: 8.5,
      font,
      color: gray,
    });

    companyY -= 12;
  });

  page.drawRectangle({
    x: 325,
    y: 600,
    width: 220,
    height: 115,
    color: lightBg,
    borderColor: lightGold,
    borderWidth: 1,
  });

  drawText(page, "CLIENT", {
    x: 345,
    y: 690,
    size: 10,
    font: bold,
    color: gold,
  });

  const customerLines = [
    `${order.customer_first_name} ${order.customer_last_name}`,
    order.customer_address,
    `${order.customer_postal_code ?? ""} ${order.customer_city ?? ""}`.trim(),
    order.customer_country,
    `Email : ${order.customer_email}`,
    `Tel : ${order.customer_phone}`,
  ].filter(Boolean) as string[];

  let customerY = 670;

  customerLines.forEach((line) => {
    drawText(page, line, {
      x: 345,
      y: customerY,
      size: 8.7,
      font,
      color: gray,
    });

    customerY -= 13;
  });

  drawText(page, "Produits commandes", {
    x: 50,
    y: 550,
    size: 15,
    font: bold,
    color: black,
  });

  page.drawRectangle({
    x: 50,
    y: 515,
    width: 495,
    height: 24,
    color: black,
  });

  drawText(page, "Produit", {
    x: 62,
    y: 523,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });

  drawText(page, "Qte", {
    x: 318,
    y: 523,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });

  drawText(page, "Prix unitaire", {
    x: 370,
    y: 523,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });

  drawText(page, "Total", {
    x: 492,
    y: 523,
    size: 9,
    font: bold,
    color: rgb(1, 1, 1),
  });

  let rowY = 490;

  items.forEach((item, index) => {
    const isEven = index % 2 === 0;

    if (isEven) {
      page.drawRectangle({
        x: 50,
        y: rowY - 9,
        width: 495,
        height: 30,
        color: rgb(0.985, 0.975, 0.955),
      });
    }

    drawText(page, pdfText(item.product_name).slice(0, 42), {
      x: 62,
      y: rowY,
      size: 9.5,
      font,
      color: black,
    });

    drawText(page, String(item.quantity), {
      x: 322,
      y: rowY,
      size: 9.5,
      font,
      color: gray,
    });

    drawText(page, formatPrice(Number(item.unit_price)), {
      x: 370,
      y: rowY,
      size: 9.5,
      font,
      color: gray,
    });

    drawText(page, formatPrice(Number(item.total_price)), {
      x: 492,
      y: rowY,
      size: 9.5,
      font: bold,
      color: black,
    });

    rowY -= 32;
  });

  page.drawRectangle({
    x: 335,
    y: 285,
    width: 210,
    height: 105,
    color: lightBg,
    borderColor: lightGold,
    borderWidth: 1,
  });

  drawText(page, "Sous-total", {
    x: 355,
    y: 360,
    size: 9.5,
    font,
    color: gray,
  });

  drawText(page, formatPrice(Number(order.subtotal || 0)), {
    x: 450,
    y: 360,
    size: 9.5,
    font,
    color: black,
  });

  drawText(page, "Livraison", {
    x: 355,
    y: 336,
    size: 9.5,
    font,
    color: gray,
  });

  drawText(page, formatPrice(Number(order.delivery_price || 0)), {
    x: 450,
    y: 336,
    size: 9.5,
    font,
    color: black,
  });

  page.drawLine({
    start: { x: 355, y: 318 },
    end: { x: 525, y: 318 },
    thickness: 1,
    color: lightGold,
  });

  drawText(page, "Total TTC", {
    x: 355,
    y: 294,
    size: 14,
    font: bold,
    color: black,
  });

  drawText(page, formatPrice(Number(order.total || 0)), {
    x: 445,
    y: 294,
    size: 14,
    font: bold,
    color: gold,
  });

  drawText(page, "Conditions commerciales", {
    x: 50,
    y: 250,
    size: 12,
    font: bold,
    color: black,
  });

  const conditions = [
    "Validite du devis : 30 jours.",
    "Paiement : 30 % a la commande, solde avant expedition.",
    "Livraison selon disponibilite et confirmation logistique.",
    "Ce devis est etabli sous reserve de validation finale de la commande.",
  ];

  let conditionY = 230;

  conditions.forEach((line) => {
    drawText(page, `- ${line}`, {
      x: 50,
      y: conditionY,
      size: 8.8,
      font,
      color: gray,
    });

    conditionY -= 14;
  });

  page.drawLine({
    start: { x: 50, y: 95 },
    end: { x: 545, y: 95 },
    thickness: 1,
    color: lightGold,
  });

  drawText(page, "Merci pour votre confiance.", {
    x: 50,
    y: 72,
    size: 9.5,
    font: bold,
    color: black,
  });

  drawText(
    page,
    `${COMPANY.name} - ${COMPANY.address} - ${COMPANY.postalCity} - SIRET ${COMPANY.siret}`,
    {
      x: 50,
      y: 45,
      size: 7.5,
      font,
      color: gray,
    }
  );

  return await pdfDoc.save();
}