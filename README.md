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

### Variables (si Node + Mailgun plus tard)

| Variable | Rôle |
|----------|------|
| `MAILGUN_API_KEY` | Clé API Mailgun |
| `MAILGUN_DOMAIN` | Domaine Mailgun |
| `CONTACT_TO_EMAIL` | Destinataire des demandes |

## Structure utile

- `src/app` — pages & API
- `src/components` — UI
- `public/images` — médias
- `public_html/` — ancienne version HTML (archive)

## Scripts

- `npm run dev` — serveur de dev
- `npm run build` — build production
- `npm start` — démarrer le build
