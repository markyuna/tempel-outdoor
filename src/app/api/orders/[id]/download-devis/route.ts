// src/app/api/orders/[id]/download-devis/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Téléchargement devis - utilisateur non connecté:", {
        userError,
      });

      return NextResponse.json(
        { error: "Vous devez être connecté pour télécharger ce devis." },
        { status: 401 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, devis_number, devis_pdf_url")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (orderError) {
      console.error("Téléchargement devis - erreur commande:", orderError);

      return NextResponse.json(
        { error: "Impossible de récupérer cette commande." },
        { status: 500 }
      );
    }

    if (!order) {
      console.error("Téléchargement devis - commande introuvable:", {
        orderId: id,
        userId: user.id,
      });

      return NextResponse.json(
        { error: "Commande introuvable ou accès refusé." },
        { status: 404 }
      );
    }

    if (!order.devis_pdf_url) {
      console.error("Téléchargement devis - aucun PDF lié:", {
        orderId: order.id,
      });

      return NextResponse.json(
        { error: "Aucun devis disponible pour cette commande." },
        { status: 404 }
      );
    }

    const devisPath = order.devis_pdf_url;

    if (devisPath.startsWith("http")) {
      console.error("Téléchargement devis - devis_pdf_url contient une URL au lieu d’un path:", {
        orderId: order.id,
        devisPath,
      });

      return NextResponse.redirect(devisPath, {
        status: 302,
      });
    }

    const fileName = `${order.devis_number || `devis-${order.id}`}.pdf`;

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseAdmin.storage.from("devis").createSignedUrl(devisPath, 120, {
        download: fileName,
      });

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Téléchargement devis - erreur signed URL:", {
        signedUrlError,
        devisPath,
        orderId: order.id,
      });

      return NextResponse.json(
        { error: "Impossible de générer le lien de téléchargement du devis." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(signedUrlData.signedUrl, {
      status: 302,
    });
  } catch (error) {
    console.error("Erreur téléchargement devis:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur serveur lors du téléchargement du devis.",
      },
      { status: 500 }
    );
  }
}