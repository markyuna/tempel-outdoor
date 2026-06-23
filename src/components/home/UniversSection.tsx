// src/components/home/UniversSection.tsx

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function UniversSection() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "fr";

  const univers = [
    {
      title: "Spa & Spa de nage",
      href: `/${locale}/bien-etre/spa`,
      image: "/images/univers/spa-spa-de-nage.png",
    },
    {
      title: "Sauna",
      href: `/${locale}/bien-etre/sauna`,
      image: "/images/univers/sauna.png",
    },
    {
      title: "Baby-foot",
      href: `/${locale}/loisirs/baby-foot`,
      image: "/images/univers/baby-foot.png",
    },
    {
      title: "Billard",
      href: `/${locale}/loisirs/billard`,
      image: "/images/univers/billard.png",
    },
  ];

  return (
    <section className="bg-[#f7f4ef] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-14 grid gap-8 lg:grid-cols-2 lg:items-end"
        >
          <div>
            <span className="mb-4 block text-sm font-medium uppercase tracking-[0.35em] text-[#b67c2d]">
              Nos Univers
            </span>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-black md:text-5xl xl:text-[4rem]">
              Découvrez nos univers d’exception
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-neutral-600 lg:ml-auto">
            Une sélection d’équipements premium pensée pour transformer chaque
            espace extérieur en un lieu de détente, de convivialité et
            d’élégance.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {univers.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 46 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.75,
                delay: index * 0.12,
                ease: "easeOut",
              }}
            >
              <Link
                href={item.href}
                className="group relative block h-[340px] overflow-hidden rounded-[32px] shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl md:h-[380px]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white md:p-10">
                  <h3 className="mb-5 max-w-md text-3xl font-bold uppercase tracking-wide md:text-4xl">
                    {item.title}
                  </h3>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:gap-4 group-hover:bg-white group-hover:text-black">
                    Découvrir
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}