import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Tempel Outdoor",
  description:
    "Politique de confidentialité de Tempel Outdoor concernant la collecte, l'utilisation et la protection des données personnelles conformément au RGPD.",
};

const sections = [
  {
    title: "1. Introduction",
    content:
      "Tempel Outdoor accorde une importance particulière à la protection des données personnelles de ses utilisateurs. La présente politique de confidentialité décrit la manière dont les données sont collectées, utilisées, conservées et protégées conformément au Règlement Général sur la Protection des Données (RGPD).",
  },
  {
    title: "2. Responsable du traitement",
    content:
      "Les données personnelles collectées sur le site Tempel Outdoor sont traitées par RB Végétal, propriétaire de la marque Tempel Outdoor.",
  },
  {
    title: "3. Données collectées",
    content:
      "Nous pouvons collecter différentes catégories de données : nom, prénom, adresse postale, adresse e-mail, numéro de téléphone, informations de commande, historique d'achat, données de navigation et informations techniques liées à l'utilisation du site.",
  },
  {
    title: "4. Finalités du traitement",
    content:
      "Les données collectées sont utilisées pour gérer les commandes, assurer les paiements, organiser les livraisons, fournir un service client de qualité, répondre aux demandes de contact, améliorer le fonctionnement du site, réaliser des statistiques et, avec votre consentement, envoyer des communications commerciales.",
  },
  {
    title: "5. Base légale du traitement",
    content:
      "Le traitement des données repose sur l'exécution du contrat de vente, le respect des obligations légales, l'intérêt légitime de Tempel Outdoor et, lorsque cela est nécessaire, le consentement explicite de l'utilisateur.",
  },
  {
    title: "6. Destinataires des données",
    content:
      "Les données peuvent être transmises uniquement aux personnes habilitées de Tempel Outdoor ainsi qu'à certains prestataires indispensables à l'exécution des services : transporteurs, prestataires de paiement, hébergeurs, outils d'analyse et partenaires techniques.",
  },
  {
    title: "7. Durée de conservation",
    content:
      "Les données sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées. Certaines informations peuvent être conservées plus longtemps lorsque la loi l'exige, notamment les données de facturation et comptables.",
  },
  {
    title: "8. Sécurité des données",
    content:
      "Tempel Outdoor met en œuvre des mesures techniques et organisationnelles appropriées afin de protéger les données personnelles contre tout accès non autorisé, perte, altération, divulgation ou destruction.",
  },
  {
    title: "9. Cookies",
    content:
      "Le site utilise des cookies et technologies similaires afin d'améliorer l'expérience utilisateur, mesurer l'audience, sécuriser la navigation et proposer des contenus adaptés. L'utilisateur peut gérer ses préférences via les paramètres de son navigateur ou l'outil de gestion des cookies du site.",
  },
  {
    title: "10. Droits des utilisateurs",
    content:
      "Conformément au RGPD, chaque utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, d'opposition, de portabilité de ses données ainsi que du droit de retirer son consentement à tout moment lorsque celui-ci constitue la base légale du traitement.",
  },
  {
    title: "11. Réclamation",
    content:
      "Si un utilisateur estime que ses droits ne sont pas respectés, il peut introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL).",
  },
  {
    title: "12. Modifications",
    content:
      "Tempel Outdoor se réserve le droit de modifier la présente politique de confidentialité à tout moment afin de l'adapter aux évolutions légales, réglementaires ou techniques. La version en vigueur est celle publiée sur le site.",
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            Protection des données
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Politique de confidentialité
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5f5a54]">
            Cette politique décrit la manière dont Tempel Outdoor collecte,
            utilise, protège et conserve les données personnelles de ses
            utilisateurs conformément à la réglementation européenne en vigueur.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl space-y-10">
          <LegalCard title="Responsable du traitement">
            <div className="space-y-2">
              <p className="font-medium text-[#181512]">RB Végétal</p>
              <p>Marque exploitant Tempel Outdoor</p>
              <p>16 Rue Georges Duhamel</p>
              <p>95300 Hérouville-en-Vexin – France</p>
              <p>SIRET : 49933190800032</p>
              <p>TVA : FR01499331908</p>
              <p>RCS : Pontoise B 499 331 908</p>
            </div>
          </LegalCard>

          {sections.map((section) => (
            <LegalCard key={section.title} title={section.title}>
              <p>{section.content}</p>
            </LegalCard>
          ))}

          <LegalCard title="Contact RGPD">
            <p>
              Pour toute question concernant vos données personnelles ou pour
              exercer vos droits, vous pouvez nous contacter à :
            </p>

            <a
              href="mailto:contact@tempel-outdoor.fr"
              className="mt-4 inline-block font-medium text-[#181512] underline underline-offset-4"
            >
              contact@tempel-outdoor.fr
            </a>
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

      <div className="mt-6 leading-8 text-[#5f5a54]">
        {children}
      </div>
    </section>
  );
}