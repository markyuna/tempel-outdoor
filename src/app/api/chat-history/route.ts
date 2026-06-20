// src/app/api/chat-history/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  content: string;
};

type SaveChatHistoryBody = {
  messages?: ChatMessage[];
};

async function getCurrentUserId() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({
        messages: null,
      });
    }

    const { data, error } = await supabaseAdmin
      .from("chatbot_conversations")
      .select("messages")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erreur lecture historique chatbot:", error);

      return NextResponse.json(
        {
          error: "Impossible de récupérer l’historique du chatbot.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      messages: data?.messages ?? null,
    });
  } catch (error) {
    console.error("Erreur API chat-history GET:", error);

    return NextResponse.json(
      {
        error: "Une erreur est survenue.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({
        success: true,
        saved: false,
      });
    }

    const body = (await request.json()) as SaveChatHistoryBody;
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const sanitizedMessages = messages
      .filter(
        (message) =>
          typeof message.id === "string" &&
          (message.role === "bot" || message.role === "user") &&
          typeof message.content === "string"
      )
      .slice(-50);

    const { error } = await supabaseAdmin
      .from("chatbot_conversations")
      .upsert(
        {
          user_id: userId,
          messages: sanitizedMessages,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      console.error("Erreur sauvegarde historique chatbot:", error);

      return NextResponse.json(
        {
          error: "Impossible de sauvegarder l’historique du chatbot.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      saved: true,
    });
  } catch (error) {
    console.error("Erreur API chat-history POST:", error);

    return NextResponse.json(
      {
        error: "Une erreur est survenue.",
      },
      { status: 500 }
    );
  }
}