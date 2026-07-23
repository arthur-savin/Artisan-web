"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { Reveal } from "./Reveal";

export function Process() {
  const { process } = site;
  const [active, setActive] = useState(1);

  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-process-step]"),
    );
    if (!cards.length) return;

    const update = () => {
      let visible = 0;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.65) visible = i + 1;
      });
      setActive(Math.max(1, visible));
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const ratio = Math.max(0, (active - 1) / Math.max(1, process.steps.length - 1));

  return (
    <section
      id="process"
      className="relative border-y border-aw-heading/5 bg-aw-surface/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <h2 className="text-center font-display text-[clamp(1.6rem,4vw,2.4rem)] tracking-[0.1em] text-aw-heading">
            {process.title}
          </h2>
        </Reveal>

        <Reveal className="mx-auto mt-10 hidden max-w-3xl md:block">
          <div className="relative h-1 rounded-full bg-aw-heading/10" aria-hidden>
            <div
              className="absolute inset-y-0 left-0 origin-left rounded-full bg-aw-primary transition-transform duration-450"
              style={{ width: "100%", transform: `scaleX(${ratio})` }}
            />
          </div>
          <div className="mt-3 flex justify-between">
            {process.steps.map((step) => (
              <span
                key={step.number}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  step.number <= active ? "bg-aw-primary" : "bg-aw-heading/20"
                }`}
              />
            ))}
          </div>
        </Reveal>

        <div className="mt-12 space-y-5">
          {process.steps.map((step, i) => (
            <Reveal key={step.number} delayClass={`reveal-delay-${Math.min(i + 1, 4)}`}>
              <article
                data-process-step={step.number}
                className={`flex flex-col gap-4 rounded-2xl border p-5 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${
                  step.number <= active
                    ? "border-aw-primary/50 bg-aw-surface"
                    : "border-transparent bg-aw-bg/80"
                }`}
              >
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-aw-primary font-display text-xl text-aw-heading">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-xl tracking-[0.08em] text-aw-heading">
                      {step.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-aw-muted">
                      {step.text}
                    </p>
                  </div>
                </div>
                <Image
                  src={step.icon}
                  alt=""
                  width={80}
                  height={80}
                  className="mx-auto h-20 w-20 sm:mx-0"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
