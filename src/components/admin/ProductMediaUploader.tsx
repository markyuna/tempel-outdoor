// src/components/admin/ProductMediaUploader.tsx

"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ProductMedia = {
  id: string;
  product_id: string;
  url: string;
  type: "image" | "video";
  alt: string | null;
  is_featured: boolean | null;
  position: number | null;
};

type Props = {
  productId: string;
  productName?: string;
  productCategory?: string;
  media?: ProductMedia[];
  compact?: boolean;
  setCoverAction: (formData: FormData) => Promise<void>;
  moveMediaAction: (formData: FormData) => Promise<void>;
  deleteMediaAction: (formData: FormData) => Promise<void>;
};

const BUCKET_NAME = "product-media";

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
  return file.name.split(".").pop()?.toLowerCase() || "jpg";
}

function getSeoBaseName({
  productName,
  productCategory,
  mediaType,
}: {
  productName?: string;
  productCategory?: string;
  mediaType: "image" | "video";
}) {
  return slugify(
    [
      productCategory || "produit",
      productName || "tempel-outdoor",
      mediaType === "video" ? "video" : "image",
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function getSeoAlt({
  productName,
  productCategory,
  mediaType,
}: {
  productName?: string;
  productCategory?: string;
  mediaType: "image" | "video";
}) {
  const productLabel = productName || "produit Tempel Outdoor";
  const categoryLabel = productCategory || "extérieur";

  if (mediaType === "video") {
    return `Vidéo du ${productLabel} - ${categoryLabel}`;
  }

  return `${productLabel} - ${categoryLabel} haut de gamme Tempel Outdoor`;
}

export default function ProductMediaUploader({
  productId,
  productName,
  productCategory,
  media = [],
  compact = false,
  setCoverAction,
  moveMediaAction,
  deleteMediaAction,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  const sortedMedia = useMemo(() => {
    return [...media].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (a.position ?? 9999) - (b.position ?? 9999);
    });
  }, [media]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const currentMaxPosition =
        sortedMedia.length > 0
          ? Math.max(...sortedMedia.map((item) => item.position ?? 0))
          : -1;

      for (const [index, file] of files.entries()) {
        const isVideo = file.type.startsWith("video/");
        const mediaType = isVideo ? "video" : "image";
        const fileExt = getFileExtension(file);

        const seoBaseName = getSeoBaseName({
          productName,
          productCategory,
          mediaType,
        });

        const seoIndex = String(currentMaxPosition + index + 2).padStart(
          2,
          "0"
        );

        const fileName = `${seoBaseName}-${seoIndex}.${fileExt}`;
        const filePath = `${productId}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw new Error(uploadError.message);

        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData.path);

        const shouldBeCover = sortedMedia.length === 0 && index === 0;

        const { error: dbError } = await supabase.from("product_media").insert({
          product_id: productId,
          url: publicUrl,
          type: mediaType,
          alt: getSeoAlt({
            productName,
            productCategory,
            mediaType,
          }),
          is_featured: shouldBeCover,
          position: currentMaxPosition + index + 1,
        });

        if (dbError) throw new Error(dbError.message);
      }

      event.target.value = "";
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur upload média.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={compact ? "" : "rounded-3xl border bg-white p-8"}>
      <h2 className="text-xl font-semibold">Aperçu médias</h2>

      <p className="mt-2 text-sm text-[#5f5a54]">
        Ajoute, organise, supprime les médias et définis l’image cover. Les noms
        de fichiers et textes alternatifs sont générés automatiquement pour le
        SEO.
      </p>

      <label className="mt-6 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-[#f7f4ee] px-5 py-8 text-center transition hover:bg-white">
        <ImagePlus className="h-5 w-5" />
        <Video className="h-5 w-5" />

        <span className="text-sm font-semibold">
          {uploading ? "Upload en cours..." : "Ajouter images ou vidéos"}
        </span>

        <input
          type="file"
          accept="image/*,video/mp4,video/webm"
          multiple
          disabled={uploading}
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {sortedMedia.map((item, index) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border bg-[#f7f4ee]"
          >
            <div className="relative aspect-[4/3] bg-white">
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt={item.alt || "Média produit Tempel Outdoor"}
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  muted
                  controls
                  className="h-full w-full object-cover"
                />
              )}

              {item.is_featured && (
                <div className="absolute left-2 top-2 rounded-full bg-black px-3 py-1 text-[11px] font-semibold text-white">
                  Cover
                </div>
              )}
            </div>

            <div className="space-y-3 p-3">
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>Position {item.position ?? index}</span>
                <span className="uppercase">{item.type}</span>
              </div>

              {item.alt && (
                <p className="line-clamp-2 text-[11px] leading-4 text-black/50">
                  Alt SEO : {item.alt}
                </p>
              )}

              <div className="grid grid-cols-4 gap-2">
                <form action={moveMediaAction}>
                  <input type="hidden" name="mediaId" value={item.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={index === 0}
                    className="w-full rounded-xl border bg-white p-2 disabled:opacity-40"
                  >
                    <ArrowUp className="mx-auto h-4 w-4" />
                  </button>
                </form>

                <form action={moveMediaAction}>
                  <input type="hidden" name="mediaId" value={item.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={index === sortedMedia.length - 1}
                    className="w-full rounded-xl border bg-white p-2 disabled:opacity-40"
                  >
                    <ArrowDown className="mx-auto h-4 w-4" />
                  </button>
                </form>

                <form action={setCoverAction}>
                  <input type="hidden" name="mediaId" value={item.id} />
                  <button
                    type="submit"
                    disabled={Boolean(item.is_featured)}
                    className="w-full rounded-xl border bg-white p-2 disabled:opacity-40"
                  >
                    <Star className="mx-auto h-4 w-4" />
                  </button>
                </form>

                <form
                  action={deleteMediaAction}
                  onSubmit={(event) => {
                    if (
                      !window.confirm(
                        "Supprimer définitivement ce média du produit ?"
                      )
                    ) {
                      event.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="mediaId" value={item.id} />
                  <input type="hidden" name="mediaUrl" value={item.url} />

                  <button
                    type="submit"
                    className="w-full rounded-xl border border-red-200 bg-red-50 p-2 text-red-600"
                  >
                    <Trash2 className="mx-auto h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}