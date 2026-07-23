import type { Metadata } from "next";
import { Bebas_Neue, Roboto } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.artisan-web.com"),
  title: "Création site web artisan Lyon | Artisan-Web – dès 300 € + 15 €/mois",
  description:
    "Site internet artisan pas cher à Lyon et en Auvergne-Rhône-Alpes. Création de sites web pour plombiers, électriciens, menuisiers. Devis rapide, suivi constant. Dès 300 €.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Création site web artisan Lyon | Artisan-Web – dès 300 €",
    description:
      "Site internet pour artisans à Lyon et en Auvergne-Rhône-Alpes. Plus d'appels et de demandes de devis. Dès 300 € + 15 €/mois.",
    url: "https://www.artisan-web.com/",
    type: "website",
    images: ["/images/LOGOS/logotransparent.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Création site web artisan Lyon | Artisan-Web – dès 300 €",
    description:
      "Site internet pour artisans à Lyon et en Auvergne-Rhône-Alpes. Plus d'appels et de devis. Dès 300 €.",
    images: ["/images/LOGOS/logotransparent.png"],
  },
  icons: {
    icon: "/images/LOGOS/logotransparent.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Artisan-Web",
      url: "https://www.artisan-web.com",
      description:
        "Création de sites web pour artisans à Lyon et en Auvergne-Rhône-Alpes. Site vitrine dès 300 € + 15 €/mois.",
      publisher: { "@id": "https://www.artisan-web.com/#organization" },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.artisan-web.com/#organization",
      name: "Artisan-Web",
      url: "https://www.artisan-web.com",
      description:
        "Création de sites web pour artisans à Lyon et en Auvergne-Rhône-Alpes. Site internet plombier, électricien, menuisier, bâtiment. Dès 300 €.",
      image: "https://www.artisan-web.com/images/LOGOS/logotransparent.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: "400 chemin du Violet",
        addressLocality: "Thurins",
        postalCode: "69510",
        addressRegion: "Auvergne-Rhône-Alpes",
        addressCountry: "FR",
      },
      areaServed: [
        { "@type": "City", name: "Lyon" },
        {
          "@type": "AdministrativeArea",
          name: "Auvergne-Rhône-Alpes",
        },
      ],
      priceRange: "300€ + 15€/mois",
    },
    {
      "@type": "Service",
      name: "Création de site web pour artisans",
      description:
        "Site vitrine pour plombiers, électriciens, menuisiers et artisans du bâtiment à Lyon et en Auvergne-Rhône-Alpes. SEO local, formulaire de contact, livraison 10-15 jours.",
      provider: { "@id": "https://www.artisan-web.com/#organization" },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Auvergne-Rhône-Alpes",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${bebas.variable} ${roboto.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
