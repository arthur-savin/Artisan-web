<?php
/**
 * Endpoint formulaire de contact — envoi sécurisé via Mailgun.
 * La clé API Mailgun ne doit jamais être exposée au client.
 *
 * Sécurités : Origin/Referer, CORS, rate limiting, honeypot, validation.
 */

declare(strict_types=1);

// ——— Chemin config (hors public_html). En local : fallback vers dossier secure-config du projet.
$configPath = getenv('SECURE_CONFIG_PATH') ?: null;
if ($configPath === null || $configPath === '') {
    $configPath = '/home/VOTRE_USER_HOSTINGER/secure-config/mailgun.php';
}
if (!is_file($configPath)) {
    $configPath = dirname(__DIR__, 2) . '/secure-config/mailgun.php';
}
if (!is_file($configPath)) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Configuration indisponible.']);
    exit;
}

$config = require $configPath;

// ——— En-têtes de sécurité et CORS
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = $config['ALLOWED_ORIGINS'] ?? [];
$allowOrigin = null;
foreach ($allowedOrigins as $allowed) {
    if ($origin === $allowed) {
        $allowOrigin = $allowed;
        break;
    }
}
if ($allowOrigin !== null) {
    header('Access-Control-Allow-Origin: ' . $allowOrigin);
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
}

// Répondre aux preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ——— Méthode POST uniquement
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// ——— Vérification Origin / Referer (anti-CSRF basique)
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$originOk = $allowOrigin !== null;
$refererOk = false;
foreach ($allowedOrigins as $allowed) {
    if (strpos($referer, $allowed) === 0) {
        $refererOk = true;
        break;
    }
}
if (!$originOk || !$refererOk) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'message' => 'Origine non autorisée.']);
    exit;
}

// ——— Rate limiting (10 requêtes / 10 minutes / IP)
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateLimitPath = $config['RATE_LIMIT_PATH'] ?? sys_get_temp_dir();
$rateLimitFile = rtrim($rateLimitPath, '/') . '/form_rate_' . preg_replace('/[^a-fA-F0-9.:]/', '_', $ip) . '.json';
$windowSeconds = 600; // 10 min
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
$data['requests'] = array_filter($data['requests'], fn($t) => $t > $now - $windowSeconds);
if (count($data['requests']) >= $maxRequests) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'message' => 'Trop de demandes. Réessayez plus tard.']);
    exit;
}
$data['requests'][] = $now;
@file_put_contents($rateLimitFile, json_encode($data), LOCK_EX);

// ——— Données POST (form-urlencoded ou JSON)
$input = $_POST;
if (empty($input) && strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?: [];
}

// ——— Honeypot : si rempli, retourner 204 sans rien faire (comportement “succès” silencieux)
$honeypotFields = ['website', 'url', 'company_url', 'company_website', 'fax'];
foreach ($honeypotFields as $field) {
    if (!empty(trim((string)($input[$field] ?? '')))) {
        http_response_code(204);
        exit;
    }
}

// ——— Validation : champs autorisés et tailles max
$allowedFields = [
    'firstName' => 100, 'lastName' => 100, 'nom' => 200, 'email' => 254, 'phone' => 30, 'telephone' => 30,
    'job' => 100, 'city' => 100, 'ville' => 100, 'message' => 5000, 'requestType' => 50,
    'service' => 100, 'projet' => 100, 'rdv-date' => 20, 'rdv-heure' => 10, 'rdv-motif' => 2000,
    'rgpd' => 10, 'rdv-rgpd' => 10,
    'formId' => 80, 'pageUrl' => 500,
];
$cleaned = [];
foreach ($allowedFields as $key => $maxLen) {
    if (!isset($input[$key])) continue;
    $v = is_string($input[$key]) ? trim($input[$key]) : (string)$input[$key];
    if (strlen($v) > $maxLen) $v = substr($v, 0, $maxLen);
    $cleaned[$key] = $v;
}

// Email valide si présent
$email = $cleaned['email'] ?? '';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Adresse email invalide.']);
    exit;
}

// Au moins un contact (email ou téléphone) et un nom ou prénom
$phone = $cleaned['phone'] ?? $cleaned['telephone'] ?? '';
$name = trim(($cleaned['firstName'] ?? '') . ' ' . ($cleaned['lastName'] ?? $cleaned['nom'] ?? ''));
if ($name === '' || ($email === '' && $phone === '')) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Veuillez remplir au moins un nom et un moyen de contact (email ou téléphone).']);
    exit;
}

// ——— Construction du corps email
$formId = $cleaned['formId'] ?? '';
$pageUrl = $cleaned['pageUrl'] ?? '';
$lines = [];
$subjectPrefix = 'Contact site';
if ($formId !== '') {
    $subjectPrefix = '[Site] Nouvelle demande - ' . $formId;
}
foreach ($cleaned as $k => $v) {
    if ($v === '' || in_array($k, $honeypotFields, true) || $k === 'formId' || $k === 'pageUrl') continue;
    $label = str_replace(['-', '_'], ' ', $k);
    $lines[] = ucfirst($label) . ': ' . $v;
}
if ($pageUrl !== '') {
    array_unshift($lines, 'Page: ' . $pageUrl);
}
$bodyText = implode("\n", $lines);
$bodyHtml = nl2br(htmlspecialchars($bodyText, ENT_QUOTES, 'UTF-8'));

$mailTo = $config['MAIL_TO'] ?? '';
$mailFrom = $config['MAIL_FROM'] ?? 'Site <noreply@example.com>';
$replyTo = $email ?: null;

$apiKey = $config['MAILGUN_API_KEY'] ?? '';
$domain = $config['MAILGUN_DOMAIN'] ?? '';
if ($apiKey === '' || $domain === '' || strpos($apiKey, 'VOTRE_') === 0 || strpos($domain, 'VOTRE_') === 0) {
    error_log('[form.php] Mailgun non configuré (clé ou domaine manquant).');
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Envoi temporairement indisponible.']);
    exit;
}

// ——— Envoi Mailgun (HTTP API)
$url = 'https://api.mailgun.net/v3/' . $domain . '/messages';
$params = [
    'from'    => $mailFrom,
    'to'      => $mailTo,
    'subject' => $subjectPrefix . ' — ' . substr($name, 0, 50),
    'text'    => $bodyText,
    'html'    => '<html><body>' . $bodyHtml . '</body></html>',
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
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'L\'envoi a échoué. Réessayez plus tard.']);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Message envoyé avec succès.']);
exit;
