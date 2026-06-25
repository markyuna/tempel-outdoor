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
  // Basic French/English plural: strip trailing 's' for words longer than 4 chars
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

function getImage(
  media:
    | { url: string; is_featured: boolean | null; type: string }[]
    | null
): string | null {
  if (!media || media.length === 0) return null;
  return (
    media.find((m) => m.type === "image" && m.is_featured)?.url ??
    media.find((m) => m.type === "image")?.url ??
    null
  );
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

  // 2. Product search
  const keywords = extractKeywords(question);

  if (keywords.length > 0) {
    const orConditions = keywords
      .flatMap((kw) => [
        `name.ilike.%${kw}%`,
        `short_description.ilike.%${kw}%`,
        `category.ilike.%${kw}%`,
      ])
      .join(",");

    const { data: products } = await supabaseAdmin
      .from("products")
      .select(
        "id, name, slug, price, category, universe, short_description, product_media(url, is_featured, type)"
      )
      .eq("status", "active")
      .or(orConditions)
      .limit(3);

    if (products && products.length > 0) {
      const results: ChatProduct[] = products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        category: p.category,
        universe: p.universe,
        short_description: p.short_description,
        image: getImage(
          Array.isArray(p.product_media) ? p.product_media : null
        ),
      }));

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
