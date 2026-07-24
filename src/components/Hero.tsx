"use client";

import Image from "next/image";
import site from "@/data/site.json";
import { useContactModal } from "@/context/ContactModalContext";

export function Hero() {
  const { openModal } = useContactModal();
  const { hero } = site;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-aw-bg pt-28 pb-16 sm:pt-32 sm:pb-20"
    >
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12">
        <div className="hero-anim-text">
          <Image
            src="/images/LOGOS/logotransparent.png"
            alt="Artisan-Web"
            width={280}
            height={80}
            className="mb-6 h-16 w-auto sm:h-20"
            priority
          />
          <h1 className="font-display text-[clamp(1.7rem,4.5vw,2.75rem)] leading-[1.1] tracking-[0.06em] text-aw-heading">
            <span className="block">{hero.titleMain}</span>
            <span className="mt-3 block font-body text-base font-medium normal-case tracking-normal text-aw-text sm:text-lg">
              — {hero.subtitle}
            </span>
            <span className="mt-2 block font-body text-base font-medium normal-case tracking-normal">
              <span className="text-aw-accent">à</span>
              <span className="text-aw-heading"> {hero.priceLabel}</span>
              <span className="font-display text-3xl tracking-wide text-aw-accent">
                {" "}
                {hero.price}
              </span>
            </span>
          </h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {hero.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-aw-primary px-3 py-1 text-xs font-medium text-aw-heading"
              >
                {chip}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => openModal("appel")}
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-aw-primary px-6 py-3.5 font-display text-base tracking-[0.1em] text-aw-heading transition-colors duration-200 hover:bg-aw-primary-hover"
          >
            {hero.ctaPrimary}
          </button>
        </div>

        <a
          href="https://aufaite.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-anim-media group relative block cursor-pointer overflow-hidden rounded-3xl border border-aw-heading/10 bg-aw-surface shadow-card transition-shadow duration-300 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aw-primary"
          aria-label="Voir notre réalisation aufaite.fr"
        >
          <div className="aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
            <Image
              src="/images/EXEMPLES_SITES/aufaite-hero.png"
              alt="Réalisation Artisan-Web : site AU FAITE"
              width={900}
              height={620}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              priority
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-aw-heading/85 via-aw-heading/40 to-transparent px-5 pb-5 pt-16">
            <span className="inline-flex items-center gap-2 font-display text-lg tracking-[0.08em] text-aw-primary transition-colors duration-200 group-hover:text-aw-primary-hover">
              Voir notre réalisation aufaite.fr
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
