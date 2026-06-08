// src/lib/devis/generateDevisNumber.ts

export function generateDevisNumber(orderId: string) {
  const year = new Date().getFullYear();
  const shortId = orderId.slice(0, 8).toUpperCase();

  return `DV-${year}-${shortId}`;
}