import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | Tempel Outdoor",
  description:
    "Mentions légales du site Tempel Outdoor : propriétaire, immatriculation, hébergement, propriété intellectuelle et droit applicable.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      {/* Header */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7b86e]">
            Informations légales
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Mentions légales
          </h1>
          <p className="mt-5 text-sm text-white/50">
            Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance
            dans l&apos;économie numérique (LCEN)
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white divide-y divide-black/8">
          {/* Éditeur du site */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7b86e]">
              Éditeur du site
            </h2>
            <div className="mt-4 space-y-1 text-sm leading-7 text-neutral-600">
              <p><strong className="font-semibold text-neutral-900">TEMPEL OUTDOOR</strong></p>
              <p>Marque exploitée par RB Végétal</p>
              <p>16 Rue Georges Duhamel</p>
              <p>95300 Hérouville-en-Vexin – France</p>
              <p>
                Site web :{" "}
                <a
                  href="https://www.tempel-outdoor.fr"
                  className="underline underline-offset-2 hover:text-black"
                >
                  https://www.tempel-outdoor.fr
                </a>
              </p>
              <p>
                Contact :{" "}
                <a
                  href="mailto:contact@tempel-outdoor.fr"
                  className="underline underline-offset-2 hover:text-black"
                >
                  contact@tempel-outdoor.fr
                </a>
              </p>
            </div>
          </div>

          {/* Directeur de publication */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Directeur de publication
            </h2>
            <div className="mt-4 text-sm leading-7 text-neutral-600">
              <p>Le directeur de publication du site <strong className="text-neutral-900">www.tempel-outdoor.fr</strong> est le représentant légal de RB Végétal.</p>
            </div>
          </div>

          {/* Immatriculation */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Immatriculation
            </h2>
            <div className="mt-4 grid gap-2 text-sm leading-7 text-neutral-600 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">SIRET</p>
                <p className="text-neutral-900">49933190800032</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">TVA intracommunautaire</p>
                <p className="text-neutral-900">FR01499331908</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">RCS</p>
                <p className="text-neutral-900">Pontoise B 499 331 908</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Capital social</p>
                <p className="text-neutral-900">12 000 €</p>
              </div>
            </div>
          </div>

          {/* Création du site */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Conception et développement
            </h2>
            <div className="mt-4 text-sm leading-7 text-neutral-600">
              <p>
                Le site internet Tempel Outdoor a été conçu et développé par{" "}
                <strong className="text-neutral-900">Marcos Suarez</strong>,
                développeur web indépendant. Conception UX/UI, développement,
                intégration et mise en ligne réalisés par Marcos Suarez.
              </p>
            </div>
          </div>

          {/* Hébergement */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Hébergement
            </h2>
            <div className="mt-4 text-sm leading-7 text-neutral-600">
              <p><strong className="text-neutral-900">Vercel Inc.</strong></p>
              <p>340 S Lemon Ave #4133, Walnut, CA 91789 – États-Unis</p>
              <p>
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-black"
                >
                  vercel.com
                </a>
              </p>
            </div>
          </div>

          {/* Propriété intellectuelle */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Propriété intellectuelle
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
              <p>
                Tous les éléments présents sur ce site — textes, images, graphismes, logos,
                vidéos, illustrations, documents et contenus numériques — sont protégés par
                les lois françaises et internationales relatives à la propriété intellectuelle
                et sont la propriété exclusive de Tempel Outdoor / RB Végétal.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation ou
                exploitation de tout ou partie de ces éléments, sans autorisation écrite
                préalable, est strictement interdite et constituerait une contrefaçon
                sanctionnée par les articles L.335-2 et suivants du Code de la propriété
                intellectuelle.
              </p>
            </div>
          </div>

          {/* Liens hypertextes */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Liens hypertextes
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Tempel Outdoor ne saurait être tenu responsable du contenu, de la disponibilité
              ou du fonctionnement des sites accessibles via des liens externes présents sur ce
              site. L&apos;utilisateur est invité à faire preuve de vigilance lors de la
              consultation de ces ressources.
            </p>
          </div>

          {/* Droit applicable */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Droit applicable
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Le présent site ainsi que son contenu sont soumis au droit français. Tout litige
              relatif à l&apos;utilisation du site{" "}
              <strong className="text-neutral-900">www.tempel-outdoor.fr</strong> sera soumis
              à la compétence des juridictions françaises compétentes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
