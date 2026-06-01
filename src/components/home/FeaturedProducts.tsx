// src/components/home/FeaturedProducts.tsx

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  {
    title: "Spa & Spa de nage",
    category: "Bien-être",
    price: "Sur devis",
    href: "/fr/bien-etre",
    image: "/images/univers/spa-spa-de-nage.png",
  },
  {
    title: "Sauna",
    category: "Bien-être",
    price: "Sur devis",
    href: "/fr/bien-etre",
    image: "/images/univers/sauna.png",
  },
  {
    title: "Baby-foot",
    category: "Loisirs",
    price: "Sur devis",
    href: "/fr/loisirs",
    image: "/images/univers/baby-foot.png",
  },
  {
    title: "Billard",
    category: "Loisirs",
    price: "Sur devis",
    href: "/fr/loisirs",
    image: "/images/univers/billard.png",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-[#f7f4ef] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end"
        >
          <div>
            <span className="mb-4 block text-sm font-medium uppercase tracking-[0.35em] text-[#b67c2d]">
              Produits phares
            </span>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-black md:text-5xl">
              Une sélection premium pour vos plus beaux espaces extérieurs
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-neutral-600">
            Découvrez nos équipements les plus emblématiques, choisis pour leur
            design, leur confort et leur capacité à transformer votre extérieur.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.article
              key={product.title}
              initial={{ opacity: 0, y: 46 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.75,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group overflow-hidden rounded-[32px] bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              <Link href={product.href} className="block">
                <div className="relative h-[260px] overflow-hidden bg-neutral-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${product.image})`,
                    }}
                  />

                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black backdrop-blur-md">
                    {product.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold tracking-tight text-black">
                    {product.title}
                  </h3>

                  <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#b67c2d]">
                    {product.price}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black transition-all duration-300 group-hover:gap-4">
                    Découvrir
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}