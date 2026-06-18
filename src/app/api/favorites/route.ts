// src/app/api/favorites/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type FavoriteRequestBody = {
  productId?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour ajouter un favori." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as FavoriteRequestBody;

    if (!body.productId) {
      return NextResponse.json(
        { error: "Produit manquant." },
        { status: 400 }
      );
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("id", body.productId)
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 }
      );
    }

    const { error } = await supabaseAdmin.from("favorites").upsert(
      {
        user_id: user.id,
        product_id: body.productId,
      },
      {
        onConflict: "user_id,product_id",
      }
    );

    if (error) {
      console.error("Erreur ajout favori:", error);

      return NextResponse.json(
        { error: "Impossible d'ajouter ce produit aux favoris." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isFavorite: true,
    });
  } catch (error) {
    console.error("Erreur API favoris POST:", error);

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour retirer un favori." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as FavoriteRequestBody;

    if (!body.productId) {
      return NextResponse.json(
        { error: "Produit manquant." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", body.productId);

    if (error) {
      console.error("Erreur suppression favori:", error);

      return NextResponse.json(
        { error: "Impossible de retirer ce produit des favoris." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isFavorite: false,
    });
  } catch (error) {
    console.error("Erreur API favoris DELETE:", error);

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}