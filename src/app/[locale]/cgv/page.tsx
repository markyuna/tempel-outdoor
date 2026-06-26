import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions générales de vente | Tempel Outdoor",
  description:
    "Conditions générales de vente de Tempel Outdoor : commande, paiement, livraison, droit de rétractation, garanties et médiation.",
};

export default function CgvPage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      {/* Header */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7b86e]">
            Conditions de vente
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Conditions générales de vente
          </h1>
          <p className="mt-5 text-sm text-white/50">
            Dernière mise à jour : juin 2026
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white divide-y divide-black/8">
          {/* Identification du vendeur */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d7b86e]">
              Identification du vendeur
            </h2>
            <div className="mt-4 space-y-1 text-sm leading-7 text-neutral-600">
              <p><strong className="font-semibold text-neutral-900">TEMPEL OUTDOOR</strong> — Marque exploitée par RB Végétal</p>
              <p>16 Rue Georges Duhamel, 95300 Hérouville-en-Vexin – France</p>
              <p>SIRET : 49933190800032 · TVA intracommunautaire : FR01499331908</p>
              <p>RCS Pontoise B 499 331 908</p>
              <p>Contact : <a href="mailto:contact@tempel-outdoor.fr" className="underline underline-offset-2 hover:text-black">contact@tempel-outdoor.fr</a></p>
            </div>
          </div>

          {/* Article 1 */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 1 — Objet
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Les présentes Conditions Générales de Vente (CGV) encadrent les ventes de produits
              réalisées sur le site Tempel Outdoor. Elles définissent les droits et obligations de
              TEMPEL OUTDOOR, marque exploitée par RB Végétal, et de ses clients dans le cadre
              de l&apos;achat de produits proposés sur la plateforme. Toute commande implique
              l&apos;acceptation pleine et entière des présentes CGV.
            </p>
          </div>

          {/* Article 2 */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 2 — Produits
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Tempel Outdoor propose des spas extérieurs, saunas, baby-foot, billards, équipements
              de loisirs et équipements fitness premium. Les photographies, descriptions,
              caractéristiques et informations présentes sur les fiches produits sont fournies avec
              le plus grand soin, sans toutefois constituer un engagement contractuel absolu. Toute
              erreur ou omission manifeste est exclue de la responsabilité du vendeur.
            </p>
          </div>

          {/* Article 3 */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 3 — Prix
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Les prix sont indiqués en euros toutes taxes comprises (TTC), au taux de TVA applicable
              au jour de la commande. Le prix applicable est celui affiché sur le site au moment de
              la validation de la commande. Tempel Outdoor se réserve le droit de modifier ses prix
              à tout moment, sans effet sur les commandes déjà confirmées.
            </p>
          </div>

          {/* Article 4 */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 4 — Commande
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Le client sélectionne les produits de son choix, vérifie le contenu de son panier et
              soumet une demande de commande. Tempel Outdoor adresse ensuite un devis personnalisé
              par e-mail. La commande devient ferme après acceptation du devis par le client et
              réception du paiement confirmé. Tempel Outdoor se réserve le droit de refuser toute
              commande pour motif légitime.
            </p>
          </div>

          {/* Article 5 — Paiement */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 5 — Paiement
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Le paiement s&apos;effectue par virement bancaire, selon les coordonnées communiquées
              dans le devis. Aucun paiement en ligne par carte bancaire n&apos;est proposé à ce jour.
              La commande est considérée comme définitive à réception du virement sur le compte de
              RB Végétal. Le client garantit qu&apos;il dispose des fonds nécessaires à la réalisation
              du paiement.
            </p>
          </div>

          {/* Article 6 — Livraison */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 6 — Livraison
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              La livraison s&apos;effectue à l&apos;adresse fournie par le client lors de la commande.
              Les délais de livraison sont communiqués lors de la confirmation du devis et peuvent
              varier selon les produits, notamment pour les articles volumineux ou fabriqués sur
              commande. Pour les spas, saunas, billards et autres produits encombrants, la livraison
              est assurée par un transporteur spécialisé. Les frais de livraison sont précisés dans
              le devis.
            </p>
          </div>

          {/* Article 7 — Réception */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 7 — Réception et dommages transport
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Le client doit vérifier l&apos;état des produits dès leur réception. En cas d&apos;anomalie,
              de dommage apparent ou de colis détérioré, il est impératif d&apos;émettre des réserves
              précises et circonstanciées auprès du transporteur et de contacter Tempel Outdoor dans
              les 48 heures avec des photos permettant d&apos;évaluer la nature et l&apos;étendue du
              dommage.
            </p>
          </div>

          {/* Article 8 — Droit de rétractation */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 8 — Droit de rétractation
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
              <p>
                Conformément à l&apos;article L.221-18 du Code de la consommation, le client
                consommateur dispose d&apos;un délai de <strong className="text-neutral-900">14 jours</strong> à compter de la réception
                du produit pour exercer son droit de rétractation, sans avoir à justifier de motifs
                ni à payer de pénalités.
              </p>
              <p>
                Pour exercer ce droit, le client doit notifier sa décision de rétractation par tout
                moyen exprimant sans ambiguïté sa volonté à :{" "}
                <a href="mailto:contact@tempel-outdoor.fr" className="underline underline-offset-2 hover:text-black">
                  contact@tempel-outdoor.fr
                </a>
              </p>
              <p>
                En cas de rétractation, le client retourne le produit dans son état d&apos;origine
                à ses frais. Le remboursement intervient dans un délai de 14 jours suivant la
                récupération du produit et la vérification de son état.
              </p>
              <p>
                <strong className="text-neutral-900">Exception :</strong> Conformément à
                l&apos;article L.221-28 3° du Code de la consommation, le droit de rétractation ne
                s&apos;applique pas aux produits fabriqués selon les spécifications du client ou
                nettement personnalisés (configuration sur mesure, dimensions spécifiques, etc.).
                Cette exclusion est expressément mentionnée dans le devis le cas échéant.
              </p>
            </div>
          </div>

          {/* Article 9 — Retours */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 9 — Retours et échanges
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              En dehors du droit de rétractation légal, les retours sont soumis aux conditions
              applicables selon la nature du produit commandé. Certains articles volumineux ou
              fabriqués sur commande peuvent ne pas être retournables. En cas de produit défectueux
              ou de dommage avéré, Tempel Outdoor peut organiser l&apos;envoi de pièces de
              remplacement ou d&apos;un produit de substitution.
            </p>
          </div>

          {/* Article 10 — Garanties légales */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 10 — Garanties légales
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
              <p>
                Tous les produits bénéficient de la garantie légale de conformité (articles L.217-4
                à L.217-14 du Code de la consommation) et de la garantie contre les vices cachés
                (articles 1641 à 1649 du Code civil).
              </p>
              <p>
                La garantie légale de conformité s&apos;applique pendant 2 ans à compter de la
                délivrance du produit. En cas de défaut de conformité, le client peut choisir entre
                la réparation ou le remplacement du bien.
              </p>
              <p>
                Des garanties commerciales spécifiques aux produits peuvent s&apos;ajouter aux
                garanties légales et sont précisées sur les fiches produits.
              </p>
            </div>
          </div>

          {/* Article 11 — Responsabilité */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 11 — Responsabilité
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Tempel Outdoor met tout en œuvre pour fournir des informations fiables et assurer le
              bon fonctionnement du site. Sa responsabilité ne saurait être engagée en cas
              d&apos;utilisation inappropriée des produits, de mauvaise installation, de force
              majeure, d&apos;indisponibilité temporaire du site ou de dommages indirects.
            </p>
          </div>

          {/* Article 12 — Données personnelles */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 12 — Données personnelles
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Les données personnelles collectées dans le cadre de la commande sont utilisées
              exclusivement pour la gestion des commandes, paiements, livraisons et relations avec
              le service client. Le client dispose de droits d&apos;accès, de rectification,
              d&apos;opposition et de suppression conformément au RGPD. Pour en savoir plus,
              consultez notre{" "}
              <Link href="/fr/politique-confidentialite" className="underline underline-offset-2 hover:text-black">
                Politique de confidentialité
              </Link>.
            </p>
          </div>

          {/* Article 13 — Médiation */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 13 — Médiation de la consommation
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
              <p>
                Conformément aux articles L.611-1 et L.616-1 du Code de la consommation, en cas
                de litige non résolu à l&apos;amiable, le client consommateur peut recourir
                gratuitement à un service de médiation de la consommation.
              </p>
              <p>
                Avant de saisir le médiateur, le client doit avoir préalablement contacté Tempel
                Outdoor par écrit afin de tenter de résoudre le litige directement.
              </p>
              <p>
                Le client peut également recourir à la plateforme européenne de résolution des
                litiges en ligne (RLL) :{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-black"
                >
                  ec.europa.eu/consumers/odr
                </a>
              </p>
            </div>
          </div>

          {/* Article 14 — Droit applicable */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Article 14 — Droit applicable
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Les présentes CGV sont soumises au droit français. Tout litige relatif à leur
              interprétation ou à leur exécution relève de la compétence exclusive des juridictions
              françaises, sous réserve des dispositions d&apos;ordre public applicables aux
              consommateurs.
            </p>
          </div>

          {/* Contact */}
          <div className="px-7 py-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400">
              Contact
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Pour toute question concernant les présentes CGV :{" "}
              <a
                href="mailto:contact@tempel-outdoor.fr"
                className="font-medium text-neutral-900 underline underline-offset-2 hover:text-black"
              >
                contact@tempel-outdoor.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
