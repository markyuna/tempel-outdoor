// src/components/home/ProduitsPhares.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  {
    title: "Spa Joy",
    category: "Bien-être",
    image: "/images/phares/spa-Joy.png",
    href: "/fr/products/spa-joy",
  },
  {
    title: "Sauna Grandview",
    category: "Bien-être",
    image: "/images/phares/Grandview.png",
    href: "/fr/bien-etre",
  },
  {
    title: "Baby-foot Blanc",
    category: "Loisirs",
    image: "/images/phares/baby-foot-blanc.png",
    href: "/fr/loisirs",
  },
  {
    title: "Billard Table",
    category: "Loisirs",
    image: "/images/phares/billard-table.png",
    href: "/fr/loisirs",
  },
];

export default function ProduitsPhares() {
  return (
    <section className="bg-[#f7f4ef] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div>
            <span className="mb-4 block text-sm font-medium uppercase tracking-[0.35em] text-[#b67c2d]">
              Produits phares
            </span>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-black md:text-5xl">
              Nos meilleures sélections
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-neutral-600">
            Découvrez une sélection de produits emblématiques choisis pour leur
            qualité, leur design et leur capacité à transformer votre espace
            extérieur.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
              }}
            >
              <Link
                href={product.href}
                className="group block overflow-hidden rounded-[32px] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-[280px] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw,
                           (max-width: 1280px) 50vw,
                           25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="p-6">
                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#b67c2d]">
                    {product.category}
                  </span>

                  <h3 className="mt-3 text-2xl font-semibold text-black">
                    {product.title}
                  </h3>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black transition-all duration-300 group-hover:gap-4">
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