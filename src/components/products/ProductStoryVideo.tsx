// src/components/products/ProductStoryVideo.tsx

import { PlayCircle } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  videoUrl: string;
};

export default function ProductStoryVideo({
  title = "Un produit pensé pour sublimer votre extérieur.",
  description = "Design, confort et durabilité pour créer un espace extérieur élégant, fonctionnel et agréable au quotidien.",
  videoUrl,
}: Props) {
  return (
    <section className="rounded-[2rem] bg-black text-white overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Contenu */}
        <div className="flex flex-col justify-center p-8 md:p-12 xl:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7b86e]">
            Tempel Outdoor
          </p>

          <h2 className="mt-5 max-w-xl text-4xl font-bold leading-tight md:text-5xl">
            {title}
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-white/70 md:text-lg">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              Design Premium
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              Matériaux Sélectionnés
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              Livraison France & Europe
            </span>
          </div>
        </div>

        {/* Video */}
        <div className="relative min-h-[320px] lg:min-h-full">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/30" />

          <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-md">
            <PlayCircle className="h-5 w-5 text-[#d7b86e]" />
            <span className="text-sm font-medium">
              Savoir-faire & qualité
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}