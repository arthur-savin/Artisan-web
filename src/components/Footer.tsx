import Link from "next/link";
import site from "@/data/site.json";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-aw-heading/10 bg-aw-surface py-10">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-5 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div className="space-y-1 text-sm text-aw-muted">
          <p>
            © {year} {site.brand.name}. Tous droits réservés.
          </p>
          <p>Création de sites web pour artisans à Lyon et en Auvergne-Rhône-Alpes.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="/mentions-legales"
            className="cursor-pointer text-aw-muted transition-colors duration-200 hover:text-aw-heading"
          >
            Mentions légales
          </Link>
          <Link
            href="/politique-confidentialite"
            className="cursor-pointer text-aw-muted transition-colors duration-200 hover:text-aw-heading"
          >
            Politique de confidentialité
          </Link>
          <Link
            href="/conditions-utilisation"
            className="cursor-pointer text-aw-muted transition-colors duration-200 hover:text-aw-heading"
          >
            Conditions d’utilisation
          </Link>
        </div>
      </div>
    </footer>
  );
}
