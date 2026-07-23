import site from "@/data/site.json";
import { Reveal } from "./Reveal";

export function Faq() {
  const { faq } = site;

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <h2 className="text-center font-display text-[clamp(1.6rem,4vw,2.4rem)] tracking-[0.1em] text-aw-heading">
            {faq.title}
          </h2>
        </Reveal>
        <Reveal className="mt-10 divide-y divide-aw-heading/10 overflow-hidden rounded-3xl border border-aw-heading/10 bg-aw-surface">
          {faq.items.map((item, i) => (
            <details key={item.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-medium text-aw-heading transition-colors duration-200 hover:text-aw-muted [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="text-lg font-bold text-aw-heading group-open:hidden">+</span>
                <span className="hidden text-lg font-bold text-aw-heading group-open:inline">−</span>
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-aw-muted">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
