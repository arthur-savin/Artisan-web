import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Artisan-Web",
  description: "Politique de confidentialité Artisan-Web — RGPD et cookies.",
};

export default function PolitiquePage() {
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
          Politique de confidentialité
        </h1>
        <div className="mt-8 space-y-4 text-aw-text">
          <p>
            Artisan-Web traite vos données pour répondre à vos demandes de contact ou
            de devis. Aucun cookie de mesure d’audience n’est déposé sans votre
            consentement.
          </p>
          <h2
            id="cookies-traceurs"
            className="pt-4 font-display text-2xl tracking-[0.08em] text-aw-heading"
          >
            Cookies &amp; traceurs
          </h2>
          <p>
            Google Analytics (GA4) n’est chargé qu’après acceptation via le bandeau
            cookies.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
