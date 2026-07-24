import { cpSync, existsSync, mkdirSync, rmSync, readdirSync, statSync } from "fs";
import { join } from "path";

const root = process.cwd();
const outDir = join(root, "out");
const publicHtml = join(root, "public_html");

if (!existsSync(outDir)) {
  console.error("Dossier out/ introuvable. Lance d'abord: npm run build");
  process.exit(1);
}

mkdirSync(publicHtml, { recursive: true });

// Conserve l'API PHP + fichiers serveur Hostinger
const keep = new Set(["api", ".htaccess", "robots.txt", "sitemap.xml"]);

for (const entry of readdirSync(publicHtml)) {
  if (keep.has(entry)) continue;
  rmSync(join(publicHtml, entry), { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  const st = statSync(src);
  if (st.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const child of readdirSync(src)) {
      copyRecursive(join(src, child), join(dest, child));
    }
  } else {
    cpSync(src, dest);
  }
}

for (const entry of readdirSync(outDir)) {
  copyRecursive(join(outDir, entry), join(publicHtml, entry));
}

console.log("Export synchronisé dans public_html/ (api/ PHP conservé).");
