// src/components/chat/ChatWidget.tsx

"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  UserRound,
  X,
} from "lucide-react";

import { chatSuggestions } from "@/lib/chat/knowledge";
import type { ChatApiResponse, ChatProduct } from "@/app/api/chat/route";

const CATEGORY_LABELS: Record<string, string> = {
  spa: "Spa",
  sauna: "Sauna",
  "baby-foot": "Baby-foot",
  billard: "Billard",
  fitness: "Fitness",
};

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  content: string;
  products?: ChatProduct[];
};

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "bot",
    content:
      "Bonjour 👋 Je suis l'assistant Tempel Outdoor. Posez-moi une question sur nos produits, la livraison, le paiement ou les devis.",
  },
];

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductCard({
  product,
  locale,
}: {
  product: ChatProduct;
  locale: string;
}) {
  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex gap-3 overflow-hidden rounded-2xl border border-[#d7b86e]/25 bg-black/40 p-3 backdrop-blur-md transition hover:border-[#f1d37b]/55 hover:bg-black/55"
    >
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image}
          alt={product.name}
          className="h-[3.75rem] w-[3.75rem] shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-xl bg-[#d7b86e]/10">
          <Bot className="h-5 w-5 text-[#d7b86e]" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#f6df9c]/55">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>
        <p className="truncate text-sm font-semibold text-white">
          {product.name}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-[#f6df9c]">
            {formatPrice(product.price)}
          </p>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-white/40 transition group-hover:text-[#f6df9c]/70">
            Voir
            <ExternalLink className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ChatWidget() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "fr";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const lastUserQuestionRef = useRef("");
  const previousPathnameRef = useRef(pathname);
  const saveTimeoutRef = useRef<number | null>(null);

  const conversationText = useMemo(() => {
    return messages
      .map((message) =>
        message.role === "user"
          ? `Client: ${message.content}`
          : `Assistant: ${message.content}`
      )
      .join("\n");
  }, [messages]);

  useEffect(() => {
    async function loadChatHistory() {
      try {
        const response = await fetch("/api/chat-history", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          setHistoryLoaded(true);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Erreur chargement historique chatbot:", error);
      } finally {
        setHistoryLoaded(true);
      }
    }

    loadChatHistory();
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      setIsOpen(false);
      setShowContactForm(false);
      setContactError(null);
      previousPathnameRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, showContactForm, contactSent, isBotTyping]);

  useEffect(() => {
    if (!historyLoaded) {
      return;
    }

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await fetch("/api/chat-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages }),
        });
      } catch (error) {
        console.error("Erreur sauvegarde historique chatbot:", error);
      }
    }, 700);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [messages, historyLoaded]);

  function openContactFormWithMessage(message: string) {
    setContactForm((current) => ({ ...current, message }));
    setShowContactForm(true);
    setContactSent(false);
  }

  async function handleBotResponse(question: string) {
    setIsBotTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data: ChatApiResponse = await response.json();

      if (data.answer) {
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "bot",
            content: data.answer!,
            products: data.products,
          },
        ]);
      }

      if (data.action === "contact") {
        openContactFormWithMessage(question);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "bot",
          content:
            "Une erreur est survenue. Veuillez réessayer ou contacter un conseiller.",
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  }

  function handleSubmitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanMessage = inputValue.trim();

    if (!cleanMessage || isBotTyping) {
      return;
    }

    lastUserQuestionRef.current = cleanMessage;

    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: "user", content: cleanMessage },
    ]);
    setInputValue("");

    window.setTimeout(() => {
      handleBotResponse(cleanMessage);
    }, 200);
  }

  function handleSuggestionClick(
    value: string,
    action?: "message" | "contact"
  ) {
    lastUserQuestionRef.current = value;

    setMessages((current) => [
      ...current,
      { id: createMessageId(), role: "user", content: value },
    ]);

    if (action === "contact") {
      window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            id: createMessageId(),
            role: "bot",
            content:
              "Bien sûr. Laissez vos coordonnées et un conseiller Tempel Outdoor vous recontactera rapidement.",
          },
        ]);
        openContactFormWithMessage(value);
      }, 200);
      return;
    }

    window.setTimeout(() => {
      handleBotResponse(value);
    }, 200);
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSendingContact(true);
    setContactError(null);

    try {
      const response = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message || lastUserQuestionRef.current,
          source: "chatbot",
          conversation: conversationText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Une erreur est survenue pendant l'envoi de votre demande."
        );
      }

      setContactSent(true);
      setShowContactForm(false);
    } catch (error) {
      setContactError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l'envoi de votre demande."
      );
    } finally {
      setIsSendingContact(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 right-6 z-50 flex items-center gap-3 overflow-hidden rounded-full border border-[#d7b86e]/50 bg-black/75 px-5 py-3 text-sm font-semibold text-[#f6df9c] shadow-[0_18px_50px_rgba(0,0,0,0.35),0_0_30px_rgba(215,184,110,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#f1d37b]/80 hover:bg-black/85 hover:text-[#ffe8a8]"
        aria-label="Ouvrir le chat Tempel Outdoor"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#d7b86e]/20 via-white/5 to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#f1d37b] to-[#b8913f] text-black shadow-[0_0_22px_rgba(215,184,110,0.35)]">
          <MessageCircle className="h-4 w-4" />
        </span>
        <span className="relative hidden sm:inline">Besoin d&apos;aide ?</span>
      </button>

      {isOpen ? (
        <div className="fixed bottom-6 right-6 z-[60] flex h-[620px] max-h-[calc(100vh-120px)] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-[2rem] border border-[#d7b86e]/35 bg-[#080806]/80 text-white shadow-[0_30px_90px_rgba(0,0,0,0.55),0_0_55px_rgba(215,184,110,0.18)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(215,184,110,0.24),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#f4d98a]/80 to-transparent" />

          {/* Header */}
          <div className="relative flex shrink-0 items-center justify-between border-b border-[#d7b86e]/20 bg-black/20 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ffe6a3]/35 bg-gradient-to-br from-[#f4d98a] via-[#d7b86e] to-[#a77d2f] text-black shadow-[0_0_28px_rgba(215,184,110,0.35)]">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Assistant Tempel Outdoor
                </p>
                <p className="text-xs text-[#f6df9c]/70">
                  Conseil spa, sauna & loisirs
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/60 transition hover:border-[#d7b86e]/40 hover:bg-[#d7b86e]/10 hover:text-white"
              aria-label="Fermer le chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-scroll relative flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-2 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-[1.45rem] px-4 py-3 text-sm leading-relaxed shadow-lg ${
                    message.role === "user"
                      ? "border border-[#ffe6a3]/35 bg-gradient-to-br from-[#f4d98a] to-[#c9a04e] text-black shadow-[#d7b86e]/15"
                      : "border border-white/10 bg-white/[0.08] text-white shadow-black/20 backdrop-blur-md"
                  }`}
                >
                  {message.content}
                </div>

                {message.products && message.products.length > 0 ? (
                  <div className="w-full max-w-[92%] space-y-2">
                    {message.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        locale={locale}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {isBotTyping ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-[1.45rem] border border-white/10 bg-white/[0.08] px-4 py-3 shadow-black/20 backdrop-blur-md">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#d7b86e] [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#d7b86e] [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#d7b86e] [animation-delay:300ms]" />
                </div>
              </div>
            ) : null}

            {!showContactForm && !contactSent && !isBotTyping ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {chatSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() =>
                      handleSuggestionClick(suggestion.value, suggestion.action)
                    }
                    className="rounded-2xl border border-[#d7b86e]/20 bg-white/[0.055] px-3 py-2 text-left text-xs font-medium text-white/70 shadow-sm backdrop-blur-md transition hover:border-[#f1d37b]/60 hover:bg-[#d7b86e]/12 hover:text-[#ffe8a8]"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            ) : null}

            {showContactForm ? (
              <form
                onSubmit={handleContactSubmit}
                className="space-y-3 rounded-[1.65rem] border border-[#d7b86e]/35 bg-black/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_45px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    Être recontacté par un conseiller
                  </p>
                  <p className="mt-1 text-xs text-[#f6df9c]/65">
                    Laissez vos coordonnées, nous transmettons votre demande.
                  </p>
                </div>

                <label className="relative block">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f6df9c]/45" />
                  <input
                    value={contactForm.name}
                    onChange={(event) =>
                      setContactForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    required
                    placeholder="Votre nom"
                    className="w-full rounded-2xl border border-[#d7b86e]/15 bg-black/35 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d37b]/70 focus:bg-black/45"
                  />
                </label>

                <label className="relative block">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f6df9c]/45" />
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(event) =>
                      setContactForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                    placeholder="Votre email"
                    className="w-full rounded-2xl border border-[#d7b86e]/15 bg-black/35 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d37b]/70 focus:bg-black/45"
                  />
                </label>

                <label className="relative block">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f6df9c]/45" />
                  <input
                    value={contactForm.phone}
                    onChange={(event) =>
                      setContactForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="Téléphone"
                    className="w-full rounded-2xl border border-[#d7b86e]/15 bg-black/35 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d37b]/70 focus:bg-black/45"
                  />
                </label>

                <textarea
                  value={contactForm.message}
                  onChange={(event) =>
                    setContactForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  required
                  rows={3}
                  placeholder="Votre message"
                  className="w-full resize-none rounded-2xl border border-[#d7b86e]/15 bg-black/35 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#f1d37b]/70 focus:bg-black/45"
                />

                {contactError ? (
                  <p className="rounded-2xl border border-red-300/10 bg-red-500/15 px-3 py-2 text-xs text-red-100">
                    {contactError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSendingContact}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ffe6a3]/35 bg-gradient-to-br from-[#f4d98a] to-[#c9a04e] px-4 py-3 text-sm font-semibold text-black shadow-[0_12px_35px_rgba(215,184,110,0.22)] transition hover:-translate-y-0.5 hover:from-[#ffe6a3] hover:to-[#d7b86e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingContact ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer ma demande
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : null}

            {contactSent ? (
              <div className="flex items-start gap-3 rounded-[1.65rem] border border-emerald-300/25 bg-emerald-400/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Demande envoyée
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Un conseiller Tempel Outdoor reviendra vers vous rapidement.
                  </p>
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmitMessage}
            className="relative shrink-0 border-t border-[#d7b86e]/20 bg-black/25 p-4 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 rounded-full border border-[#d7b86e]/20 bg-white/[0.055] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Posez votre question..."
                disabled={isBotTyping}
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/35 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={isBotTyping || !inputValue.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ffe6a3]/35 bg-gradient-to-br from-[#f4d98a] to-[#c9a04e] text-black shadow-[0_0_22px_rgba(215,184,110,0.25)] transition hover:scale-105 hover:from-[#ffe6a3] hover:to-[#d7b86e] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Envoyer le message"
              >
                {isBotTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>

          <style jsx>{`
            .chatbot-scroll {
              scrollbar-width: thin;
              scrollbar-color: rgba(215, 184, 110, 0.78)
                rgba(255, 255, 255, 0.06);
            }

            .chatbot-scroll::-webkit-scrollbar {
              width: 6px;
            }

            .chatbot-scroll::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.06);
            }

            .chatbot-scroll::-webkit-scrollbar-thumb {
              background: linear-gradient(
                180deg,
                rgba(244, 217, 138, 0.9),
                rgba(184, 145, 63, 0.9)
              );
              border-radius: 999px;
            }
          `}</style>
        </div>
      ) : null}
    </>
  );
}
