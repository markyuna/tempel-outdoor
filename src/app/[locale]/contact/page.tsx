import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Tempel Outdoor",
  description:
    "Contactez Tempel Outdoor pour un conseil personnalisé sur nos spas, saunas, billards, baby-foot et équipements fitness premium.",
};

const contactCards = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@tempel-outdoor.fr",
    href: "mailto:contact@tempel-outdoor.fr",
  },
  {
    icon: MapPin,
    title: "Zone de livraison",
    value: "France & Europe",
    href: null,
  },
  {
    icon: Clock,
    title: "Réponse",
    value: "Sous 24 à 48h ouvrées",
    href: null,
  },
];

const projectTypes = [
  "Spa extérieur",
  "Sauna bois",
  "Billard convertible",
  "Baby-foot extérieur",
  "Fitness premium",
  "Projet sur mesure",
];

export default function ContactPage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
              Contact
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              Parlons de votre futur espace extérieur
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f5a54]">
              Vous souhaitez installer un spa, un sauna, un billard convertible,
              un baby-foot ou aménager un espace fitness premium ? Notre équipe
              vous accompagne dans le choix de l’équipement le plus adapté à
              votre projet.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {contactCards.map((card) => {
                const Icon = card.icon;

                const content = (
                  <div className="rounded-[1.5rem] border border-[#e6ded1] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <Icon className="h-6 w-6 text-[#b87932]" />
                    <p className="mt-4 text-sm font-semibold">{card.title}</p>
                    <p className="mt-1 text-sm text-[#5f5a54]">{card.value}</p>
                  </div>
                );

                return card.href ? (
                  <a key={card.title} href={card.href}>
                    {content}
                  </a>
                ) : (
                  <div key={card.title}>{content}</div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e6ded1] bg-white p-8 shadow-xl">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#b87932]">
                Demande personnalisée
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                Décrivez votre projet
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#5f5a54]">
                Remplissez ce formulaire et nous reviendrons vers vous avec les
                premières recommandations adaptées à votre espace.
              </p>
            </div>

            <form className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Prénom"
                  name="firstName"
                  placeholder="Votre prénom"
                />

                <FormField
                  label="Nom"
                  name="lastName"
                  placeholder="Votre nom"
                />
              </div>

              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="votre@email.com"
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
                  className="h-12 w-full rounded-full border border-[#ded5c8] bg-[#f7f4ee] px-5 text-sm text-[#181512] outline-none transition focus:border-[#b87932] focus:ring-4 focus:ring-[#b87932]/10"
                  defaultValue=""
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
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Parlez-nous de votre espace, de vos envies et de votre budget approximatif..."
                  className="w-full resize-none rounded-[1.5rem] border border-[#ded5c8] bg-[#f7f4ee] px-5 py-4 text-sm text-[#181512] outline-none transition placeholder:text-[#8a8178] focus:border-[#b87932] focus:ring-4 focus:ring-[#b87932]/10"
                />
              </div>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#181512] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2b241f] hover:shadow-xl"
              >
                Envoyer ma demande
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
              </button>

              <p className="flex items-start gap-2 text-xs leading-6 text-[#6f675f]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#b87932]" />
                Vos informations sont utilisées uniquement pour répondre à votre
                demande. Elles ne sont pas revendues à des tiers.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <InfoCard
            icon={MessageCircle}
            title="Conseil personnalisé"
            description="Nous vous aidons à choisir le produit adapté à votre espace, votre usage et votre budget."
          />

          <InfoCard
            icon={ShieldCheck}
            title="Accompagnement sécurisé"
            description="Chaque demande est étudiée avec attention afin de vous proposer une solution fiable et cohérente."
          />

          <InfoCard
            icon={Phone}
            title="Projet haut de gamme"
            description="Pour les installations complexes, nous pouvons vous orienter vers les solutions les plus adaptées."
          />
        </div>
      </section>

      <section className="bg-[#181512] px-6 py-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#d7b86e]">
              Besoin d’un conseil ?
            </p>

            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
              Découvrez nos univers avant de nous contacter
            </h2>
          </div>

          <Link
            href="/fr"
            className="group inline-flex items-center gap-3 rounded-full bg-[#d7b86e] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Voir les univers
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#181512]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-[#ded5c8] bg-[#f7f4ee] px-5 text-sm text-[#181512] outline-none transition placeholder:text-[#8a8178] focus:border-[#b87932] focus:ring-4 focus:ring-[#b87932]/10"
      />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[2rem] border border-[#e6ded1] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#181512] text-[#d7b86e]">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-4 leading-7 text-[#5f5a54]">{description}</p>
    </article>
  );
}