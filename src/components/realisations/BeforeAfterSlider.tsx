"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type ImageData = {
  url: string;
  alt: string | null;
};

type Props = {
  before: ImageData;
  after: ImageData;
  title: string;
};

export default function BeforeAfterSlider({ before, after, title }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(50);

  function updatePosition(clientX: number) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const nextPosition = Math.min(Math.max((x / rect.width) * 100, 5), 95);

    setPosition(nextPosition);
  }

  return (
    <div
      ref={containerRef}
      className="group relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-black/5 shadow-sm"
      onMouseMove={(event) => updatePosition(event.clientX)}
      onTouchMove={(event) => updatePosition(event.touches[0].clientX)}
    >
      <Image
        src={after.url}
        alt={after.alt || `${title} après`}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        priority={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <Image
          src={before.url}
          alt={before.alt || `${title} avant`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div
        className="absolute top-0 h-full w-px bg-white"
        style={{ left: `${position}%` }}
      />

      <div
        className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-black shadow-lg"
        style={{ left: `${position}%` }}
      >
        ↔
      </div>

      <span className="absolute left-6 top-6 rounded-full bg-white/90 px-5 py-2 text-xs font-medium uppercase tracking-[0.22em] text-black shadow-sm">
        Avant
      </span>

      <span className="absolute right-6 top-6 rounded-full bg-white/90 px-5 py-2 text-xs font-medium uppercase tracking-[0.22em] text-black shadow-sm">
        Après
      </span>
    </div>
  );
}