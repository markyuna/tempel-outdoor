// src/components/admin/ProductMediaUploader.tsx

"use client";

import Image from "next/image";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Star, Trash2, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

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
  reorderMediaAction: (mediaIds: string[]) => Promise<void>;
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

function SortableMediaCard({
  item,
  index,
  setCoverAction,
  deleteMediaAction,
}: {
  item: ProductMedia;
  index: number;
  setCoverAction: (formData: FormData) => Promise<void>;
  deleteMediaAction: (formData: FormData) => Promise<void>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`group overflow-hidden rounded-2xl border border-black/10 bg-[#f7f4ee] transition ${
        isDragging ? "z-20 scale-[1.02] shadow-xl" : "shadow-sm"
      }`}
    >
      <div className="relative aspect-[4/3] bg-white">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 cursor-grab items-center justify-center rounded-full bg-white/95 text-black shadow-sm transition hover:bg-black hover:text-white active:cursor-grabbing"
          aria-label="Déplacer le média"
          title="Déplacer"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {item.type === "image" ? (
          <Image
            src={item.url}
            alt={item.alt || "Média produit Tempel Outdoor"}
            fill
            sizes="180px"
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
          <div className="absolute left-2 top-2 rounded-full bg-black px-3 py-1 text-[10px] font-semibold text-white">
            Cover
          </div>
        )}
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2 text-[10px] text-gray-500">
          <span>Position {index}</span>
          <span className="uppercase">{item.type}</span>
        </div>

        {item.alt && (
          <p className="line-clamp-2 min-h-8 text-[11px] leading-4 text-black/50">
            Alt SEO : {item.alt}
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <form action={setCoverAction}>
            <input type="hidden" name="mediaId" value={item.id} />

            <button
              type="submit"
              disabled={Boolean(item.is_featured)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-40 ${
                item.is_featured
                  ? "border-black bg-black text-[#d7b86e]"
                  : "border-black/10 bg-white text-black hover:bg-black hover:text-[#d7b86e]"
              }`}
              title="Définir comme cover"
              aria-label="Définir comme cover"
            >
              <Star
                className={`h-4 w-4 ${
                  item.is_featured ? "fill-current" : ""
                }`}
              />
            </button>
          </form>

          <form
            action={deleteMediaAction}
            onSubmit={(event) => {
              if (
                !window.confirm("Supprimer définitivement ce média du produit ?")
              ) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="mediaId" value={item.id} />
            <input type="hidden" name="mediaUrl" value={item.url} />

            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
              title="Supprimer"
              aria-label="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProductMediaUploader({
  productId,
  productName,
  productCategory,
  media = [],
  compact = false,
  setCoverAction,
  reorderMediaAction,
  deleteMediaAction,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [uploading, setUploading] = useState(false);
  const [orderedIds, setOrderedIds] = useState<string[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedMedia = useMemo(() => {
    return [...media].sort(
      (a, b) => (a.position ?? 9999) - (b.position ?? 9999)
    );
  }, [media]);

  const items = useMemo(() => {
    if (!orderedIds) return sortedMedia;

    const mediaById = new Map(sortedMedia.map((item) => [item.id, item]));

    const orderedItems = orderedIds
      .map((id) => mediaById.get(id))
      .filter(Boolean) as ProductMedia[];

    const newItems = sortedMedia.filter((item) => !orderedIds.includes(item.id));

    return [...orderedItems, ...newItems];
  }, [orderedIds, sortedMedia]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

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

        const uniqueId = crypto.randomUUID();

        const fileName =
          `${seoBaseName}-${seoIndex}-${uniqueId}.${fileExt}`;
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
      setOrderedIds(null);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur upload média.");
    } finally {
      setUploading(false);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    const reorderedIds = reorderedItems.map((item) => item.id);

    setOrderedIds(reorderedIds);

    startTransition(async () => {
      try {
        await reorderMediaAction(reorderedIds);
        router.refresh();
      } catch (error) {
        setOrderedIds(null);
        alert(
          error instanceof Error
            ? error.message
            : "Erreur réorganisation médias."
        );
      }
    });
  }

  return (
    <div className={compact ? "" : "rounded-3xl border bg-white p-6"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Aperçu médias</h2>

          <p className="mt-2 text-sm leading-6 text-[#5f5a54]">
            Ajoute, organise par glisser-déposer, supprime les médias et définis
            l’image cover.
          </p>
        </div>

        {isPending && (
          <span className="shrink-0 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
            Sauvegarde...
          </span>
        )}
      </div>

      <label className="mt-6 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-[#f7f4ee] px-4 py-6 text-center transition hover:bg-white">
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

      {items.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3">
              {items.map((item, index) => (
                <SortableMediaCard
                  key={item.id}
                  item={item}
                  index={index}
                  setCoverAction={setCoverAction}
                  deleteMediaAction={deleteMediaAction}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}