<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $body = getRequestBody();
    $username = $body['username'] ?? '';
    $password = $body['password'] ?? '';

    // builtin credentials
    if ($username === 'lsinventory' && $password === 'ls') {
        $user = ['id' => 1, 'username' => 'lsinventory'];
        $token = makeToken(['sub' => $user['id'], 'username' => $user['username'], 'iat' => time()]);
        jsonResponse(['message' => 'Login successful', 'token' => $token, 'user' => $user]);
    }

    // fallback to DB users table if available
    global $pdo;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare('SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1');
            $stmt->execute([$username]);
            $row = $stmt->fetch();
            if ($row && password_verify($password, $row['password_hash'])) {
                $user = ['id' => (int)$row['id'], 'username' => $row['username']];
                $token = makeToken(['sub' => $user['id'], 'username' => $user['username'], 'iat' => time()]);
                jsonResponse(['message' => 'Login successful', 'token' => $token, 'user' => $user]);
            }
        } catch (Exception $e) {
            // ignore and fall through
        }
    }

    jsonResponse(['message' => 'Invalid credentials'], 401);
    exit;
}

jsonResponse(['error' => 'Method not allowed'], 405);
