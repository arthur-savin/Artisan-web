# Carte du site — Artisan-Web (arborescence cible)

Document de référence pour **structure des URLs**, **SEO**, **qualification utilisateur** et **évolution progressive**.  
À utiliser avec la charte `brand.md`.

---

## 1. Landing / page d’entrée

| URL | Rôle |
|-----|------|
| `/` | Accroche, storytelling, qualification utilisateur, redirection vers la page métier adaptée |

---

## 2. Page hub (recommandée)

| URL | Rôle |
|-----|------|
| `/site-web-artisan` | Page SEO globale (« site web artisan »), renvoie vers les pages métiers |

---

## 3. Pages piliers (cœur du site)

**Objectif :** ~10 pages max, chacune regroupe plusieurs métiers proches.

| URL pilier |
|------------|
| `/site-web-electricien` |
| `/site-web-plombier` |
| `/site-web-menuisier` |
| `/site-web-macon` |
| `/site-web-peintre-batiment` |
| `/site-web-couvreur` |
| `/site-web-facadier` |
| `/site-web-serrurier` |
| `/site-web-paysagiste` |
| `/site-web-renovation-maison` |

---

## 4. Structure interne type (template par pilier)

**Exemple :** `/site-web-plombier`

1. **Hero**
2. **Identification** des sous-métiers (ex. plombier / chauffagiste / clim)
3. **Problèmes** (douleurs client)
4. **Bénéfices**
5. **Sections spécifiques** par sous-métier (ex. plombier, chauffagiste, climaticien)
6. **CTA** (appel, devis, contact)

> Même squelette pour toutes les pages piliers → cohérence UX + production.

---

## 5. Évolution — pages satellites SEO (à ajouter plus tard)

Exemples pour le pilier plombier :

| URL satellite (exemples) |
|--------------------------|
| `/seo-plombier` |
| `/site-internet-plombier-exemple` |
| `/comment-trouver-clients-plombier` |
| `/prix-site-web-plombier` |

**Principe :** les déployer **progressivement** après stabilisation des piliers.

---

## 6. Schéma de parcours (vision simplifiée)

```txt
LANDING (/)
   ↓
CHOIX MÉTIER (qualification)
   ↓
PAGE PILIER (/site-web-…)
   ↓
(phase 2) PAGES SATELLITES SEO
```

---

## 7. Correspondance qualification → URL

Le système de qualification doit envoyer vers :

| Choix utilisateur | URL cible |
|-------------------|-----------|
| Électricien | `/site-web-electricien` |
| Plomberie | `/site-web-plombier` |
| Menuiserie | `/site-web-menuisier` |
| Maçonnerie | `/site-web-macon` |
| Finitions | `/site-web-peintre-batiment` |
| Toiture | `/site-web-couvreur` |
| Façade | `/site-web-facadier` |
| Serrurerie | `/site-web-serrurier` |
| Extérieur | `/site-web-paysagiste` |
| Rénovation | `/site-web-renovation-maison` |

---

## 8. Structure technique fichiers (alignement dev)

**Convention simple :** un fichier HTML par pilier sous `pages/`, servi ou réécrit vers les URLs ci-dessus selon l’hébergement.

```txt
/index.html

/pages/
  plombier.html
  electricien.html
  menuisier.html
  macon.html
  peintre.html
  couvreur.html
  facadier.html
  serrurier.html
  paysagiste.html
  renovation.html

/css/
  style.css

/js/
  app.js
```

**Note :** les **URLs publiques** restent celles des §1–3 (`/site-web-plombier`, etc.) ; les noms de fichiers peuvent être mappés via rewrite rules ou build.

---

## 9. Version MVP (livraison rapide)

Minimum viable avant d’étendre aux 10 piliers :

```txt
/
/site-web-plombier
/site-web-electricien
/site-web-menuisier
```

Puis ajouter les autres piliers selon priorité business / SEO.

---

## 10. Intérêt stratégique (rappel)

- **SEO :** pages ciblées par intention + maillage hub → piliers → satellites
- **UX :** choix métier clair, parcours court vers la conversion
- **Conversion :** un template pilier maîtrisé, contenu adapté par segment
- **Évolutivité :** satellites ajoutés sans casser l’architecture

---

## 11. Sitemap XML (production)

Quand le site est en ligne, prévoir un **`sitemap.xml`** à la racine (liste des URL absolues + `lastmod`) et le déclarer dans **Google Search Console** / robots crawl. Ce fichier Markdown reste la **référence métier** ; le `sitemap.xml` est la **référence technique** pour les moteurs.
