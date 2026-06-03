import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente | Tempel Outdoor",
  description:
    "Conditions générales de vente de Tempel Outdoor : commande, prix, paiement, livraison, retours, garanties et contact.",
};

const sections = [
  {
    title: "1. Objet",
    content:
      "Les présentes Conditions Générales de Vente encadrent les ventes de produits réalisées sur le site Tempel Outdoor. Elles définissent les droits et obligations de TEMPEL OUTDOOR, marque exploitée par RB Végétal, et de ses clients dans le cadre de l’achat de produits proposés sur la plateforme.",
  },
  {
    title: "2. Produits",
    content:
      "Tempel Outdoor propose notamment des spas extérieurs, saunas, baby-foot, billards, équipements de loisirs et équipements fitness premium. Les photographies, descriptions, caractéristiques et informations présentes sur les fiches produits sont fournies avec le plus grand soin, sans toutefois constituer un engagement contractuel absolu.",
  },
  {
    title: "3. Prix",
    content:
      "Les prix sont indiqués en euros toutes taxes comprises (TTC), au taux de TVA applicable au jour de la commande. Le prix applicable est celui affiché sur le site au moment de la validation de la commande. Tempel Outdoor se réserve le droit de modifier ses prix à tout moment, sans effet sur les commandes déjà validées.",
  },
  {
    title: "4. Commande",
    content:
      "Le client sélectionne les produits de son choix, vérifie le contenu de son panier, renseigne les informations nécessaires à la facturation et à la livraison, puis valide sa commande. Toute validation de commande implique l’acceptation pleine et entière des présentes Conditions Générales de Vente.",
  },
  {
    title: "5. Paiement",
    content:
      "Le paiement s’effectue en ligne par les moyens proposés sur la plateforme, notamment par carte bancaire via un espace sécurisé. Le client garantit qu’il dispose des autorisations nécessaires pour utiliser le moyen de paiement choisi. La commande est considérée comme définitive après confirmation du paiement.",
  },
  {
    title: "6. Livraison",
    content:
      "La livraison s’effectue directement depuis l’usine du fabricant ou depuis le lieu d’expédition indiqué, à l’adresse fournie par le client lors de la commande. Les délais de livraison peuvent varier selon les produits, notamment pour les articles volumineux ou fabriqués sur commande. Pour les spas, saunas, billards et autres produits encombrants, la livraison peut être effectuée par transporteur spécialisé.",
  },
  {
    title: "7. Réception et dommages liés au transport",
    content:
      "Le client doit vérifier l’état des produits dès leur réception. En cas d’anomalie, de dommage apparent ou de colis détérioré, il est recommandé d’émettre des réserves précises auprès du transporteur et de contacter Tempel Outdoor avec des photos permettant d’évaluer la nature et l’étendue du dommage.",
  },
  {
    title: "8. Retours et produits volumineux",
    content:
      "Les retours sont soumis aux conditions applicables selon la nature du produit commandé. Certains articles volumineux ou fabriqués sur commande peuvent être non échangeables ou soumis à des conditions particulières. En cas de produit défectueux ou de dommage accepté après analyse, Tempel Outdoor pourra organiser l’envoi de pièces de remplacement ou d’un produit de remplacement selon les conditions applicables.",
  },
  {
    title: "9. Garanties légales",
    content:
      "Les produits bénéficient des garanties légales applicables, notamment la garantie légale de conformité et la garantie contre les vices cachés, dans les conditions prévues par le droit français.",
  },
  {
    title: "10. Responsabilité",
    content:
      "Tempel Outdoor met tout en œuvre pour fournir des informations fiables et assurer le bon fonctionnement du site. Sa responsabilité ne saurait toutefois être engagée en cas d’utilisation inappropriée des produits, de mauvaise installation, de force majeure, d’indisponibilité temporaire du site ou de dommages indirects.",
  },
  {
    title: "11. Données personnelles",
    content:
      "Les données personnelles collectées dans le cadre de la commande sont utilisées pour la gestion des comptes clients, commandes, paiements, livraisons, retours, remboursements et relations avec le service client. Le client dispose de droits d’accès, de rectification, d’opposition, de suppression, de limitation et de portabilité conformément au RGPD.",
  },
  {
    title: "12. Droit applicable",
    content:
      "Les présentes Conditions Générales de Vente sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution relève des juridictions françaises compétentes.",
  },
];

export default function CgvPage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            Conditions de vente
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Conditions générales de vente
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5f5a54]">
            Les présentes Conditions Générales de Vente définissent les règles
            applicables aux commandes passées sur le site Tempel Outdoor.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl space-y-10">
          <LegalCard title="Identification du vendeur">
            <div className="space-y-2">
              <p className="font-medium text-[#181512]">TEMPEL OUTDOOR</p>
              <p>Marque exploitée par RB Végétal</p>
              <p>16 Rue Georges Duhamel</p>
              <p>95300 Hérouville-en-Vexin – France</p>
              <p>SIRET : 49933190800032</p>
              <p>TVA intracommunautaire : FR01499331908</p>
              <p>RCS : Pontoise B 499 331 908</p>
              <p>Contact : contact@tempel-outdoor.fr</p>
            </div>
          </LegalCard>

          {sections.map((section) => (
            <LegalCard key={section.title} title={section.title}>
              <p>{section.content}</p>
            </LegalCard>
          ))}

          <LegalCard title="13. Contact">
            <p>
              Pour toute question concernant les présentes Conditions Générales
              de Vente, le client peut contacter Tempel Outdoor à l’adresse
              suivante :{" "}
              <a
                href="mailto:contact@tempel-outdoor.fr"
                className="font-medium text-[#181512] underline underline-offset-4"
              >
                contact@tempel-outdoor.fr
              </a>
              .
            </p>
          </LegalCard>
        </div>
      </section>
    </main>
  );
}

function LegalCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-[#e6ded1] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-6 leading-8 text-[#5f5a54]">{children}</div>
    </section>
  );
}