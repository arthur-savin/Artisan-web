import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export HTML/CSS/JS pour Hostinger (hébergement classique public_html)
  output: "export",
  // Évite /_next/image (souvent cassé sur Hostinger) → fichiers images directs
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
