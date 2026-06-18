// src/components/home/GoogleReviewsSection.tsx

import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";

const reviewsRowOne = [
  {
    name: "FRESSARD D.",
    text: "Merci à Louis et à Benoît pour leur efficacité. Le spa est bien installé et nous avons eu toutes les explications nécessaires.",
    rating: 5,
  },
  {
    name: "Laurent L.",
    text: "Super professionnel, livraison et installation au top. Personnel très agréable, gentil et de très bon conseil.",
    rating: 5,
  },
  {
    name: "DUVERGER M.",
    text: "Très satisfait de l’accompagnement, de la livraison et des explications pédagogiques lors de l’installation.",
    rating: 5,
  },
  {
    name: "Sophie B.",
    text: "Une très belle expérience du début à la fin. Produit de qualité et service client très réactif.",
    rating: 5,
  },
];

const reviewsRowTwo = [
  {
    name: "Billy J.",
    text: "Installation rapide, bien réalisée. Tout a bien été expliqué sur l’utilisation et le fonctionnement du spa.",
    rating: 5,
  },
  {
    name: "Thévenet É.",
    text: "L’installation s’est bien passée, technicien très professionnel et pédagogue.",
    rating: 5,
  },
  {
    name: "De C. C.",
    text: "Très bien passé, personnels très compétents et très sympathiques.",
    rating: 5,
  },
  {
    name: "Claire M.",
    text: "Très bon accompagnement dans le choix du produit. Le rendu est magnifique dans le jardin.",
    rating: 5,
  },
];

type Review = {
  name: string;
  text: string;
  rating: number;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: rating }).map((_, index) => (
        <Star
          key={index}
          className="h-5 w-5 fill-[#f59e0b] text-[#f59e0b]"
        />
      ))}
    </div>
  );
}

function ReviewCard({ name, text, rating }: Review) {
  return (
    <article className="mx-5 flex w-[420px] shrink-0 items-center gap-4 rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/5 md:w-[520px]">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-200">
        <Image
          src="/images/google-review-avatar.png"
          alt="Avis Google"
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-neutral-800">{name}</p>
          <BadgeCheck className="h-4 w-4 fill-neutral-800 text-white" />
          <Stars rating={rating} />
        </div>

        <p className="mt-1 line-clamp-2 text-[15px] leading-snug text-neutral-700">
          {text}
        </p>
      </div>
    </article>
  );
}

function ReviewsMarquee({
  reviews,
  reverse = false,
}: {
  reviews: Review[];
  reverse?: boolean;
}) {
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className="reviews-marquee relative flex overflow-hidden">
      <div
        className={[
          "reviews-track flex min-w-max",
          reverse ? "animate-google-marquee-reverse" : "animate-google-marquee",
        ].join(" ")}
      >
        {duplicatedReviews.map((review, index) => (
          <ReviewCard
            key={`${review.name}-${index}`}
            name={review.name}
            text={review.text}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  );
}

export default function GoogleReviewsSection() {
  return (
    <section className="relative overflow-hidden bg-[#eeeeed] py-20">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#eeeeed] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#eeeeed] to-transparent" />

      <div className="mx-auto mb-10 max-w-5xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">
          Avis Google
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          Nos clients nous adorent !
        </h2>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-lg font-semibold text-neutral-800">
          <span>4.8 étoiles basé sur</span>
          <a
            href="/fr/contact"
            className="underline underline-offset-4 transition hover:text-neutral-500"
          >
            426 avis
          </a>
        </div>
      </div>

      <div className="space-y-10">
        <ReviewsMarquee reviews={reviewsRowOne} />
        <ReviewsMarquee reviews={reviewsRowTwo} reverse />
      </div>

      <style>
        {`
          @keyframes google-marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          @keyframes google-marquee-reverse {
            from {
              transform: translateX(-50%);
            }
            to {
              transform: translateX(0);
            }
          }

          .animate-google-marquee {
            animation: google-marquee 38s linear infinite;
          }

          .animate-google-marquee-reverse {
            animation: google-marquee-reverse 42s linear infinite;
          }

          .reviews-marquee:hover .reviews-track {
            animation-play-state: paused;
          }
        `}
      </style>
    </section>
  );
}