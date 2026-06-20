// src/app/api/contact-request/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

type ContactRequestBody = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: string;
  conversation?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactRequestBody;

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const phone = body.phone?.trim() ?? "";
    const message = body.message?.trim() ?? "";
    const source = body.source?.trim() || "chatbot";
    const conversation = body.conversation?.trim() ?? "";

    if (!name) {
      return NextResponse.json(
        { error: "Le nom est obligatoire." },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Une adresse email valide est obligatoire." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Le message est obligatoire." },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      phone: phone || null,
      message,
      source,
      conversation: conversation || null,
      status: "new",
    };

    const { data, error } = await supabaseAdmin
      .from("contact_requests")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error("Erreur Supabase contact_requests:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        payload,
      });

      return NextResponse.json(
        {
          error:
            "Impossible d’envoyer votre demande pour le moment. Veuillez réessayer.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error("Erreur API contact-request:", error);

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue pendant l’envoi de votre demande. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}