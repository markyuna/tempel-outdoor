import { Waves, Flame, Trophy, Utensils } from "lucide-react";
import Link from "next/link";
import { getLocale } from "next-intl/server";

const univers = [
  {
    icon: Waves,
    title: "Spa extérieur",
    description:
      "Profitez de spas de nage de 2 à 7 places, pensés pour la relaxation aquatique en petit comité ou en groupe. Idéal pour décompresser après une longue journée ou partager un moment privilégié avec vos proches.",
  },
  {
    icon: Flame,
    title: "Sauna bois haut de gamme",
    description:
      "Découvrez nos saunas extérieurs de 2 à 10 places, conçus en épicéa ou thermo-bois, avec chauffage électrique ou bois et options de vestiaire intégré. Une expérience bien-être élégante, à vivre toute l’année.",
  },
  {
    icon: Trophy,
    title: "Baby-foot extérieur résistant",
    description:
      "Nos baby-foot d’extérieur, en version duo ou familiale, sont conçus pour résister aux intempéries. Installez-les sur une terrasse, dans un jardin ou sous une véranda pour des moments de jeu et de convivialité.",
  },
  {
    icon: Utensils,
    title: "Billard convertible design",
    description:
      "Nos billards extérieurs convertibles se transforment en tables à manger de 6 à 10 couverts. Une solution élégante et gain de place pour passer du jeu au repas en toute simplicité.",
  },
];

export default async function AboutPage() {
  const locale = await getLocale();

  return (
    <main className="bg-[#f7f4ee] text-[#181512]">
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#b87932]">
            À propos
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            Tempel Outdoor, votre espace bien-être et convivialité en extérieur
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#5f5a54]">
            Tempel Outdoor sélectionne des équipements haut de gamme pour
            transformer vos extérieurs en véritables lieux de détente, de
            partage et d’élégance. Spa, sauna, baby-foot, billard ou espace
            fitness : chaque univers est pensé pour sublimer votre jardin,
            votre terrasse ou votre maison.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          {univers.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-[2rem] border border-[#e6ded1] bg-white/80 p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-[#d7b86e]">
                  <Icon className="h-7 w-7" />
                </div>

                <h2 className="text-2xl font-semibold">{item.title}</h2>

                <p className="mt-4 text-base leading-8 text-[#5f5a54]">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#d7b86e]">
            Notre vision
          </p>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
            Créer des espaces extérieurs pensés pour vivre mieux
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Notre objectif est simple : vous accompagner dans la création d’un
            espace extérieur à votre image, où confort, design, bien-être et
            convivialité se rencontrent naturellement.
          </p>

          <Link
            href={`/${locale}/contact`}
            className="mt-10 inline-flex rounded-full bg-[#d7b86e] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </main>
  );
}