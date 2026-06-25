// src/app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";

import { getChatAnswer, shouldOpenContactForm } from "@/lib/chat/knowledge";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type ChatProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  universe: string;
  short_description: string | null;
  image: string | null;
};

export type ChatApiResponse = {
  answer?: string;
  products?: ChatProduct[];
  action?: "contact";
};

const STOPWORDS = new Set([
  "le", "la", "les", "un", "une", "des", "du", "de", "d", "l",
  "je", "tu", "il", "elle", "nous", "vous", "ils", "elles",
  "que", "qui", "quoi", "dont", "ou", "et", "en", "on",
  "me", "te", "se", "ce", "ma", "ta", "sa", "mon", "ton", "son",
  "au", "aux", "par", "pour", "sur", "sous", "dans", "avec",
  "plus", "pas", "ne", "si", "car", "mais", "or", "ni", "donc",
  "quel", "quelle", "quels", "quelles", "votre", "notre", "leur",
  "avez", "avons", "avoir", "etes", "suis", "est", "sont", "ont",
  "chez", "comment", "combien", "quand", "pourquoi", "quoi",
  "ici", "cela", "cette", "ces", "cet", "tout", "tous", "toute",
  "bien", "tres", "peu", "beaucoup", "aussi", "non", "oui",
  "meme", "comme", "alors", "donc", "apres", "avant", "tres",
  "voici", "voila", "merci", "bonjour", "bonsoir", "svp", "sil",
  "vous", "pouvez", "voulez", "souhait", "aimerait", "voudrait",
  "aimeriez", "souhaite", "cherche", "cherchez", "avoir", "avez",
]);

function stemWord(word: string): string {
  if (word.length > 4 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

function extractKeywords(question: string): string[] {
  return question
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word))
    .map(stemWord)
    .slice(0, 4);
}

export async function POST(request: NextRequest) {
  let question: string;

  try {
    const body = await request.json();
    question = String(body.question ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!question) {
    return NextResponse.json({ error: "Empty question" }, { status: 400 });
  }

  // 1. Knowledge base — fast, no DB call
  const kbAnswer = getChatAnswer(question);
  const mustContact = shouldOpenContactForm(question);

  if (kbAnswer) {
    return NextResponse.json<ChatApiResponse>({
      answer: kbAnswer,
      action: mustContact ? "contact" : undefined,
    });
  }

  if (mustContact) {
    return NextResponse.json<ChatApiResponse>({
      answer:
        "Bien sûr. Laissez vos coordonnées et un conseiller Tempel Outdoor vous recontactera rapidement.",
      action: "contact",
    });
  }

  // 2. Product search via accent-insensitive RPC
  const keywords = extractKeywords(question);

  if (keywords.length > 0) {
    const { data: rows, error } = await supabaseAdmin.rpc(
      "search_products_unaccent",
      {
        search_keywords: keywords,
        max_results: 3,
      }
    );

    if (!error && rows && rows.length > 0) {
      const results: ChatProduct[] = rows.map(
        (r: {
          id: string;
          name: string;
          slug: string;
          price: number;
          category: string;
          universe: string;
          short_description: string | null;
          image_url: string | null;
        }) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          price: r.price,
          category: r.category,
          universe: r.universe,
          short_description: r.short_description,
          image: r.image_url,
        })
      );

      return NextResponse.json<ChatApiResponse>({
        answer:
          results.length === 1
            ? "Voici un modèle qui pourrait correspondre à votre recherche :"
            : "Voici quelques modèles qui pourraient vous intéresser :",
        products: results,
      });
    }
  }

  // 3. Fallback → contact form
  return NextResponse.json<ChatApiResponse>({
    answer:
      "Je n'ai pas toutes les informations pour répondre précisément à cette question. Laissez vos coordonnées et un conseiller Tempel Outdoor vous recontactera rapidement.",
    action: "contact",
  });
}
