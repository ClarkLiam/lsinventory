<?php
require_once __DIR__ . '/../config.php';
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';
$raw = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api/devices#', '', $raw);
$path = ltrim($path, '/');
$parts = $path === '' ? [] : explode('/', $path);
function dbOk() { global $pdo; return $pdo !== null; }
if ($method === 'GET') {
    if (count($parts) >= 1 && is_numeric($parts[0])) {
        $id = (int)$parts[0];
        if (!dbOk()) return jsonResponse(['error' => 'DB unavailable'], 503);
        $stmt = $pdo->prepare('SELECT id, inventory_number, description, status FROM devices WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row) jsonResponse($row); else jsonResponse(['error' => 'Not found'], 404);
    } else {
        if (!dbOk()) return jsonResponse(['error' => 'DB unavailable'], 503);
        $stmt = $pdo->query('SELECT id, inventory_number, description, status FROM devices ORDER BY id DESC');
        $rows = $stmt->fetchAll(); jsonResponse($rows);
    }
}
if ($method === 'POST') {
    $body = getRequestBody();
    $inv = $body['inventory_number'] ?? null;
    $desc = $body['description'] ?? null;
    $status = $body['status'] ?? 'available';
    if (!$inv) return jsonResponse(['error' => 'inventory_number required'], 400);
    if (!dbOk()) return jsonResponse(['error' => 'DB unavailable'], 503);
    $stmt = $pdo->prepare('INSERT INTO devices (inventory_number, description, status) VALUES (?, ?, ?)');
    $stmt->execute([$inv, $desc, $status]);
    $id = (int)$pdo->lastInsertId();
    jsonResponse(['id' => $id, 'inventory_number' => $inv, 'description' => $desc, 'status' => $status], 201);
}
if ($method === 'PUT' || $method === 'PATCH') {
    if (count($parts) < 1 || !is_numeric($parts[0])) return jsonResponse(['error' => 'id required'], 400);
    $id = (int)$parts[0];
    $body = getRequestBody();
    if (!dbOk()) return jsonResponse(['error' => 'DB unavailable'], 503);
    $stmt = $pdo->prepare('UPDATE devices SET inventory_number = ?, description = ?, status = ? WHERE id = ?');
    $stmt->execute([$body['inventory_number'] ?? null, $body['description'] ?? null, $body['status'] ?? null, $id]);
    jsonResponse(['updated' => true]);
}
if ($method === 'DELETE') {
    if (count($parts) < 1 || !is_numeric($parts[0])) return jsonResponse(['error' => 'id required'], 400);
    $id = (int)$parts[0];
    if (!dbOk()) return jsonResponse(['error' => 'DB unavailable'], 503);
    $stmt = $pdo->prepare('DELETE FROM devices WHERE id = ?');
    $stmt->execute([$id]);
    jsonResponse(['deleted' => true]);
}
jsonResponse(['error' => 'Method not allowed'], 405);
