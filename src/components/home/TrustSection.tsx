// src/components/home/TrustSection.tsx

"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  BadgeCheck,
  Truck,
  ShieldCheck,
} from "lucide-react";

const advantages = [
  {
    title: "Produits premium",
    description:
      "Une sélection rigoureuse d’équipements haut de gamme conçus pour sublimer vos espaces extérieurs avec élégance et durabilité.",
    icon: Sparkles,
  },
  {
    title: "Accompagnement personnalisé",
    description:
      "Nos experts vous accompagnent à chaque étape afin de vous proposer la solution la plus adaptée à votre projet.",
    icon: BadgeCheck,
  },
  {
    title: "Livraison partout en France",
    description:
      "Une logistique fiable et un suivi attentif pour garantir une réception sereine de vos équipements.",
    icon: Truck,
  },
  {
    title: "Qualité & durabilité",
    description:
      "Des produits sélectionnés pour leur robustesse, leur confort et leur capacité à traverser les années.",
    icon: ShieldCheck,
  },
];

export default function TrustSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 block text-sm font-medium uppercase tracking-[0.35em] text-[#b67c2d]">
            Pourquoi Tempel Outdoor
          </span>

          <h2 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-black md:text-5xl">
            Un accompagnement premium pour donner vie à vos projets outdoor
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600">
            Nous sélectionnons des équipements d’exception et vous accompagnons
            dans la création d’espaces extérieurs élégants, fonctionnels et
            durables.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {advantages.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                }}
                className="group rounded-[32px] border border-black/10 bg-[#f7f4ef] p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-black text-[#d7b86e] transition-all duration-300 group-hover:bg-[#d7b86e] group-hover:text-black">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mb-4 text-xl font-semibold text-black">
                  {item.title}
                </h3>

                <p className="text-sm leading-7 text-black/65">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}