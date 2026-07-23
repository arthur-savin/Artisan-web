import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Conditions d'utilisation | Artisan-Web",
  description: "Conditions d'utilisation du site Artisan-Web.",
};

export default function ConditionsPage() {
  return (
    <div className="site-shell">
      <Header />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-32 sm:px-8">
        <p className="text-sm text-aw-muted">
          <Link href="/" className="underline decoration-aw-primary underline-offset-2">
            ← Retour à l’accueil
          </Link>
        </p>
        <h1 className="mt-6 font-display text-3xl tracking-[0.1em] text-aw-heading">
          Conditions d’utilisation
        </h1>
        <div className="mt-8 space-y-4 text-aw-text">
          <p>
            L’accès et l’utilisation du site artisan-web.com impliquent l’acceptation
            des présentes conditions. Le contenu est fourni à titre informatif.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
