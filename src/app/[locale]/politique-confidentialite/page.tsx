import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Tempel Outdoor",
  description:
    "Politique de confidentialité de Tempel Outdoor : collecte, utilisation et protection des données personnelles conformément au RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      {/* Header */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7b86e]">
            Protection des données
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Politique de confidentialité
          </h1>
          <p className="mt-5 text-sm text-white/50">
            Dernière mise à jour : juin 2026
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white divide-y divide-black/8">
          {/* Responsable du traitement */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7b86e]">
              Responsable du traitement
            </h2>
            <div className="mt-4 space-y-1 text-sm leading-7 text-neutral-600">
              <p><strong className="font-semibold text-neutral-900">RB Végétal</strong> — Marque exploitant Tempel Outdoor</p>
              <p>16 Rue Georges Duhamel, 95300 Hérouville-en-Vexin – France</p>
              <p>SIRET : 49933190800032 · RCS Pontoise B 499 331 908</p>
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

          {/* 1. Introduction */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              1. Introduction
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Tempel Outdoor accorde une importance particulière à la protection des données
              personnelles de ses utilisateurs. La présente politique décrit la manière dont les
              données sont collectées, utilisées, conservées et protégées conformément au Règlement
              Général sur la Protection des Données (RGPD – Règlement UE 2016/679) et à la loi
              Informatique et Libertés modifiée.
            </p>
          </div>

          {/* 2. Données collectées */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              2. Données collectées
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Nous pouvons collecter les catégories de données suivantes : nom et prénom, adresse
              postale, adresse e-mail, numéro de téléphone, informations de commande et historique
              d&apos;achat, données de navigation (adresse IP, pages visitées, durée de session)
              et informations techniques liées à l&apos;utilisation du site.
            </p>
          </div>

          {/* 3. Finalités */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              3. Finalités du traitement
            </h2>
            <div className="mt-4 text-sm leading-7 text-neutral-600">
              <p className="mb-2">Les données collectées sont utilisées pour :</p>
              <ul className="space-y-1 pl-4">
                {[
                  "Gérer les comptes clients, commandes et devis",
                  "Organiser la livraison et assurer le suivi des commandes",
                  "Fournir un service client de qualité",
                  "Répondre aux demandes de contact et de renseignements",
                  "Améliorer le fonctionnement et les performances du site",
                  "Satisfaire aux obligations légales et comptables",
                  "Envoyer des communications commerciales (avec consentement)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#d7b86e]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Base légale */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              4. Base légale du traitement
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Le traitement des données repose sur : l&apos;exécution du contrat de vente
              (traitement des commandes), le respect des obligations légales (comptabilité,
              fiscalité), l&apos;intérêt légitime de Tempel Outdoor (amélioration du site,
              prévention de la fraude) et, lorsque nécessaire, le consentement explicite de
              l&apos;utilisateur (communications commerciales).
            </p>
          </div>

          {/* 5. Destinataires */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              5. Destinataires des données
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Les données sont accessibles uniquement aux personnes habilitées de Tempel Outdoor
              ainsi qu&apos;aux prestataires nécessaires à l&apos;exécution des services :
              transporteurs, hébergeur (Vercel Inc.), prestataires d&apos;envoi d&apos;e-mails
              (Resend Inc.), et outils d&apos;analyse. Ces prestataires agissent en qualité de
              sous-traitants et sont tenus au respect de la confidentialité des données.
            </p>
          </div>

          {/* 6. Durée de conservation */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              6. Durée de conservation
            </h2>
            <div className="mt-4 text-sm leading-7 text-neutral-600">
              <p className="mb-2">Les données sont conservées selon les durées suivantes :</p>
              <ul className="space-y-1 pl-4">
                {[
                  "Données client et historique de commandes : 3 ans à compter du dernier achat",
                  "Données de facturation et comptables : 10 ans (obligation légale)",
                  "Données de navigation : 13 mois maximum",
                  "Données de prospection commerciale : 3 ans à compter de la collecte ou du dernier contact",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#d7b86e]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 7. Sécurité */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              7. Sécurité des données
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Tempel Outdoor met en œuvre des mesures techniques et organisationnelles appropriées
              pour protéger les données personnelles contre tout accès non autorisé, perte,
              altération, divulgation ou destruction. Les communications entre le navigateur et le
              serveur sont chiffrées via le protocole HTTPS.
            </p>
          </div>

          {/* 8. Cookies */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              8. Cookies
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
              <p>
                Le site utilise des cookies et technologies similaires pour assurer son
                fonctionnement (cookies de session, panier) et mesurer l&apos;audience.
              </p>
              <p>
                L&apos;utilisateur peut configurer son navigateur pour refuser ou supprimer
                les cookies à tout moment. Certaines fonctionnalités du site peuvent être
                affectées en cas de désactivation des cookies essentiels.
              </p>
              <p>
                Pour en savoir plus sur la gestion des cookies, consultez le site de la CNIL :
                {" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-black"
                >
                  cnil.fr
                </a>
              </p>
            </div>
          </div>

          {/* 9. Droits des utilisateurs */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              9. Droits des utilisateurs
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
              <p>
                Conformément au RGPD, chaque utilisateur dispose des droits suivants sur ses
                données personnelles : droit d&apos;accès, de rectification, d&apos;effacement,
                de limitation du traitement, d&apos;opposition, de portabilité et de retrait du
                consentement à tout moment.
              </p>
              <p>
                Pour exercer ces droits, adressez votre demande par e-mail à :{" "}
                <a
                  href="mailto:contact@tempel-outdoor.fr"
                  className="font-medium text-neutral-900 underline underline-offset-2 hover:text-black"
                >
                  contact@tempel-outdoor.fr
                </a>{" "}
                en précisant votre identité.
              </p>
              <p>
                En cas de litige, vous pouvez adresser une réclamation à la{" "}
                <strong className="text-neutral-900">CNIL</strong> (Commission Nationale de
                l&apos;Informatique et des Libertés) — 3 Place de Fontenoy, TSA 80715,
                75334 Paris Cedex 07 —{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-black"
                >
                  cnil.fr
                </a>
              </p>
            </div>
          </div>

          {/* 10. Modifications */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              10. Modifications
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Tempel Outdoor se réserve le droit de modifier la présente politique de
              confidentialité à tout moment pour l&apos;adapter aux évolutions légales,
              réglementaires ou techniques. La version en vigueur est celle publiée sur le site,
              avec sa date de dernière mise à jour.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
