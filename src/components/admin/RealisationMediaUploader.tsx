"use client";

import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { createClient } from "@/lib/supabase/client";

type MediaRole = "before" | "after";

type RealisationMedia = {
  id: string;
  realisation_id: string;
  url: string;
  alt: string | null;
  type: string | null;
  role: MediaRole | null;
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

type ImageSlotProps = {
  title: string;
  description: string;
  role: MediaRole;
  image: RealisationMedia | null;
  isUploading: boolean;
  uploadingRole: MediaRole | null;
  onUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    role: MediaRole
  ) => void;
  onDelete: (mediaItem: RealisationMedia) => void;
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

  return "jpg";
}

function getSeoFileName({
  title,
  category,
  city,
  role,
  file,
}: {
  title?: string;
  category?: string;
  city?: string | null;
  role: MediaRole;
  file: File;
}) {
  const fileExt = getFileExtension(file);

  const baseName = slugify(
    [
      category || "realisation",
      title || "installation-tempel-outdoor",
      city || "france",
      role === "before" ? "avant" : "apres",
    ]
      .filter(Boolean)
      .join(" ")
  );

  const uniqueId = crypto.randomUUID().slice(0, 8);

  return `${baseName}-${uniqueId}.${fileExt}`;
}

function getSeoAlt({
  title,
  category,
  city,
  role,
}: {
  title?: string;
  category?: string;
  city?: string | null;
  role: MediaRole;
}) {
  const location = city ? ` à ${city}` : "";
  const fallbackTitle = category
    ? `Installation ${category} Tempel Outdoor`
    : "Installation Tempel Outdoor";

  return `${title || fallbackTitle}${location} - image ${
    role === "before" ? "avant" : "après"
  } réalisation client`;
}

function getStoragePathFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname.split(`/${BUCKET_NAME}/`)[1] ?? null;
  } catch {
    return null;
  }
}

function ImageSlot({
  title,
  description,
  role,
  image,
  isUploading,
  uploadingRole,
  onUpload,
  onDelete,
}: ImageSlotProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 bg-[#f7f4ee]">
      <div className="relative aspect-[4/3] bg-black/5">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <ImagePlus className="mb-3 text-black/30" size={30} />
            <p className="text-sm font-medium text-black/50">
              Aucune image ajoutée
            </p>
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-black px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white">
          {title}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-black/50">{description}</p>
        </div>

        {image?.alt && (
          <p className="line-clamp-2 text-xs leading-5 text-black/45">
            Alt SEO : {image.alt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/80">
            <ImagePlus size={16} />
            {isUploading ? "Upload..." : image ? "Remplacer" : "Ajouter"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onUpload(event, role)}
              disabled={Boolean(uploadingRole)}
            />
          </label>

          {image && (
            <button
              type="button"
              onClick={() => onDelete(image)}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
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

  const [uploadingRole, setUploadingRole] = useState<MediaRole | null>(null);
  const [isPending, startTransition] = useTransition();

  const beforeImage = useMemo(() => {
    return media.find((item) => item.role === "before") ?? null;
  }, [media]);

  const afterImage = useMemo(() => {
    return (
      media.find((item) => item.role === "after") ??
      media.find((item) => item.is_cover) ??
      null
    );
  }, [media]);

  async function deleteExistingRoleImage(role: MediaRole) {
    const existingItem = role === "before" ? beforeImage : afterImage;

    if (!existingItem) return;

    const storagePath = getStoragePathFromUrl(existingItem.url);

    if (storagePath) {
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
    }

    await supabase.from("realisation_media").delete().eq("id", existingItem.id);
  }

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    role: MediaRole
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Merci d'ajouter uniquement une image.");
      event.target.value = "";
      return;
    }

    try {
      setUploadingRole(role);

      await deleteExistingRoleImage(role);

      if (role === "after") {
        await supabase
          .from("realisation_media")
          .update({ is_cover: false })
          .eq("realisation_id", realisationId);
      }

      const seoFileName = getSeoFileName({
        title: realisationTitle,
        category: realisationCategory,
        city: realisationCity,
        role,
        file,
      });

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

      const { error: insertError } = await supabase
        .from("realisation_media")
        .insert({
          realisation_id: realisationId,
          url: data.publicUrl,
          alt: getSeoAlt({
            title: realisationTitle,
            category: realisationCategory,
            city: realisationCity,
            role,
          }),
          type: "image",
          role,
          is_cover: role === "after",
          position: role === "before" ? 0 : 1,
        });

      if (insertError) throw insertError;

      event.target.value = "";

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erreur upload réalisation:", error);
      alert("Erreur lors de l'upload de l'image.");
    } finally {
      setUploadingRole(null);
    }
  }

  async function handleDelete(mediaItem: RealisationMedia) {
    const confirmDelete = window.confirm("Supprimer cette image ?");
    if (!confirmDelete) return;

    try {
      const storagePath = getStoragePathFromUrl(mediaItem.url);

      if (storagePath) {
        await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
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
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Images Avant / Après</h2>
        <p className="mt-2 text-sm leading-6 text-black/50">
          Ajoute une image avant et une image après pour créer l’effet de
          comparaison au survol sur la page des réalisations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ImageSlot
          title="Avant"
          description="Image de l’espace avant l’installation."
          role="before"
          image={beforeImage}
          isUploading={uploadingRole === "before" || isPending}
          uploadingRole={uploadingRole}
          onUpload={handleUpload}
          onDelete={handleDelete}
        />

        <ImageSlot
          title="Après"
          description="Image finale du projet installé. Elle sera utilisée comme image principale."
          role="after"
          image={afterImage}
          isUploading={uploadingRole === "after" || isPending}
          uploadingRole={uploadingRole}
          onUpload={handleUpload}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}