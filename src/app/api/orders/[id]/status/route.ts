// src/app/api/orders/[id]/status/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ALLOWED_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "paid",
  "delivered",
  "cancelled",
];

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;
  const body = await request.json();

  const status = body?.status;

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Statut invalide." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      status,
    })
    .eq("id", id);

  if (error) {
    console.error("Erreur mise à jour statut commande:", error);

    return NextResponse.json(
      { error: "Impossible de mettre à jour le statut." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    status,
  });
}