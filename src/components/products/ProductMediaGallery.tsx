// src/components/products/ProductMediaGallery.tsx

"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useMemo, useRef } from "react";

export type ProductMedia = {
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
  selectedMediaId?: string | null;
  onSelectMedia?: (mediaId: string) => void;
};

export default function ProductMediaGallery({
  media,
  productName,
  selectedMediaId,
  onSelectMedia,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const sortedMedia = useMemo(
    () => [...media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [media]
  );

  const fallbackMedia = useMemo(
    () =>
      sortedMedia.find((item) => item.is_featured) ||
      sortedMedia.find((item) => item.type === "image") ||
      sortedMedia[0] ||
      null,
    [sortedMedia]
  );

  const activeMedia = useMemo(() => {
    return (
      sortedMedia.find((item) => item.id === selectedMediaId) || fallbackMedia
    );
  }, [selectedMediaId, sortedMedia, fallbackMedia]);

  const activeIndex = useMemo(() => {
    const index = sortedMedia.findIndex((item) => item.id === activeMedia?.id);
    return index >= 0 ? index : 0;
  }, [activeMedia?.id, sortedMedia]);

  function goToPrevious() {
    if (sortedMedia.length <= 1) return;

    const previousIndex =
      activeIndex === 0 ? sortedMedia.length - 1 : activeIndex - 1;

    onSelectMedia?.(sortedMedia[previousIndex].id);
  }

  function goToNext() {
    if (sortedMedia.length <= 1) return;

    const nextIndex =
      activeIndex === sortedMedia.length - 1 ? 0 : activeIndex + 1;

    onSelectMedia?.(sortedMedia[nextIndex].id);
  }

  async function handlePlayVideo() {
    if (!videoRef.current) return;

    try {
      await videoRef.current.play();
    } catch (error) {
      console.error("Erreur lecture vidéo:", error);
    }
  }

  return (
    <div className="w-full max-w-[680px]">
      <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm">
        <div className="relative aspect-[1.45/1] bg-[#e8e0d4]">
          {activeMedia ? (
            activeMedia.type === "video" ? (
              <div className="relative h-full w-full">
                <video
                  ref={videoRef}
                  key={activeMedia.url}
                  src={activeMedia.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={handlePlayVideo}
                  className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/75 text-white backdrop-blur transition hover:scale-105 hover:bg-black"
                  aria-label="Lire la vidéo"
                >
                  <Play className="ml-0.5 h-5 w-5 fill-white" />
                </button>
              </div>
            ) : (
              <Image
                key={activeMedia.id}
                src={activeMedia.url}
                alt={activeMedia.alt || productName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-cover"
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Aucun média
            </div>
          )}

          {sortedMedia.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow-sm backdrop-blur transition hover:bg-white"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black shadow-sm backdrop-blur transition hover:bg-white"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {activeIndex + 1} / {sortedMedia.length}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}