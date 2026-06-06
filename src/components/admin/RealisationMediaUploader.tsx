"use client";

import Image from "next/image";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { createClient } from "@/lib/supabase/client";

type RealisationMedia = {
  id: string;
  realisation_id: string;
  url: string;
  alt: string | null;
  type: string | null;
  is_cover: boolean | null;
  position: number | null;
};

type Props = {
  realisationId: string;
  realisationTitle?: string;
  realisationCategory?: string;
  realisationCity?: string | null;
  media?: RealisationMedia[];
};

const BUCKET_NAME = "realisations";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "et")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getFileExtension(file: File) {
  const originalExtension = file.name.split(".").pop()?.toLowerCase();

  if (originalExtension) return originalExtension;

  if (file.type.includes("png")) return "png";
  if (file.type.includes("webp")) return "webp";
  if (file.type.includes("video")) return "mp4";

  return "jpg";
}

function getSeoBaseName({
  title,
  category,
  city,
  mediaType,
}: {
  title?: string;
  category?: string;
  city?: string | null;
  mediaType: "image" | "video";
}) {
  return slugify(
    [
      category || "realisation",
      title || "installation-tempel-outdoor",
      city || "france",
      mediaType,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function getSeoAlt({
  title,
  category,
  city,
  mediaType,
}: {
  title?: string;
  category?: string;
  city?: string | null;
  mediaType: "image" | "video";
}) {
  const location = city ? ` à ${city}` : "";
  const fallbackTitle = category
    ? `Installation ${category} Tempel Outdoor`
    : "Installation Tempel Outdoor";

  if (mediaType === "video") {
    return `Vidéo de ${title || fallbackTitle}${location}`;
  }

  return `${title || fallbackTitle}${location} - réalisation client premium`;
}

export default function RealisationMediaUploader({
  realisationId,
  realisationTitle,
  realisationCategory,
  realisationCity,
  media = [],
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sortedMedia = useMemo(() => {
    return [...media].sort((a, b) => {
      if (a.is_cover && !b.is_cover) return -1;
      if (!a.is_cover && b.is_cover) return 1;
      return (a.position ?? 9999) - (b.position ?? 9999);
    });
  }, [media]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    try {
      setUploading(true);

      const currentMaxPosition =
        sortedMedia.length > 0
          ? Math.max(...sortedMedia.map((item) => item.position ?? 0))
          : -1;

      for (const [index, file] of files.entries()) {
        const isVideo = file.type.startsWith("video/");
        const mediaType = isVideo ? "video" : "image";
        const fileExt = getFileExtension(file);

        const seoBaseName = getSeoBaseName({
          title: realisationTitle,
          category: realisationCategory,
          city: realisationCity,
          mediaType,
        });

        const seoIndex = String(currentMaxPosition + index + 2).padStart(
          2,
          "0"
        );

        const uniqueId = crypto.randomUUID().slice(0, 8);
        const seoFileName = `${seoBaseName}-${seoIndex}-${uniqueId}.${fileExt}`;
        const filePath = `${realisationId}/${seoFileName}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        const isFirstImage = sortedMedia.length === 0 && index === 0;

        const { error: insertError } = await supabase
          .from("realisation_media")
          .insert({
            realisation_id: realisationId,
            url: data.publicUrl,
            alt: getSeoAlt({
              title: realisationTitle,
              category: realisationCategory,
              city: realisationCity,
              mediaType,
            }),
            type: mediaType,
            is_cover: isFirstImage,
            position: currentMaxPosition + index + 1,
          });

        if (insertError) throw insertError;
      }

      event.target.value = "";

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erreur upload réalisation:", error);
      alert("Erreur lors de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSetCover(mediaId: string) {
    try {
      const { error: resetError } = await supabase
        .from("realisation_media")
        .update({ is_cover: false })
        .eq("realisation_id", realisationId);

      if (resetError) throw resetError;

      const { error: coverError } = await supabase
        .from("realisation_media")
        .update({ is_cover: true })
        .eq("id", mediaId);

      if (coverError) throw coverError;

      router.refresh();
    } catch (error) {
      console.error("Erreur couverture réalisation:", error);
      alert("Erreur lors du changement de couverture.");
    }
  }

  async function handleDelete(mediaItem: RealisationMedia) {
    const confirmDelete = window.confirm("Supprimer cette image ?");
    if (!confirmDelete) return;

    try {
      const url = new URL(mediaItem.url);
      const path = url.pathname.split(`/${BUCKET_NAME}/`)[1];

      if (path) {
        await supabase.storage.from(BUCKET_NAME).remove([path]);
      }

      const { error } = await supabase
        .from("realisation_media")
        .delete()
        .eq("id", mediaItem.id);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Erreur suppression média réalisation:", error);
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Images du projet</h2>
          <p className="mt-2 text-sm text-black/50">
            Les noms de fichiers et textes alternatifs sont générés
            automatiquement pour améliorer le SEO.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80">
          <ImagePlus size={18} />
          {uploading || isPending ? "Upload..." : "Ajouter images"}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {sortedMedia.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {sortedMedia.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-black/10 bg-[#f7f4ee]"
            >
              <div className="relative aspect-[4/3] bg-black/5">
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.alt || "Image réalisation Tempel Outdoor"}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                )}

                {item.is_cover && (
                  <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                    Couverture
                  </span>
                )}
              </div>

              <div className="space-y-4 p-4">
                {item.alt && (
                  <p className="line-clamp-2 text-xs leading-5 text-black/50">
                    Alt SEO : {item.alt}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetCover(item.id)}
                    disabled={Boolean(item.is_cover)}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-medium transition hover:bg-black hover:text-white disabled:opacity-40"
                  >
                    <Star size={14} />
                    Couverture
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-black/15 p-10 text-center text-sm text-black/45">
          Aucune image ajoutée pour cette réalisation.
        </div>
      )}
    </section>
  );
}