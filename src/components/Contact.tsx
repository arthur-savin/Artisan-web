"use client";

import site from "@/data/site.json";
import { useContactModal } from "@/context/ContactModalContext";
import { Reveal } from "./Reveal";

export function Contact() {
  const { openModal } = useContactModal();
  const { contact, brand } = site;

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 sm:py-28"
      aria-labelledby="contact-title"
    >
      <div className="absolute inset-0 bg-aw-heading" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(248,181,50,0.25),transparent_55%)]" />
      <div className="relative mx-auto max-w-content px-5 text-center sm:px-8">
        <Reveal>
          <h2
            id="contact-title"
            className="font-display text-[clamp(1.6rem,4vw,2.4rem)] tracking-[0.1em] text-aw-primary"
          >
            {contact.title}
          </h2>
        </Reveal>
        <Reveal delayClass="reveal-delay-1">
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{contact.text}</p>
        </Reveal>
        <Reveal delayClass="reveal-delay-2" className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => openModal("appel")}
            className="inline-flex cursor-pointer rounded-xl bg-aw-primary px-6 py-3.5 font-display tracking-[0.1em] text-aw-heading transition-colors duration-200 hover:bg-aw-primary-hover"
          >
            {contact.ctaPrimary}
          </button>
          <button
            type="button"
            onClick={() => openModal("devis")}
            className="inline-flex cursor-pointer rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 font-display tracking-[0.1em] text-white transition-colors duration-200 hover:bg-white/15"
          >
            {contact.ctaSecondary}
          </button>
        </Reveal>
        <Reveal delayClass="reveal-delay-3">
          <p className="mt-8 text-sm text-white/60">
            {brand.name} – {brand.address}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
