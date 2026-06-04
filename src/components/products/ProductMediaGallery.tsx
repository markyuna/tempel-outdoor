"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useMemo, useRef, useState } from "react";

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
};

export default function ProductMediaGallery({
  media,
  productName,
  selectedMediaId,
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

  const [manualMediaId, setManualMediaId] = useState<string | null>(null);

  const activeMedia = useMemo(() => {
    const targetId = selectedMediaId || manualMediaId;

    return (
      sortedMedia.find((item) => item.id === targetId) ||
      fallbackMedia
    );
  }, [selectedMediaId, manualMediaId, sortedMedia, fallbackMedia]);

  async function handlePlayVideo() {
    if (!videoRef.current) return;

    try {
      await videoRef.current.play();
    } catch (error) {
      console.error("Erreur lecture vidéo:", error);
    }
  }

  return (
    <div>
      <div className="overflow-hidden rounded-[2.5rem] border border-black/10 bg-white shadow-sm">
        <div className="relative aspect-[4/3] bg-[#e8e0d4]">
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
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:scale-105 hover:bg-black"
                  aria-label="Lire la vidéo"
                >
                  <Play className="ml-1 h-7 w-7 fill-white" />
                </button>
              </div>
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
        <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {sortedMedia.map((item) => {
            const isActive = item.id === activeMedia?.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setManualMediaId(item.id)}
                className={`relative aspect-square overflow-hidden rounded-2xl border bg-white transition ${
                  isActive
                    ? "border-black ring-2 ring-black/20"
                    : "border-black/10 hover:border-black/40"
                }`}
                aria-label={`Voir ${item.alt || productName}`}
              >
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <Play className="h-6 w-6 fill-white text-white" />
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