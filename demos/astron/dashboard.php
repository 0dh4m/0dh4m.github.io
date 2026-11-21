<?php
/**
 * Copyright (C) 2026 Adham Cherkaoui Eddeqaqi (0dh4m). All rights reserved.
 * Proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.
 * Author: Adham Cherkaoui Eddeqaqi (0dh4m) <adamcherkaoui99@gmail.com>
 * GitHub: https://github.com/0dh4m
 */

declare(strict_types=1);

$https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== '' && strtolower((string) $_SERVER['HTTPS']) !== 'off';
header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
header('Cache-Control: no-store, max-age=0');
if ($https) {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}

$backendEnv = trim((string) (getenv('ASTRON_BACKEND_PUBLIC_URL') ?: ''));
$requestHost = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$isLocalHost = in_array(preg_replace('/:\\d+$/', '', $requestHost), ['localhost', '127.0.0.1', '[::1]'], true);
$backend = $backendEnv !== '' ? $backendEnv : ($isLocalHost ? 'http://localhost:30103' : '');
$parts = parse_url($backend);
if (!is_array($parts) || !in_array(strtolower((string) ($parts['scheme'] ?? '')), ['http', 'https'], true)
    || empty($parts['host']) || isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment'])
    || !in_array((string) ($parts['path'] ?? ''), ['', '/'], true)
    || ($https && strtolower((string) $parts['scheme']) !== 'https' && !$isLocalHost)) {
    http_response_code(500);
    echo 'Astron backend URL is not configured correctly.';
    exit;
}
$backend = rtrim($backend, '/');
$indexPath = __DIR__ . '/index.html';
$html = is_file($indexPath) ? file_get_contents($indexPath) : false;
if ($html === false) {
    http_response_code(503);
    echo 'Astron dashboard is unavailable.';
    exit;
}
$safeBackend = htmlspecialchars($backend, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
echo str_replace('__ASTRON_API_BASE__', $safeBackend, $html);
