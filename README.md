# Artisan-Web

Site vitrine **React + Next.js** pour Artisan-Web (création de sites pour artisans).

## Stack

- Next.js (App Router)
- React
- Tailwind CSS v4
- Contenu centralisé dans `src/data/site.json`

## Développement local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Production Hostinger (recommandé : site statique)

Hostinger affiche le site depuis `public_html/`.

```bash
npm run export:hostinger
```

Cela génère le site (HTML + CSS + images) dans `out/`, puis le copie dans `public_html/` (en gardant `public_html/api/` pour le formulaire PHP).

Puis pousse sur GitHub / déploie.

### Formulaire / Mailgun (obligatoire sur Hostinger)

1. Le fichier `public_html/api/form.php` doit être déployé (sinon erreur 404, aucun mail).
2. Place `secure-config/mailgun.php` **hors** `public_html` (ex. à côté de `public_html`).
3. Dans Mailgun :
   - `MAIL_FROM` doit utiliser ton domaine Mailgun (pas `votredomaine.com`)
   - en sandbox, autorise le destinataire `MAIL_TO` dans Authorized Recipients
4. Test : envoie une demande et vérifie qu’aucune erreur rouge n’apparaît dans la modale.

## Structure utile

- `src/app` — pages & API
- `src/components` — UI
- `public/images` — médias
- `public_html/` — ancienne version HTML (archive)

## Scripts

- `npm run dev` — serveur de dev
- `npm run build` — build production
- `npm start` — démarrer le build
