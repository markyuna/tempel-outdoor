"use client";

import { useMemo, useState } from "react";

import ProductBuyBox from "@/components/products/ProductBuyBox";
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

type ProductOption = {
  id: string;
  name: string;
  values: string[];
  required: boolean;
  position: number;
};

type Props = {
  media: ProductMedia[];
  variants: ProductVariant[];
  productName: string;
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  categoryLabel: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  shortDescription: string | null;
  deliveryTime: string | null;
  options: ProductOption[];
  initialIsFavorite?: boolean;
  locale?: string;
};

export default function ProductPurchaseSection({
  media,
  variants,
  productName,
  ...buyBoxProps
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

  function handleOptionImageSelect(mediaId: string | null) {
    if (mediaId) setSelectedMediaId(mediaId);
  }

  return (
    <>
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

      <ProductBuyBox
        {...buyBoxProps}
        onOptionImageSelect={handleOptionImageSelect}
      />
    </>
  );
}
