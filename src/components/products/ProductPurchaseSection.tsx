"use client";

import { useState } from "react";

import ProductMediaGallery from "@/components/products/ProductMediaGallery";
import ProductVariantSelector from "@/components/products/ProductVariantSelector";

type ProductMedia = {
  id: string;
  url: string;
  alt: string | null;
  type: "image" | "video";
  is_featured: boolean | null;
  position: number | null;
};

type ProductVariant = {
  id: string;
  name: string;
  value: string;
  image_media_id: string | null;
  position: number | null;
};

type Props = {
  media: ProductMedia[];
  variants: ProductVariant[];
  productName: string;
};

export default function ProductPurchaseSection({
  media,
  variants,
  productName,
}: Props) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(variants[0] ?? null);

  return (
    <div>
      <ProductMediaGallery
        media={media}
        productName={productName}
        selectedMediaId={selectedVariant?.image_media_id}
      />

      <ProductVariantSelector
        variants={variants}
        selectedVariantId={selectedVariant?.id}
        onSelect={setSelectedVariant}
      />
    </div>
  );
}