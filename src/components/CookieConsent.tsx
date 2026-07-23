"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";
const GA_ID = "G-PRB0NF2M9Y";

function loadGoogleAnalytics() {
  if (typeof window === "undefined" || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (consent === "accepted") {
        loadGoogleAnalytics();
        return;
      }
      if (!consent) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    loadGoogleAnalytics();
    setVisible(false);
  }

  function refuse() {
    try {
      localStorage.setItem(STORAGE_KEY, "refused");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-aw-heading/10 bg-aw-surface p-4 shadow-soft sm:p-5"
      role="dialog"
      aria-labelledby="cookieConsentTitle"
      aria-describedby="cookieConsentDesc"
    >
      <div className="mx-auto flex max-w-content flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p id="cookieConsentTitle" className="font-medium text-aw-heading">
            Utilisation des cookies
          </p>
          <p id="cookieConsentDesc" className="mt-1 text-sm text-aw-muted">
            Ce site utilise Google Analytics pour mesurer l’audience. Aucun cookie
            de suivi n’est déposé tant que vous n’acceptez pas.{" "}
            <Link
              href="/politique-confidentialite#cookies-traceurs"
              className="underline decoration-aw-primary underline-offset-2"
            >
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={accept}
            className="cursor-pointer rounded-xl bg-aw-primary px-4 py-2.5 font-display tracking-[0.08em] text-aw-heading transition-colors hover:bg-aw-primary-hover"
          >
            Accepter
          </button>
          <button
            type="button"
            onClick={refuse}
            className="cursor-pointer rounded-xl border border-aw-heading/15 bg-aw-bg px-4 py-2.5 font-display tracking-[0.08em] text-aw-heading transition-colors hover:border-aw-primary"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
