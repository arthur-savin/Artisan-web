"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import { useContactModal } from "@/context/ContactModalContext";

export function Header() {
  const { openModal } = useContactModal();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", menuOpen);
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-4 left-4 right-4 z-50 mx-auto max-w-content rounded-2xl border backdrop-blur-lg transition-all duration-250 ${
          scrolled
            ? "border-aw-heading/10 bg-aw-surface/95 shadow-soft"
            : "border-aw-heading/5 bg-aw-surface/80"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          <a
            href="#hero"
            className="flex shrink-0 cursor-pointer items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aw-primary"
          >
            <Image
              src="/images/LOGOS/logotransparent.png"
              alt="Artisan-Web — création site web artisan Lyon"
              width={180}
              height={44}
              className="h-10 w-auto sm:h-11"
              priority
            />
          </a>

          <nav
            className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] flex-col gap-1 rounded-2xl border border-aw-heading/10 bg-aw-surface p-4 shadow-soft lg:static lg:flex lg:flex-row lg:items-center lg:gap-0.5 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
              menuOpen ? "flex" : "hidden lg:flex"
            }`}
            aria-label="Navigation principale"
          >
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="cursor-pointer rounded-lg px-3 py-2 font-display text-sm tracking-[0.12em] text-aw-heading transition-colors duration-200 hover:bg-aw-primary/20"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openModal("appel")}
              className="hidden cursor-pointer rounded-xl bg-aw-primary px-4 py-2.5 font-display text-sm tracking-[0.1em] text-aw-heading shadow-sm transition-colors duration-200 hover:bg-aw-primary-hover sm:inline-flex"
            >
              Réserver un appel
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-aw-heading/15 bg-aw-surface transition-colors duration-200 hover:border-aw-primary lg:hidden"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={`block h-0.5 w-5 origin-center bg-aw-heading transition duration-200 ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-aw-heading transition duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 origin-center bg-aw-heading transition duration-200 ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-aw-heading/30 backdrop-blur-sm lg:hidden ${
          menuOpen ? "block" : "hidden"
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
