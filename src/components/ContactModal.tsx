"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { useContactModal } from "@/context/ContactModalContext";

export function ContactModal() {
  const { open, type, closeModal } = useContactModal();
  const titleId = useId();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const isDevis = type === "devis";

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setMessage("");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (String(data.get("website") || "").trim()) {
      setStatus("success");
      setMessage("Merci, votre demande a bien été envoyée.");
      form.reset();
      return;
    }

    setStatus("loading");
    try {
      const body = new URLSearchParams();
      data.forEach((value, key) => {
        if (typeof value === "string") body.set(key, value);
      });
      body.set("formId", "contact");
      body.set("requestType", type);
      body.set("pageUrl", window.location.href);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.message || "Erreur d’envoi");
      }
      setStatus("success");
      setMessage(json.message || "Merci, votre demande a bien été envoyée.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Réessayez.",
      );
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-aw-heading/50 backdrop-blur-sm"
        aria-label="Fermer la fenêtre"
        onClick={closeModal}
      />
      <div className="relative w-full max-w-md rounded-3xl border border-aw-heading/10 bg-aw-surface p-6 shadow-card sm:p-8">
        <button
          type="button"
          className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-2xl text-aw-muted transition-colors hover:bg-aw-bg hover:text-aw-heading"
          aria-label="Fermer"
          onClick={closeModal}
        >
          ×
        </button>
        <h2
          id={titleId}
          className="font-display text-2xl tracking-[0.1em] text-aw-heading"
        >
          {isDevis ? "Demander un devis" : "Réserver un appel"}
        </h2>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px]"
            aria-hidden="true"
          />
          <div>
            <label
              htmlFor="firstName"
              className="mb-1.5 block text-sm font-medium text-aw-heading"
            >
              Prénom *
            </label>
            <input
              id="firstName"
              name="firstName"
              required
              autoComplete="given-name"
              className="w-full rounded-xl border border-aw-heading/15 bg-aw-bg px-4 py-3 text-aw-text outline-none transition-colors focus:border-aw-primary"
            />
          </div>
          {isDevis && (
            <>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1.5 block text-sm font-medium text-aw-heading"
                >
                  Nom *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  className="w-full rounded-xl border border-aw-heading/15 bg-aw-bg px-4 py-3 text-aw-text outline-none transition-colors focus:border-aw-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-aw-heading"
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-aw-heading/15 bg-aw-bg px-4 py-3 text-aw-text outline-none transition-colors focus:border-aw-primary"
                />
              </div>
            </>
          )}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-aw-heading"
            >
              Numéro de téléphone *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              className="w-full rounded-xl border border-aw-heading/15 bg-aw-bg px-4 py-3 text-aw-text outline-none transition-colors focus:border-aw-primary"
            />
          </div>
          {isDevis && (
            <>
              <div>
                <label
                  htmlFor="job"
                  className="mb-1.5 block text-sm font-medium text-aw-heading"
                >
                  Métier
                </label>
                <input
                  id="job"
                  name="job"
                  autoComplete="organization-title"
                  placeholder="Ex: Plombier, Menuisier..."
                  className="w-full rounded-xl border border-aw-heading/15 bg-aw-bg px-4 py-3 text-aw-text outline-none transition-colors focus:border-aw-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="mb-1.5 block text-sm font-medium text-aw-heading"
                >
                  Ville
                </label>
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Ex: Lyon, Paris..."
                  className="w-full rounded-xl border border-aw-heading/15 bg-aw-bg px-4 py-3 text-aw-text outline-none transition-colors focus:border-aw-primary"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full cursor-pointer rounded-xl bg-aw-primary px-5 py-3.5 font-display tracking-[0.1em] text-aw-heading transition-colors duration-200 hover:bg-aw-primary-hover disabled:opacity-70"
          >
            {status === "loading" ? "Envoi en cours…" : "Envoyer"}
          </button>
          {message && (
            <p
              role="alert"
              className={`rounded-lg px-3 py-2 text-sm ${
                status === "success"
                  ? "border border-green-200 bg-green-50 text-green-800"
                  : "border border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
