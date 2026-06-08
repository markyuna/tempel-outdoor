// src/app/api/orders/[id]/generate-devis/route.ts

import { NextResponse } from "next/server";

import { generateDevisNumber } from "@/lib/devis/generateDevisNumber";
import { generateDevisPdf } from "@/lib/devis/generateDevisPdf";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: Props) {
  try {
    const { id } = await params;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      console.error("Commande introuvable:", orderError);

      return NextResponse.json(
        { error: "Commande introuvable." },
        { status: 404 }
      );
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("product_name, quantity, unit_price, total_price")
      .eq("order_id", id)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Erreur order_items:", itemsError);

      return NextResponse.json(
        { error: "Impossible de charger les produits." },
        { status: 500 }
      );
    }

    const devisNumber = order.devis_number || generateDevisNumber(order.id);

    const pdfBytes = await generateDevisPdf({
      order,
      items: items ?? [],
      devisNumber,
    });

    const pdfBuffer = Buffer.from(pdfBytes);
    const filePath = `${new Date().getFullYear()}/${order.id}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("devis")
      .upload(filePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Erreur upload devis:", uploadError);

      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage.from("devis").createSignedUrl(filePath, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Erreur signed url:", signedUrlError);

      return NextResponse.json(
        { error: "Impossible de créer le lien du devis." },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        devis_number: devisNumber,
        devis_pdf_url: filePath,
        devis_generated_at: new Date().toISOString(),
        status: "quoted",
      })
      .eq("id", id);

    if (updateError) {
      console.error("Erreur update order:", updateError);

      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      devisNumber,
      devisPath: filePath,
      signedUrl: signedUrlData.signedUrl,
    });
  } catch (error) {
    console.error("Erreur génération devis:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue génération devis.",
      },
      { status: 500 }
    );
  }
}