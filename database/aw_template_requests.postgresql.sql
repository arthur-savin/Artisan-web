-- Artisan-Web — demandes « modèle de site gratuit » (parcours / qualification)
-- PostgreSQL 12+
-- Créer une base dédiée puis : psql -f aw_template_requests.postgresql.sql

CREATE TABLE IF NOT EXISTS aw_template_requests (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Provenance (header, footer, page directe, etc.)
  source VARCHAR(40) NOT NULL DEFAULT 'direct',

  -- Contact
  prenom VARCHAR(120) NOT NULL,
  nom VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  telephone VARCHAR(40),
  entreprise VARCHAR(200),

  -- Réponses au « parcours » (mêmes clés que public_html/js/flow.js)
  profile VARCHAR(32) NOT NULL,
  acquisition VARCHAR(32) NOT NULL,
  trade VARCHAR(40) NOT NULL,
  goal VARCHAR(32) NOT NULL,

  message TEXT,
  consent_rgpd BOOLEAN NOT NULL DEFAULT FALSE,

  -- Copie JSON optionnelle pour historique / évolutions du formulaire
  journey_json JSONB,

  client_ip VARCHAR(45),
  user_agent VARCHAR(512)
);

CREATE INDEX IF NOT EXISTS idx_aw_template_requests_created
  ON aw_template_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_aw_template_requests_email
  ON aw_template_requests (email);

COMMENT ON TABLE aw_template_requests IS
  'Demandes de modèle gratuit : coordonnées + réponses qualification (alignées flow.js).';
