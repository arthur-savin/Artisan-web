import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales | Artisan-Web",
  description: "Mentions légales du site Artisan-Web.",
};

export default function MentionsLegalesPage() {
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
          Mentions légales
        </h1>
        <div className="prose mt-8 max-w-none space-y-4 text-aw-text">
          <p>
            Éditeur du site : Artisan-Web — 400 chemin du Violet, 69510 Thurins.
          </p>
          <p>
            Pour le détail complet des mentions (hébergeur, contact, etc.), reportez-vous
            également à la version déployée sur artisan-web.com ou contactez-nous via le
            formulaire.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
