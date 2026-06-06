<?php
// copy of php_api config.php adjusted for deploy-ready
$originalEnv = __DIR__ . '/../backend/config/.env';
$envPath = file_exists($originalEnv) ? $originalEnv : __DIR__ . '/backend_config.env';
$env = [];
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) == 2) { $key = trim($parts[0]); $value = trim($parts[1]); $env[$key] = $value; $_ENV[$key] = $value; }
    }
}
try {
    $dbHost = $env['DB_HOST'] ?? '127.0.0.1';
    $dbPort = $env['DB_PORT'] ?? '3306';
    $dbName = $env['DB_NAME'] ?? '';
    $dbUser = $env['DB_USER'] ?? '';
    $dbPass = $env['DB_PASSWORD'] ?? '';
    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
} catch (Exception $e) { $pdo = null; }
$JWT_SECRET = $env['JWT_SECRET'] ?? 'changeme';
function jsonResponse($data, $status = 200) { http_response_code($status); header('Content-Type: application/json'); echo json_encode($data); exit; }
function getRequestBody() { $raw = file_get_contents('php://input'); $data = json_decode($raw, true); return is_array($data) ? $data : []; }
function makeToken($payload) { global $JWT_SECRET; $header = base64_encode(json_encode(['alg' => 'HS256','typ' => 'JWT'])); $body = base64_encode(json_encode($payload)); $sig = hash_hmac('sha256', "$header.$body", $JWT_SECRET, true); $sigb = base64_encode($sig); return "$header.$body.$sigb"; }
function verifyToken($token) { global $JWT_SECRET; $parts = explode('.', $token); if (count($parts) !== 3) return false; list($header, $body, $sigb) = $parts; $calc = base64_encode(hash_hmac('sha256', "$header.$body", $JWT_SECRET, true)); if (!hash_equals($calc, $sigb)) return false; $payload = json_decode(base64_decode($body), true); return $payload; }
