# Charte de marque — Artisan-Web (site simplifié)

Document de référence pour audit design / reprise de contenu.  
Code source : `public_html/`.

---

## 1. Logo — fichier source

| Rôle | Chemin dans le projet | Format |
|------|------------------------|--------|
| Logo principal (header, hero, favicon, Open Graph) | `public_html/images/LOGOS/logotransparent.png` | PNG (fond transparent) |
| Autres visuels marque | *(dossier `images/` non versionné ou vide en local)* | — |

**Constat :** aucun fichier `.svg` n’est référencé dans le HTML/CSS du site. La **source « officielle » utilisée en production** est donc le PNG ci-dessus.  
Pour retrouver un **master vectoriel (Illustrator / SVG)** : chercher dans vos dossiers agence (ex. dépôt Git `Agence` : dossier type `logo artisan web/`) ou auprès du créateur du logo ; ce n’est pas dans ce dépôt `site_simplifie`.

---

## 2. Pages à auditer (priorité)

| Priorité | Fichier | Rôle |
|----------|---------|------|
| **Home** | `public_html/index.html` | Promesse, offres, preuves, contact (sections + modale) |
| **1 page service (pilier)** | `public_html/Pages-éléctriciens/site-web-electricien.html` | Page métier longue, SEO, CTA |
| **Contact (parcours)** | `index.html` → `#contact` + modale `#contactModal` + `public_html/api/form.php` | CTA + formulaire |

**Pages secondaires (légal / conformité) :**  
`mentions-legales.html`, `politique-confidentialite.html`, `conditions-utilisation.html`,  
`Pages-éléctriciens/pourquoi-electricien-besoin-site-web.html`,  
`Pages-éléctriciens/comment-clients-trouvent-electricien.html`.

---

## 3. Palette couleurs (hex réels)

Valeurs définies dans `public_html/style.css` (`:root`) et utilisées sur tout le site.

| Rôle | Variable CSS | Hex |
|------|----------------|-----|
| **Fond principal** | `--bg-main` | `#e9e3cf` |
| **Fond cartes / modale** | `--card-bg` | `#f2f0e4` |
| **Texte principal** | `--text-main` | `#353535` |
| **Secondaire (bleu gris — sous-titres, liens footer)** | `--accent-blue` | `#354157` |
| **Titres / contraste fort** | `--accent-blue-dark` | `#1e2433` |
| **Primaire / accents chauds (jaune/or)** | `--accent-yellow` | `#f8b532` |
| **Jaune clair (hover, chips)** | `--accent-yellow-light` | `#ffd36b` |
| **Prix / emphase rouge** | `--accent-red` | `#e2463b` |
| **CTA secondaire (fond bouton)** | *(hors variables, classe `.btn-secondary`)* | `#f6f2e2` |
| **Offre mise en avant (badge dégradé)** | *(hors `:root`)* | `#6271ff` → `#7c8aff` |

Gradients et overlays utilisent surtout ces couleurs en transparence (voir `body::before`, sections).

---

## 4. Typographies

| Usage | Police | Graisses chargées / utilisées |
|-------|--------|-------------------------------|
| **Titres, navigation, boutons, chips** | **Bebas Neue** | 400 (Google Fonts : une seule graisse pour cette famille) |
| **Corps, sous-titres hero, formulaires** | **Roboto** | **400** (corps), **500** (labels, intro « Notre savoir-faire », tags), **700** (icônes +/− FAQ via `summary::after`) |

**Lien Google Fonts (index) :**  
`Roboto:wght@400;500;700` + `Bebas+Neue`.

**Note :** la graisse **600** n’est pas utilisée dans `style.css` ; le site s’appuie sur **400 / 500 / 700** pour Roboto.

---

## 5. Textes business existants (copie brute)

### Promesse / positionnement

- Titre page : « Création site web artisan Lyon | Artisan-Web – dès 300 € + 15 €/mois »
- H1 hero : « Création de site web pour artisans à Lyon et en Auvergne-Rhône-Alpes — plus d’appels et de demandes de devis. à partir de 300 € »
- Sous-partie « Pourquoi » : « VOS CLIENTS VOUS TROUVENT PLUS FACILEMENT » + « Un site web qui fonctionne, sans complications ni jargon technique. Artisan-Web accompagne les artisans du bâtiment à Lyon et en Auvergne-Rhône-Alpes. »

### Offre

- **Offre de départ :** à partir de **300 €** ; vitrine 1 page, contenu adapté, SEO local, formulaire, livraison **10–15 jours ouvrés** ; **15 € / mois** de frais de service après acquisition.
- **Offre personnalisée :** sur devis ; pages illimitées selon besoins, services détaillés, SEO avancé, accompagnement stratégie web.

### Prix (rappel)

- **300 €** (départ) + **15 €/mois** (frais de service après achat du site).

### Preuves / réassurance

- « +50% de demandes » en moyenne après mise en ligne  
- « 10-15 jours » délai de livraison garanti  
- « SEO local inclus » — Google Business Profile optimisé  
- Secteurs : plombier, menuisier, électricien, maçon, peintre, etc.  
- Témoignage : Marc Dubois, plombier Lyon — « 3 demandes de devis la première semaine »

### CTA principaux

- « Je réserve un appel » / « Réserver un Appel »  
- « Demander un devis » / boutons modale  
- Footer contact : « Basés près de Lyon (Thurins)… » — adresse **400 chemin du Violet, 69510 Thurins**

---

## 6. Version « propre » — un bloc (Promesse + Offre + Prix + CTA)

**Artisan-Web crée des sites vitrines pour artisans du bâtiment à Lyon et en Auvergne-Rhône-Alpes, pour générer plus d’appels et de demandes de devis sans jargon technique.**  
**Offre de départ :** une page professionnelle clé en main, contenu adapté à votre métier, SEO local et formulaire de contact, livrée en 10 à 15 jours ouvrés.  
**À partir de 300 €**, puis **15 € par mois** de frais de service après l’achat du site.  
**Besoin d’aller plus loin ?** Offre personnalisée sur devis (multi-pages, SEO avancé, accompagnement).  
**CTA :** réservez un appel ou demandez un devis — nous sommes basés au **400 chemin du Violet, 69510 Thurins**.

---

## 7. Structure de cette charte (usage)

1. Logo & fichiers  
2. Pages pilier à auditer  
3. Couleurs (hex + sémantique)  
4. Typo (familles + graisses)  
5. Inventaire textes business  
6. Message synthétique (pitch)  
7. Kit technique → fichier `public_html/brand-tokens.css` (variables + classes typo)

---

## 8. Carte du site (arborescence & URLs)

Pour la **structure complète du site** (landing, hub SEO, pages piliers, satellites futurs, qualification → URL, convention fichiers `pages/`) : voir le fichier **`carte-du-site.md`** dans ce même dossier `information site web/`.  
Il sert de référence unique pour aligner contenu, dev et SEO.

---

## 9. Fichier technique associé

- **`public_html/brand-tokens.css`** — à charger **après** `style.min.css` si vous voulez les alias `--aw-*` et les utilitaires `.aw-typo-*` sans dupliquer la logique existante.
