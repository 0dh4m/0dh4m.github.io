/**
 * Copyright (C) 2026 Adham Cherkaoui Eddeqaqi (0dh4m). All rights reserved.
 * Proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.
 * Author: Adham Cherkaoui Eddeqaqi (0dh4m) <adamcherkaoui99@gmail.com>
 * GitHub: https://github.com/0dh4m
 */

(() => {
  const $ = (id) => document.getElementById(id);
  const notice = $('vip-notice');
  let keys = [];

  function notify(message, kind = 'success') {
    notice.textContent = message;
    notice.dataset.kind = kind;
    notice.style.display = 'block';
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => { notice.style.display = 'none'; }, 5500);
  }

  async function api(path, options = {}) {
    const response = await fetch(path, { credentials: 'same-origin', ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (response.status === 401) { window.location.assign('/login'); throw new Error('Sign in to continue.'); }
    if (response.status === 403) { window.location.assign('/'); throw new Error('This account is not authorized for VIP management.'); }
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
    return data;
  }

  async function authorizePage() {
    const data = await api('/api/me', { headers: {} });
    if (!data.authenticated) { window.location.assign('/login'); return false; }
    if (!data.is_vip_admin) { window.location.assign('/'); return false; }
    $('vip-owner-name').textContent = `Signed in as ${data.username || 'VIP owner'}`;
    return true;
  }

  async function loadServers() {
    const data = await api('/api/guilds', { headers: {} });
    const select = $('vip-server');
    select.replaceChildren(new Option('Select a connected server…', ''));
    (data.guilds || []).forEach((guild) => select.add(new Option(guild.name || guild.id, String(guild.id))));
    if (!select.options.length || select.options.length === 1) select.options[0].textContent = 'No connected servers found';
  }

  function makeCell(row, value, className) {
    const cell = document.createElement('td');
    if (className) cell.className = className;
    cell.textContent = value == null ? '—' : String(value);
    row.appendChild(cell);
    return cell;
  }

  function renderKeys() {
    const body = $('vip-key-rows');
    const query = $('vip-key-search').value.trim().toLowerCase();
    const filtered = keys.filter((key) => [key.license_key, key.note, key.claimed_by_guild, key.bot_type].some((item) => String(item || '').toLowerCase().includes(query)));
    body.replaceChildren();
    if (!filtered.length) {
      const row = body.insertRow();
      const cell = row.insertCell(); cell.colSpan = 8; cell.className = 'vip-admin-empty'; cell.textContent = query ? 'No keys match that search.' : 'No license keys have been created yet.';
      return;
    }
    filtered.forEach((key) => {
      const row = body.insertRow();
      makeCell(row, key.license_key, 'vip-admin-key');
      makeCell(row, ({ all: 'Music + TempVoice', music: 'Music', tempvoice: 'TempVoice', voice: 'TempVoice' })[String(key.bot_type || 'all').toLowerCase()] || key.bot_type);
      makeCell(row, Number(key.days) >= 9999 ? 'Lifetime' : `${key.days} days`);
      const stateCell = makeCell(row, key.is_claimed ? 'Claimed' : 'Available');
      stateCell.textContent = '';
      const badge = document.createElement('span'); badge.className = `vip-admin-state${key.is_claimed ? ' claimed' : ''}`; badge.textContent = key.is_claimed ? 'Claimed' : 'Available'; stateCell.appendChild(badge);
      makeCell(row, key.claimed_by_guild || '—');
      makeCell(row, key.note || '—');
      makeCell(row, String(key.created_at || '').slice(0, 10) || '—');
      const action = row.insertCell();
      const revoke = document.createElement('button'); revoke.type = 'button'; revoke.className = 'cyber-btn btn-danger-ghost btn-xs'; revoke.textContent = 'Revoke'; revoke.disabled = !key.license_key;
      revoke.addEventListener('click', async () => {
        if (!window.confirm(`Revoke this ${key.is_claimed ? 'claimed' : 'unused'} key?`)) return;
        try { await api('/api/keys/revoke', { method: 'POST', body: JSON.stringify({ key: key.license_key }) }); notify('Key revoked.'); await loadKeys(); }
        catch (error) { notify(error.message, 'error'); }
      });
      action.appendChild(revoke);
    });
  }

  async function loadKeys() {
    const data = await api('/api/keys', { headers: {} });
    keys = data.keys || [];
    const stats = data.stats || {};
    $('vip-stat-servers').textContent = stats.premium_guilds ?? 0;
    $('vip-stat-available').textContent = stats.available_keys ?? 0;
    $('vip-stat-claimed').textContent = stats.claimed_keys ?? 0;
    renderKeys();
  }

  $('vip-key-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    button.disabled = true;
    try {
      const result = await api('/api/keys/generate', { method: 'POST', body: JSON.stringify({ bot_type: $('vip-key-tier').value, days: Number($('vip-key-days').value), count: Number($('vip-key-count').value), note: $('vip-key-note').value.trim() }) });
      $('vip-new-keys').value = (result.keys || []).join('\n');
      $('vip-key-output').style.display = 'block';
      $('vip-key-note').value = '';
      notify(`${result.count} license key${result.count === 1 ? '' : 's'} created. Copy and save them now.`);
      await loadKeys();
    } catch (error) { notify(error.message, 'error'); }
    finally { button.disabled = false; }
  });

  $('vip-copy-keys').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('vip-new-keys').value); notify('Keys copied. Store them securely.'); }
    catch (_) { $('vip-new-keys').focus(); $('vip-new-keys').select(); notify('Select and copy the keys manually.', 'error'); }
  });

  async function changeServerVip(action) {
    const guildId = $('vip-server').value;
    if (!guildId) { notify('Select a server first.', 'error'); return; }
    const tier = $('vip-server-tier').value;
    const tierLabel = tier === 'all' ? 'Music and TempVoice' : tier;
    if (action === 'revoke') {
      const warning = tier === 'all' ? ' This also removes claimed license keys for both plans.' : ' This also removes claimed keys for that plan.';
      if (!window.confirm(`Revoke ${tierLabel} VIP from this server?${warning}`)) return;
    }
    const button = $(action === 'grant' ? 'vip-grant' : 'vip-revoke'); button.disabled = true;
    try {
      const body = { guild_id: guildId, bot_type: tier };
      if (action === 'grant') body.days = Number($('vip-server-days').value);
      const result = await api(`/api/vip/${action}`, { method: 'POST', body: JSON.stringify(body) });
      notify(result.message || `VIP ${action} completed.`);
      await loadKeys();
    } catch (error) { notify(error.message, 'error'); }
    finally { button.disabled = false; }
  }

  $('vip-grant').addEventListener('click', () => changeServerVip('grant'));
  $('vip-revoke').addEventListener('click', () => changeServerVip('revoke'));
  $('vip-key-search').addEventListener('input', renderKeys);
  $('vip-refresh').addEventListener('click', async () => {
    try { await Promise.all([loadServers(), loadKeys()]); notify('VIP data refreshed.'); }
    catch (error) { notify(error.message, 'error'); }
  });

  (async () => {
    try {
      if (!(await authorizePage())) return;
      await Promise.all([loadServers(), loadKeys()]);
    } catch (error) { notify(error.message, 'error'); }
  })();
})();
