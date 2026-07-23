"use client";

import Image from "next/image";
import { useState } from "react";
import site from "@/data/site.json";
import { Reveal } from "./Reveal";

export function Portfolio() {
  const { portfolio } = site;
  const { featured } = portfolio;
  const [activeId, setActiveId] = useState(featured.images[0]?.id ?? "hero");

  return (
    <section id="portfolio" className="py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-aw-muted">
            Portfolio
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.6rem,4vw,2.4rem)] tracking-[0.1em] text-aw-heading">
            {portfolio.title}
          </h2>
          <p className="mt-3 text-aw-muted sm:text-lg">{portfolio.subtitle}</p>
        </Reveal>

        <Reveal delayClass="reveal-delay-1" className="mt-12 grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-center lg:col-span-5">
            <span className="inline-flex w-fit items-center rounded-full bg-gradient-to-r from-[#6271ff] to-[#7c8aff] px-3 py-1 text-xs font-medium text-white">
              {featured.tag}
            </span>
            <h3 className="mt-4 font-display text-3xl tracking-[0.08em] text-aw-heading sm:text-4xl">
              {featured.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-aw-muted">
              {featured.role} ·{" "}
              <a
                href={featured.url}
                className="text-aw-heading underline decoration-aw-primary underline-offset-4 transition-colors hover:text-aw-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                aufaite.fr
              </a>
            </p>
            <p className="mt-5 leading-relaxed text-aw-text">{featured.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featured.features.map((f) => (
                <span
                  key={f}
                  className="rounded-lg bg-aw-primary/25 px-3 py-1 text-xs font-medium text-aw-heading"
                >
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-aw-heading px-5 py-3 font-display tracking-[0.1em] text-aw-primary transition-colors duration-200 hover:bg-aw-muted"
              >
                Visiter le site
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
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-aw-heading/10 bg-aw-heading shadow-card sm:aspect-[16/11]">
              {featured.images.map((img) => {
                const isActive = img.id === activeId;
                const isLogo = img.id === "logo";
                return (
                  <div
                    key={img.id}
                    className={`absolute inset-0 transition-opacity duration-350 ${
                      isActive ? "opacity-100" : "pointer-events-none opacity-0"
                    } ${isLogo ? "flex items-center justify-center bg-aw-surface p-10" : ""}`}
                  >
                    {isLogo ? (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={400}
                        height={200}
                        className="max-h-48 w-auto object-contain"
                      />
                    ) : (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                      />
                    )}
                  </div>
                );
              })}

              <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center px-4">
                <div
                  className="flex gap-1 rounded-xl border border-aw-heading/10 bg-aw-surface/90 p-1 backdrop-blur-md"
                  role="tablist"
                  aria-label="Vues du projet"
                >
                  {featured.images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      role="tab"
                      aria-selected={img.id === activeId}
                      onClick={() => setActiveId(img.id)}
                      className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        img.id === activeId
                          ? "bg-aw-heading text-aw-primary"
                          : "text-aw-muted"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
