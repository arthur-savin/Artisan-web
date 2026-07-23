<?php
/**
 * Enregistre une demande de modèle gratuit (SQLite local).
 * Hébergement PHP requis. Adapter le chemin $dbPath si besoin.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$dbPath = dirname(__DIR__) . '/data/aw_leads.sqlite';
$dbDir = dirname($dbPath);
if (!is_dir($dbDir)) {
    mkdir($dbDir, 0755, true);
}

$allowed = [
    'profile' => ['artisan', 'entreprise'],
    'acquisition' => ['bouche_oreille', 'google', 'plateformes', 'mix'],
    'trade' => [
        'electricite', 'plomberie', 'menuiserie', 'maconnerie', 'cloisons',
        'toiture', 'facade', 'serrurerie', 'amenagement_ext', 'renovation_globale',
    ],
    'goal' => ['appels', 'mieux_payes', 'google', 'planning'],
];

function field(string $key, int $max = 500): string
{
    $v = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
    if (mb_strlen($v) > $max) {
        $v = mb_substr($v, 0, $max);
    }
    return $v;
}

function requireEnum(string $key, array $allowedList): string
{
    $v = field($key, 64);
    if (!in_array($v, $allowedList, true)) {
        return '';
    }
    return $v;
}

$prenom = field('prenom', 120);
$nom = field('nom', 120);
$email = field('email', 254);
$telephone = field('telephone', 40);
$entreprise = field('entreprise', 200);
$message = field('message', 4000);
$source = field('source', 40);
if ($source === '') {
    $source = 'direct';
}

$profile = requireEnum('profile', $allowed['profile']);
$acquisition = requireEnum('acquisition', $allowed['acquisition']);
$trade = requireEnum('trade', $allowed['trade']);
$goal = requireEnum('goal', $allowed['goal']);
$consent = isset($_POST['consent_rgpd']) && $_POST['consent_rgpd'] === '1';

$honeypot = field('website', 200);
if ($honeypot !== '') {
    http_response_code(200);
    echo json_encode(['ok' => true]);
    exit;
}

if ($prenom === '' || $nom === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_contact']);
    exit;
}

if ($profile === '' || $acquisition === '' || $trade === '' || $goal === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_journey']);
    exit;
}

if (!$consent) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'consent_required']);
    exit;
}

$journey = [
    'profile' => $profile,
    'acquisition' => $acquisition,
    'trade' => $trade,
    'goal' => $goal,
];
$journeyJson = json_encode($journey, JSON_UNESCAPED_UNICODE);

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if (strlen($ip) > 45) {
    $ip = substr($ip, 0, 45);
}
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
if (strlen($ua) > 512) {
    $ua = substr($ua, 0, 512);
}

try {
    $pdo = new PDO('sqlite:' . $dbPath, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS aw_template_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            source TEXT NOT NULL,
            prenom TEXT NOT NULL,
            nom TEXT NOT NULL,
            email TEXT NOT NULL,
            telephone TEXT,
            entreprise TEXT,
            profile TEXT NOT NULL,
            acquisition TEXT NOT NULL,
            trade TEXT NOT NULL,
            goal TEXT NOT NULL,
            message TEXT,
            consent_rgpd INTEGER NOT NULL,
            journey_json TEXT,
            client_ip TEXT,
            user_agent TEXT
        )'
    );

    $stmt = $pdo->prepare(
        'INSERT INTO aw_template_requests (
            created_at, source, prenom, nom, email, telephone, entreprise,
            profile, acquisition, trade, goal, message, consent_rgpd,
            journey_json, client_ip, user_agent
        ) VALUES (
            :created_at, :source, :prenom, :nom, :email, :telephone, :entreprise,
            :profile, :acquisition, :trade, :goal, :message, :consent_rgpd,
            :journey_json, :client_ip, :user_agent
        )'
    );

    $now = gmdate('c');
    $stmt->execute([
        ':created_at' => $now,
        ':source' => $source,
        ':prenom' => $prenom,
        ':nom' => $nom,
        ':email' => $email,
        ':telephone' => $telephone !== '' ? $telephone : null,
        ':entreprise' => $entreprise !== '' ? $entreprise : null,
        ':profile' => $profile,
        ':acquisition' => $acquisition,
        ':trade' => $trade,
        ':goal' => $goal,
        ':message' => $message !== '' ? $message : null,
        ':consent_rgpd' => $consent ? 1 : 0,
        ':journey_json' => $journeyJson,
        ':client_ip' => $ip !== '' ? $ip : null,
        ':user_agent' => $ua !== '' ? $ua : null,
    ]);

    echo json_encode(['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server']);
}
