// src/components/products/ProductMediaGallery.tsx

"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";

type ProductMedia = {
  id: string;
  url: string;
  alt: string | null;
  type: "image" | "video";
  is_featured: boolean | null;
  position: number | null;
};

type Props = {
  media: ProductMedia[];
  productName: string;
};

export default function ProductMediaGallery({ media, productName }: Props) {
  const sortedMedia = [...media].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  );

  const initialMedia =
    sortedMedia.find((item) => item.is_featured) ||
    sortedMedia.find((item) => item.type === "image") ||
    sortedMedia[0] ||
    null;

  const [activeMedia, setActiveMedia] = useState<ProductMedia | null>(
    initialMedia
  );

  return (
    <div>
      <div className="overflow-hidden rounded-[2.5rem] border border-black/10 bg-white shadow-sm">
        <div className="relative aspect-[4/3] bg-[#e8e0d4]">
          {activeMedia ? (
            activeMedia.type === "video" ? (
              <video
                key={activeMedia.id}
                src={activeMedia.url}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={activeMedia.url}
                alt={activeMedia.alt || productName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
              Aucun média
            </div>
          )}
        </div>
      </div>

      {sortedMedia.length > 1 ? (
        <div className="mt-5 grid grid-cols-4 gap-3">
          {sortedMedia.map((item) => {
            const isActive = item.id === activeMedia?.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMedia(item)}
                className={`relative aspect-square overflow-hidden rounded-2xl border bg-white transition ${
                  isActive
                    ? "border-black ring-2 ring-black/20"
                    : "border-black/10 hover:border-black/40"
                }`}
              >
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.url}
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.alt || productName}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}