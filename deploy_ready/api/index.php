<?php
require_once __DIR__ . '/../config.php';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api#', '', $uri);
$path = ltrim($path, '/');
if ($path === '' || $path === null) { jsonResponse(['message' => 'PHP API root']); }
$parts = explode('/', $path);
$resource = array_shift($parts);
$apiFile = __DIR__ . '/' . $resource . '.php';
if (file_exists($apiFile)) { require $apiFile; } else { http_response_code(404); header('Content-Type: application/json'); echo json_encode(['error' => 'Not found']); }
