"use client";

import site from "@/data/site.json";
import { useContactModal } from "@/context/ContactModalContext";
import { Reveal } from "./Reveal";
import type { ModalType } from "@/context/ContactModalContext";

export function Offers() {
  const { openModal } = useContactModal();
  const { offers, proofs } = site;

  return (
    <section
      id="offers"
      className="border-y border-aw-heading/5 bg-aw-surface/50 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <h2 className="text-center font-display text-[clamp(1.6rem,4vw,2.4rem)] tracking-[0.1em] text-aw-heading">
            {offers.title}
          </h2>
        </Reveal>

        <Reveal className="mt-12 grid gap-4 sm:grid-cols-3">
          {proofs.items.map((item) => (
            <div key={item.title} className="rounded-2xl bg-aw-bg/80 p-5 text-center">
              <p className="font-display text-2xl tracking-wide text-aw-heading">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-aw-muted">{item.text}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-aw-muted">Secteurs accompagnés :</span>
          {proofs.sectors.map((sector) => (
            <span
              key={sector}
              className="rounded-full border border-aw-heading/10 bg-aw-bg px-3 py-1 text-xs font-medium text-aw-heading"
            >
              {sector}
            </span>
          ))}
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {offers.plans.map((plan, i) => (
            <Reveal key={plan.id} delayClass={i === 1 ? "reveal-delay-1" : ""}>
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-8 ${
                  plan.featured
                    ? "border-2 border-aw-featured bg-aw-heading text-white shadow-card"
                    : "border border-aw-heading/10 bg-aw-bg shadow-soft"
                }`}
              >
                {plan.featured && (
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aw-featured/30 blur-3xl" />
                )}
                <span
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl font-display text-lg ${
                    plan.featured
                      ? "bg-gradient-to-br from-[#6271ff] to-[#7c8aff]"
                      : "bg-aw-primary text-aw-heading"
                  }`}
                >
                  {plan.badge}
                </span>
                <h3
                  className={`relative mt-5 font-display text-2xl tracking-[0.08em] ${
                    plan.featured ? "text-aw-primary" : "text-aw-heading"
                  }`}
                >
                  {plan.title}
                </h3>
                <p
                  className={`relative mt-1 text-sm ${
                    plan.featured ? "text-white/70" : "text-aw-muted"
                  }`}
                >
                  {plan.subtitle}
                </p>
                {plan.price && (
                  <p className="relative mt-6">
                    <span className="text-sm text-aw-muted">{plan.priceNote}</span>
                    <span className="ml-2 font-display text-4xl tracking-wide text-aw-accent">
                      {plan.price}
                    </span>
                  </p>
                )}
                <ul
                  className={`relative mt-6 flex-1 space-y-3 text-sm ${
                    plan.featured ? "text-white/90" : "text-aw-text"
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-aw-primary" aria-hidden>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.note && (
                  <p className="relative mt-5 text-sm text-aw-muted">
                    Des frais de service de{" "}
                    <strong className="text-aw-heading">15&nbsp;€ par mois</strong>{" "}
                    s’appliquent après l’acquisition du site web.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => openModal(plan.modalType as ModalType)}
                  className={`relative mt-6 w-full cursor-pointer rounded-xl px-5 py-3.5 font-display tracking-[0.1em] transition-colors duration-200 ${
                    plan.featured
                      ? "bg-aw-primary text-aw-heading hover:bg-aw-primary-hover"
                      : "border border-aw-heading/15 bg-[#f6f2e2] text-aw-heading hover:border-aw-primary hover:bg-aw-primary/30"
                  }`}
                >
                  {plan.cta}
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
