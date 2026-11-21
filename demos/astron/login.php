<?php
declare(strict_types=1);

$backendEnv = trim((string) (getenv('ASTRON_BACKEND_PUBLIC_URL') ?: ''));
$requestHost = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$isLocalHost = in_array(preg_replace('/:\\d+$/', '', $requestHost), ['localhost', '127.0.0.1', '[::1]'], true);
$backend = rtrim($backendEnv !== '' ? $backendEnv : ($isLocalHost ? 'http://localhost:30103' : ''), '/');
$dashboardHttps = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== '' && strtolower((string) $_SERVER['HTTPS']) !== 'off';
$publicUrl = trim((string) (getenv('DASHBOARD_PUBLIC_URL') ?: ''));
$parts = parse_url($backend);
if (!is_array($parts) || !in_array(strtolower((string) ($parts['scheme'] ?? '')), ['http', 'https'], true)
    || empty($parts['host']) || isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment'])
    || !in_array((string) ($parts['path'] ?? ''), ['', '/'], true)
    || ($dashboardHttps && strtolower((string) $parts['scheme']) !== 'https' && !$isLocalHost)) {
    http_response_code(500);
    exit('Astron backend URL is not configured correctly.');
}
if ($publicUrl === '') {
    if (!$isLocalHost) {
        http_response_code(500);
        exit('Set DASHBOARD_PUBLIC_URL to the public dashboard address.');
    }
    $scheme = (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') ? 'https' : 'http';
    $publicUrl = $scheme . '://' . (string) ($_SERVER['HTTP_HOST'] ?? 'localhost') . '/';
}
$publicParts = parse_url($publicUrl);
if (!is_array($publicParts) || !in_array(strtolower((string) ($publicParts['scheme'] ?? '')), ['http', 'https'], true)
    || empty($publicParts['host']) || isset($publicParts['user']) || isset($publicParts['pass']) || isset($publicParts['query']) || isset($publicParts['fragment'])
    || !in_array((string) ($publicParts['path'] ?? ''), ['', '/'], true)) {
    http_response_code(500);
    exit('Dashboard public URL is not configured correctly.');
}
$loginUrl = rtrim($backend, '/') . '/api/auth/login?redirect=' . rawurlencode($publicUrl);
$safeLoginUrl = htmlspecialchars($loginUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, max-age=0');
if ($dashboardHttps) {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>Sign in · Astron</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box}body{min-height:100vh;margin:0;display:grid;place-items:center;padding:24px;background:#f3f5f6;color:#26353c;font-family:'DM Sans',sans-serif}.login-card{width:min(100%,420px);padding:34px;background:#fff;border:1px solid #e5eaed;border-radius:16px;box-shadow:0 18px 55px rgba(27,47,57,.09)}.brand{display:flex;align-items:center;gap:12px;margin-bottom:35px}.mark{display:grid;width:42px;height:42px;place-items:center;color:#fff;background:#397d75;border-radius:12px;font:800 1.1rem Manrope,sans-serif}.brand strong{display:block;font:800 1rem Manrope,sans-serif;letter-spacing:.1em}.brand small{display:block;margin-top:3px;color:#819096;font-size:.68rem;letter-spacing:.08em}.eyebrow{margin:0 0 8px;color:#73858b;font-size:.67rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}h1{margin:0;color:#23343c;font:750 1.9rem/1.2 Manrope,sans-serif;letter-spacing:-.04em}.copy{margin:11px 0 25px;color:#6d7e84;font-size:.9rem;line-height:1.6}.login-button{display:flex;min-height:46px;align-items:center;justify-content:center;gap:10px;padding:10px 14px;color:#fff;background:#397d75;border-radius:8px;text-decoration:none;font-size:.86rem;font-weight:700;transition:background .15s}.login-button:hover{background:#2c6d66}.discord-mark{font-size:1.05rem}.foot{margin:20px 0 0;color:#89969b;font-size:.7rem;line-height:1.5;text-align:center}@media(prefers-color-scheme:dark){body{background:#11181c;color:#e1e9eb}.login-card{background:#182126;border-color:#29373d}h1{color:#e0e9eb}.copy,.foot{color:#a4b2b6}.eyebrow{color:#a0b0b5}}
  </style>
</head>
<body>
  <main class="login-card">
    <div class="brand"><span class="mark" aria-hidden="true">A</span><span><strong>ASTRON</strong><small>BOT MANAGEMENT</small></span></div>
    <p class="eyebrow">Secure workspace</p>
    <h1>Sign in to Astron</h1>
    <p class="copy">Use your Discord account to manage servers where you have permission. Astron only shows servers it can access.</p>
    <a class="login-button" href="<?= $safeLoginUrl ?>"><span class="discord-mark" aria-hidden="true">◉</span> Continue with Discord</a>
    <p class="foot">Your Discord password is never shared with Astron. Sign-in is handled by Discord OAuth.</p>
  </main>
</body>
</html>
