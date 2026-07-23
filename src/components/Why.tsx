import Image from "next/image";
import site from "@/data/site.json";
import { Reveal } from "./Reveal";

export function Why() {
  const { why } = site;

  return (
    <section id="why" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-aw-muted">
            {why.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.6rem,4vw,2.4rem)] tracking-[0.1em] text-aw-heading">
            {why.title}
          </h2>
          <p className="mt-4 text-aw-muted sm:text-lg">{why.subtitle}</p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal delayClass="reveal-delay-1" className="lg:col-span-5">
            <blockquote className="relative overflow-hidden rounded-3xl bg-aw-surface p-8 shadow-soft">
              <svg
                className="mb-4 h-10 w-10 text-aw-primary"
                viewBox="0 0 40 40"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M10 20C10 15 12 10 18 10C20 10 22 11 22 13C22 15 20 16 18 16C16 16 14 17 14 19C14 21 16 22 18 22C24 22 26 17 26 12V10H30V20C30 25 26 30 20 30C14 30 10 25 10 20Z"
                  opacity="0.9"
                />
              </svg>
              <p className="text-lg leading-relaxed text-aw-heading">
                «&nbsp;{why.testimonial.quote}&nbsp;»
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <Image
                  src={why.testimonial.avatar}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <cite className="not-italic font-medium text-aw-heading">
                    {why.testimonial.name}
                  </cite>
                  <p className="text-sm text-aw-muted">{why.testimonial.role}</p>
                </div>
              </footer>
            </blockquote>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {why.benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delayClass={`reveal-delay-${(i % 4) + 1}`}>
                <article className="rounded-2xl border border-aw-heading/5 bg-aw-surface/70 p-6 transition-colors duration-200 hover:border-aw-primary/40">
                  <Image
                    src={benefit.icon}
                    alt=""
                    width={56}
                    height={56}
                    className="mb-4 h-14 w-14"
                  />
                  <h3 className="font-display text-xl tracking-[0.08em] text-aw-heading">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-aw-muted">
                    {benefit.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
