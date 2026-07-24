<?php
/**
 * Endpoint formulaire de contact — envoi sécurisé via Mailgun.
 * La clé API Mailgun ne doit jamais être exposée au client.
 *
 * Sécurités : Origin/Referer, CORS, rate limiting, honeypot, validation.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

/**
 * Cherche mailgun.php dans les emplacements Hostinger / locaux courants.
 */
function aw_resolve_mailgun_config(): ?string
{
    $candidates = [];

    $env = getenv('SECURE_CONFIG_PATH');
    if (is_string($env) && $env !== '') {
        $candidates[] = $env;
    }

    // Dossier parent de public_html (structure recommandée)
    // public_html/api -> public_html -> (parent)/secure-config
    $candidates[] = dirname(__DIR__, 2) . '/secure-config/mailgun.php';
    // Parfois secure-config est au même niveau que domains/
    $candidates[] = dirname(__DIR__, 3) . '/secure-config/mailgun.php';
    $candidates[] = dirname(__DIR__, 4) . '/secure-config/mailgun.php';
    // Fallback local projet
    $candidates[] = dirname(__DIR__) . '/../secure-config/mailgun.php';

    foreach ($candidates as $path) {
        $real = realpath($path);
        if ($real !== false && is_file($real)) {
            return $real;
        }
        if (is_file($path)) {
            return $path;
        }
    }

    return null;
}

$configPath = aw_resolve_mailgun_config();
if ($configPath === null) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Configuration mailing indisponible. Vérifiez secure-config/mailgun.php sur le serveur.',
        'code' => 'config_missing',
    ]);
    exit;
}

$config = require $configPath;

$allowedOrigins = $config['ALLOWED_ORIGINS'] ?? [];
$origin = rtrim((string)($_SERVER['HTTP_ORIGIN'] ?? ''), '/');
$referer = (string)($_SERVER['HTTP_REFERER'] ?? '');
$hostHeader = (string)($_SERVER['HTTP_HOST'] ?? '');

$allowOrigin = null;
foreach ($allowedOrigins as $allowed) {
    $allowed = rtrim((string)$allowed, '/');
    if ($origin !== '' && $origin === $allowed) {
        $allowOrigin = $allowed;
        break;
    }
}

if ($allowOrigin !== null) {
    header('Access-Control-Allow-Origin: ' . $allowOrigin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

/**
 * Autorise la requête si Origin OU Referer OU Host correspond à une origine autorisée.
 * (Avant: Origin ET Referer obligatoires → beaucoup de POST same-origin bloqués.)
 */
function aw_origin_allowed(string $origin, string $referer, string $host, array $allowedOrigins): bool
{
    foreach ($allowedOrigins as $allowed) {
        $allowed = rtrim((string)$allowed, '/');
        if ($allowed === '') {
            continue;
        }
        if ($origin !== '' && $origin === $allowed) {
            return true;
        }
        if ($referer !== '' && strpos($referer, $allowed) === 0) {
            return true;
        }
        $allowedHost = parse_url($allowed, PHP_URL_HOST);
        if (is_string($allowedHost) && $allowedHost !== '' && strcasecmp($host, $allowedHost) === 0) {
            return true;
        }
    }
    return false;
}

if (!aw_origin_allowed($origin, $referer, $hostHeader, $allowedOrigins)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'Origine non autorisée.', 'code' => 'origin_denied']);
    exit;
}

// ——— Rate limiting (10 requêtes / 10 minutes / IP)
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateLimitPath = $config['RATE_LIMIT_PATH'] ?? sys_get_temp_dir();
$rateLimitFile = rtrim((string)$rateLimitPath, '/\\') . DIRECTORY_SEPARATOR . 'form_rate_' . preg_replace('/[^a-fA-F0-9.:]/', '_', $ip) . '.json';
$windowSeconds = 600;
$maxRequests = 10;
$now = time();
$data = [];
if (is_file($rateLimitFile)) {
    $raw = @file_get_contents($rateLimitFile);
    if ($raw !== false) {
        $data = json_decode($raw, true) ?: [];
    }
}
$data['requests'] = $data['requests'] ?? [];
$data['requests'] = array_values(array_filter($data['requests'], fn($t) => $t > $now - $windowSeconds));
if (count($data['requests']) >= $maxRequests) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'message' => 'Trop de demandes. Réessayez plus tard.']);
    exit;
}
$data['requests'][] = $now;
@file_put_contents($rateLimitFile, json_encode($data), LOCK_EX);

// ——— Données POST (form-urlencoded ou JSON)
$input = $_POST;
$contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
if (empty($input) && stripos($contentType, 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw ?: '', true) ?: [];
}
if (empty($input) && stripos($contentType, 'application/x-www-form-urlencoded') !== false) {
    $raw = file_get_contents('php://input');
    if (is_string($raw) && $raw !== '') {
        parse_str($raw, $parsed);
        if (is_array($parsed)) {
            $input = $parsed;
        }
    }
}

// ——— Honeypot (nom volontairement peu autofillable)
$honeypotFields = ['company_website_url_hp', 'website', 'url', 'company_url', 'company_website', 'fax'];
foreach ($honeypotFields as $field) {
    if (!empty(trim((string)($input[$field] ?? '')))) {
        echo json_encode(['ok' => true, 'message' => 'Message envoyé avec succès.']);
        exit;
    }
}

$allowedFields = [
    'firstName' => 100, 'lastName' => 100, 'nom' => 200, 'email' => 254, 'phone' => 30, 'telephone' => 30,
    'job' => 100, 'city' => 100, 'ville' => 100, 'message' => 5000, 'requestType' => 50,
    'service' => 100, 'projet' => 100, 'rdv-date' => 20, 'rdv-heure' => 10, 'rdv-motif' => 2000,
    'rgpd' => 10, 'rdv-rgpd' => 10,
    'formId' => 80, 'pageUrl' => 500,
];
$cleaned = [];
foreach ($allowedFields as $key => $maxLen) {
    if (!isset($input[$key])) {
        continue;
    }
    $v = is_string($input[$key]) ? trim($input[$key]) : (string)$input[$key];
    if (strlen($v) > $maxLen) {
        $v = substr($v, 0, $maxLen);
    }
    $cleaned[$key] = $v;
}

$email = $cleaned['email'] ?? '';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Adresse email invalide.']);
    exit;
}

$phone = $cleaned['phone'] ?? $cleaned['telephone'] ?? '';
$name = trim(($cleaned['firstName'] ?? '') . ' ' . ($cleaned['lastName'] ?? $cleaned['nom'] ?? ''));
if ($name === '' || ($email === '' && $phone === '')) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Veuillez remplir au moins un nom et un moyen de contact (email ou téléphone).']);
    exit;
}

$formId = $cleaned['formId'] ?? '';
$pageUrl = $cleaned['pageUrl'] ?? '';
$lines = [];
$subjectPrefix = 'Contact site';
if ($formId !== '') {
    $subjectPrefix = '[Site] Nouvelle demande - ' . $formId;
}
$requestType = $cleaned['requestType'] ?? '';
if ($requestType !== '') {
    $subjectPrefix .= ' (' . $requestType . ')';
}
foreach ($cleaned as $k => $v) {
    if ($v === '' || in_array($k, $honeypotFields, true) || $k === 'formId' || $k === 'pageUrl') {
        continue;
    }
    $label = str_replace(['-', '_'], ' ', $k);
    $lines[] = ucfirst($label) . ': ' . $v;
}
if ($pageUrl !== '') {
    array_unshift($lines, 'Page: ' . $pageUrl);
}
$bodyText = implode("\n", $lines);
$bodyHtml = nl2br(htmlspecialchars($bodyText, ENT_QUOTES, 'UTF-8'));

$mailTo = $config['MAIL_TO'] ?? '';
$mailFrom = $config['MAIL_FROM'] ?? '';
$replyTo = $email !== '' ? $email : null;

$apiKey = $config['MAILGUN_API_KEY'] ?? '';
$domain = $config['MAILGUN_DOMAIN'] ?? '';

if ($mailTo === '' || $apiKey === '' || $domain === '' || strpos($apiKey, 'VOTRE_') === 0 || strpos($domain, 'VOTRE_') === 0) {
    error_log('[form.php] Mailgun non configuré (clé, domaine ou MAIL_TO manquant).');
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Envoi temporairement indisponible.', 'code' => 'mailgun_unconfigured']);
    exit;
}

// Empêche l'envoi avec un MAIL_FROM placeholder (souvent la cause d'échec silencieux côté Mailgun)
if (stripos($mailFrom, 'votredomaine.com') !== false || $mailFrom === '') {
    $mailFrom = 'Artisan-Web <postmaster@' . $domain . '>';
}

$url = 'https://api.mailgun.net/v3/' . $domain . '/messages';
$params = [
    'from' => $mailFrom,
    'to' => $mailTo,
    'subject' => $subjectPrefix . ' — ' . substr($name, 0, 50),
    'text' => $bodyText,
    'html' => '<html><body>' . $bodyHtml . '</body></html>',
];
if ($replyTo) {
    $params['h:Reply-To'] = $replyTo;
}

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $params,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Basic ' . base64_encode('api:' . $apiKey),
    ],
    CURLOPT_TIMEOUT => 15,
]);

$response = curl_exec($ch);
$httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $httpCode < 200 || $httpCode >= 300) {
    error_log('[form.php] Mailgun error HTTP ' . $httpCode . ' ' . $curlError . ' (no key logged).');
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'message' => 'L\'envoi a échoué côté service mailing. Vérifiez Mailgun (domaine, expéditeur, destinataires autorisés).',
        'code' => 'mailgun_http_' . $httpCode,
    ]);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Message envoyé avec succès.']);
exit;
