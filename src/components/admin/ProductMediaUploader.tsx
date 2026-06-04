"use client";

import { ImagePlus, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type Props = {
  productId: string;
};

const BUCKET_NAME = "product-media";

export default function ProductMediaUploader({ productId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        const isVideo = file.type.startsWith("video/");
        const mediaType = isVideo ? "video" : "image";

        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${productId}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          throw new Error(`Erreur upload Storage: ${uploadError.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData.path);

        const { error: dbError } = await supabase.from("product_media").insert({
          product_id: productId,
          url: publicUrl,
          type: mediaType,
          alt: file.name,
          is_featured: false,
          position: 0,
        });

        if (dbError) {
          throw new Error(`Erreur sauvegarde média DB: ${dbError.message}`);
        }
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
    <div className="rounded-3xl border bg-white p-8">
      <h2 className="text-xl font-semibold">Médias du produit</h2>

      <p className="mt-2 text-sm text-gray-500">
        Ajoute une ou plusieurs images ou vidéos pour afficher le produit dans
        la boutique.
      </p>

      <label className="mt-6 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-[#f7f4ee] px-6 py-10 text-center transition hover:bg-white">
        <div className="flex items-center gap-2">
          <ImagePlus className="h-6 w-6" />
          <Video className="h-6 w-6" />
        </div>

        <span className="font-medium">
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
    </div>
  );
}