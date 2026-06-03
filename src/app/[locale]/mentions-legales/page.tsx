import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | Tempel Outdoor",
  description:
    "Mentions légales du site Tempel Outdoor : propriétaire du site, immatriculation, création du site, hébergement, propriété intellectuelle et droit applicable.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            Informations légales
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Mentions légales
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5f5a54]">
            Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004
            pour la confiance dans l’économie numérique, les utilisateurs du
            site Tempel Outdoor sont informés des présentes mentions légales.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl space-y-10">
          <LegalCard title="Propriétaire du site">
            <div className="space-y-2">
              <p className="font-medium text-[#181512]">TEMPEL OUTDOOR</p>
              <p>16 Rue Georges Duhamel</p>
              <p>95300 Hérouville-en-Vexin – France</p>
              <p>https://tempel-outdoor.com</p>
            </div>
          </LegalCard>

          <LegalCard title="Immatriculation">
            <div className="space-y-3">
              <p>
                <strong className="text-[#181512]">SIRET :</strong>{" "}
                49933190800032
              </p>
              <p>
                <strong className="text-[#181512]">
                  TVA intracommunautaire :
                </strong>{" "}
                FR01499331908
              </p>
              <p>
                <strong className="text-[#181512]">RCS :</strong> Pontoise B
                499331908
              </p>
              <p>
                <strong className="text-[#181512]">Capital social :</strong>{" "}
                12 000 €
              </p>
            </div>
          </LegalCard>

          <LegalCard title="Création du site">
            <div className="space-y-3">
              <p>
                Le site internet Tempel Outdoor a été conçu et développé par{" "}
                <strong className="text-[#181512]">Marcos Suarez</strong>.
              </p>

              <p>
                Conception UX/UI, développement web, intégration, optimisation
                technique et mise en ligne réalisés par Marcos Suarez.
              </p>

              <p>
                Concepteur & Développeur Web indépendant
              </p>
            </div>
          </LegalCard>

          <LegalCard title="Hébergement">
            <div className="space-y-2">
              <p className="font-medium text-[#181512]">Vercel Inc.</p>
              <p>340 S Lemon Ave #4133</p>
              <p>Walnut, CA 91789</p>
              <p>États-Unis</p>
            </div>
          </LegalCard>

          <LegalCard title="Droits d’auteur et propriété intellectuelle">
            <div className="space-y-4">
              <p>
                Tous les éléments présents sur ce site, notamment les textes,
                images, graphismes, logos, icônes, vidéos, illustrations,
                documents et contenus numériques, sont protégés par les lois
                françaises et internationales relatives à la propriété
                intellectuelle.
              </p>

              <p>
                Toute reproduction, représentation, modification, publication,
                adaptation ou exploitation de tout ou partie du site, quel que
                soit le moyen ou le procédé utilisé, est interdite sans
                autorisation écrite préalable de Tempel Outdoor.
              </p>
            </div>
          </LegalCard>

          <LegalCard title="Hyperliens">
            <p>
              Tempel Outdoor ne saurait être tenu responsable du contenu, de la
              disponibilité ou du fonctionnement des sites internet accessibles
              via des liens externes présents sur ce site. L’utilisateur est
              invité à faire preuve de vigilance lors de la consultation de ces
              ressources externes.
            </p>
          </LegalCard>

          <LegalCard title="Droit applicable">
            <p>
              Le présent site ainsi que son contenu sont soumis au droit
              français. Tout litige relatif à l’utilisation du site
              https://tempel-outdoor.com sera soumis à la compétence des
              juridictions françaises compétentes.
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
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-[#e6ded1] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <div className="mt-6 leading-8 text-[#5f5a54]">{children}</div>
    </section>
  );
}