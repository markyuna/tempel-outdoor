"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

const projectTypes = [
  "Spa extérieur",
  "Sauna bois",
  "Billard convertible",
  "Baby-foot extérieur",
  "Fitness premium",
  "Projet sur mesure",
];

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#181512]"
      >
        {label}
        {required ? <span className="ml-1 text-[#b87932]">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-full border border-[#ded5c8] bg-[#f7f4ee] px-5 text-sm text-[#181512] outline-none transition placeholder:text-[#8a8178] focus:border-[#b87932] focus:ring-4 focus:ring-[#b87932]/10"
      />
    </div>
  );
}

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const name = [firstName, lastName].filter(Boolean).join(" ");

    try {
      const response = await fetch("/api/contact-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: data.get("email"),
          phone: data.get("phone"),
          message: [
            data.get("projectType")
              ? `Projet : ${data.get("projectType")}`
              : null,
            data.get("message"),
          ]
            .filter(Boolean)
            .join("\n\n"),
          source: "contact-page",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ?? "Une erreur est survenue. Veuillez réessayer."
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsPending(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-[#181512]">
            Demande envoyée !
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[#5f5a54]">
            Merci pour votre message. Un conseiller Tempel Outdoor vous
            recontactera sous 24 à 48h ouvrées.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Prénom"
          name="firstName"
          placeholder="Votre prénom"
          required
        />
        <FormField
          label="Nom"
          name="lastName"
          placeholder="Votre nom"
          required
        />
      </div>

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="votre@email.com"
        required
      />

      <FormField
        label="Téléphone"
        name="phone"
        type="tel"
        placeholder="+33 ..."
      />

      <div>
        <label
          htmlFor="projectType"
          className="mb-2 block text-sm font-medium text-[#181512]"
        >
          Type de projet
        </label>
        <select
          id="projectType"
          name="projectType"
          defaultValue=""
          className="h-12 w-full rounded-full border border-[#ded5c8] bg-[#f7f4ee] px-5 text-sm text-[#181512] outline-none transition focus:border-[#b87932] focus:ring-4 focus:ring-[#b87932]/10"
        >
          <option value="" disabled>
            Sélectionnez un univers
          </option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-[#181512]"
        >
          Message <span className="text-[#b87932]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Parlez-nous de votre espace, de vos envies et de votre budget approximatif..."
          className="w-full resize-none rounded-[1.5rem] border border-[#ded5c8] bg-[#f7f4ee] px-5 py-4 text-sm text-[#181512] outline-none transition placeholder:text-[#8a8178] focus:border-[#b87932] focus:ring-4 focus:ring-[#b87932]/10"
        />
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#181512] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2b241f] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            Envoyer ma demande
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="flex items-start gap-2 text-xs leading-6 text-[#6f675f]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#b87932]" />
        Vos informations sont utilisées uniquement pour répondre à votre
        demande. Elles ne sont pas revendues à des tiers.
      </p>
    </form>
  );
}
