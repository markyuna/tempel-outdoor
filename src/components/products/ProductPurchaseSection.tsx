"use client";

import { useMemo, useState } from "react";

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
  const sortedVariants = useMemo(
    () => [...variants].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [variants]
  );

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(sortedVariants[0] ?? null);

  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(
    sortedVariants[0]?.image_media_id ?? null
  );

  function handleSelectVariant(variant: ProductVariant) {
    setSelectedVariant(variant);
    setSelectedMediaId(variant.image_media_id);
  }

  return (
    <div className="w-full max-w-[640px]">
      <ProductMediaGallery
        media={media}
        productName={productName}
        selectedMediaId={selectedMediaId}
        onSelectMedia={setSelectedMediaId}
      />

      {sortedVariants.length > 0 && (
        <div className="mt-6">
          <ProductVariantSelector
            variants={sortedVariants}
            selectedVariantId={selectedVariant?.id}
            onSelect={handleSelectVariant}
          />
        </div>
      )}
    </div>
  );
}