<?php
require_once __DIR__ . '/../config.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base = rtrim($_SERVER['DOCUMENT_ROOT'], '/');

// Expecting requests under /api/... when deployed at document root
$path = preg_replace('#^/api#', '', $uri);
$path = ltrim($path, '/');

if ($path === '' || $path === null) {
    header('Content-Type: application/json');
    echo json_encode(['message' => 'PHP API root']);
    exit;
}

$parts = explode('/', $path);
$resource = array_shift($parts);

// Route to api files
$apiFile = __DIR__ . '/../api/' . $resource . '.php';
if (file_exists($apiFile)) {
    require $apiFile;
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Not found']);
}
