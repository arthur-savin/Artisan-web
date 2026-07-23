-- Artisan-Web — demandes « maquette gratuite »
-- MySQL 8+ / MariaDB 10.5+ (ex. hébergement Hostinger)

CREATE TABLE IF NOT EXISTS aw_maquette_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  source VARCHAR(40) NOT NULL DEFAULT 'page_maquette',

  prenom VARCHAR(120) NOT NULL,
  nom VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  telephone VARCHAR(40) NULL,
  entreprise VARCHAR(200) NULL,

  metier VARCHAR(160) NOT NULL,
  ville VARCHAR(200) NULL,
  besoin_principal VARCHAR(32) NOT NULL,

  message TEXT NULL,
  consent_rgpd TINYINT(1) NOT NULL DEFAULT 0,

  client_ip VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,

  PRIMARY KEY (id),
  KEY idx_maquette_created (created_at DESC),
  KEY idx_maquette_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
