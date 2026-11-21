/**
 * Copyright (C) 2026 Adham Cherkaoui Eddeqaqi (0dh4m). All rights reserved.
 * Proprietary and confidential. Unauthorized copying or distribution is strictly prohibited.
 * Author: Adham Cherkaoui Eddeqaqi (0dh4m) <0dh4mm@gmail.com>
 * GitHub: https://github.com/0dh4m
 */

/**
 * Astron Cybernetic Web Dashboard & Remote Player
 * Bi-directional WebSocket real-time synchronization with Discord Bot Cluster
 */

// ============================================================
// DYNAMIC HOST & BACKEND RESOLUTION
// Multi-Environment: Python port (30103) & XAMPP Apache (port 80)
// ============================================================
const BACKEND_PORT = 30103;
const apiBaseMeta = document.querySelector('meta[name="astron-api-base"]')?.content.trim() || '';
const configuredApiBase = apiBaseMeta.startsWith('__') ? '' : apiBaseMeta;
const API_BASE = configuredApiBase || (window.location.port == BACKEND_PORT ? '' : `${window.location.protocol}//${window.location.hostname}:${BACKEND_PORT}`);
const apiOrigin = new URL(API_BASE || window.location.origin, window.location.origin);
const WS_BASE = `${apiOrigin.protocol === 'https:' ? 'wss:' : 'ws:'}//${apiOrigin.host}`;

// Intercept window.fetch to route /api/* to API_BASE with credentials
const _originalFetch = window.fetch;
window.fetch = function(input, init = {}) {
  let targetUrl = input;
  if (typeof input === 'string') {
    if (input.startsWith('/api/')) {
      targetUrl = `${API_BASE}${input}`;
      if (!init.credentials) {
        init.credentials = 'include';
      }
    }
  } else if (input instanceof Request) {
    try {
      const parsed = new URL(input.url, window.location.origin);
      if (parsed.pathname.startsWith('/api/')) {
        targetUrl = `${API_BASE}${parsed.pathname}${parsed.search}`;
        if (!init.credentials) {
          init.credentials = 'include';
        }
      }
    } catch (_) {}
  }
  return _originalFetch(targetUrl, init);
};

// Global Dashboard State
const state = {
  authenticated: false,
  isAdmin: false,
  currentGuildId: null,
  activeBotId: 1, // 1 to 4
  guilds: [],
  guildsError: '',
  guildData: null,
  ws: null,
  wsConnected: false,
  visualizer: null,
  activeFilter: null,
  isSeeking: false,
  vipKeys: [],
  vipActiveFilter: 'all',
  clusterError: false,
};

// UI Element Selectors
const el = {
  tabMusic: document.getElementById('tab-btn-music'),
  tabVoice: document.getElementById('tab-btn-voice'),
  tabVip: document.getElementById('tab-btn-vip'),
  paneMusic: document.getElementById('pane-music'),
  paneVoice: document.getElementById('pane-voice'),
  paneVip: document.getElementById('pane-vip'),
  guildSelector: document.getElementById('guild-selector'),
  btnRefreshGuilds: document.getElementById('btn-refresh-guilds'),
  fleetStatusText: document.getElementById('fleet-status-text'),
  selectVoiceChannel: document.getElementById('select-voice-channel'),
  btnSummonBot: document.getElementById('btn-summon-bot'),
  latencyText: document.getElementById('latency-text'),
  userName: document.getElementById('user-name'),
  userAvatar: document.getElementById('user-avatar'),
  btnDiscordLogin: document.getElementById('btn-discord-login'),
  userProfileChip: document.getElementById('user-profile-chip'),

  // VIP Elements
  statVipClaimed: document.getElementById('stat-vip-claimed'),
  statVipAvailable: document.getElementById('stat-vip-available'),
  statVipTotalKeys: document.getElementById('stat-vip-total-keys'),
  statVipRevenue: document.getElementById('stat-vip-revenue'),
  selectKeyTier: document.getElementById('select-key-tier'),
  selectKeyDuration: document.getElementById('select-key-duration'),
  inputKeyCount: document.getElementById('input-key-count'),
  inputKeyNote: document.getElementById('input-key-note'),
  btnGenerateKeys: document.getElementById('btn-generate-keys'),
  generatedOutputBox: document.getElementById('generated-output-box'),
  generatedKeysTextarea: document.getElementById('generated-keys-textarea'),
  btnCopyGenerated: document.getElementById('btn-copy-generated'),
  selectDirectGuild: document.getElementById('select-direct-guild'),
  selectDirectTier: document.getElementById('select-direct-tier'),
  selectDirectDays: document.getElementById('select-direct-days'),
  btnDirectGrant: document.getElementById('btn-direct-grant'),
  btnDirectRevoke: document.getElementById('btn-direct-revoke'),
  webhookEndpointUrl: document.getElementById('webhook-endpoint-url'),
  btnCopyWebhookUrl: document.getElementById('btn-copy-webhook-url'),
  btnTestWebhook: document.getElementById('btn-test-webhook'),
  webhookTestResult: document.getElementById('webhook-test-result'),
  webhookTestStatus: document.getElementById('webhook-test-status'),
  webhookTestBody: document.getElementById('webhook-test-body'),
  vaultKeyCounter: document.getElementById('vault-key-counter'),
  inputVaultSearch: document.getElementById('input-vault-search'),
  btnRefreshVault: document.getElementById('btn-refresh-vault'),
  keysTableBody: document.getElementById('keys-table-body'),

  // Music Elements
  nodesGrid: document.getElementById('nodes-grid'),
  playerHeroCard: document.querySelector('.player-hero-card'),
  vinylDisc: document.getElementById('vinyl-disc'),
  currentCover: document.getElementById('current-cover'),
  currentTitle: document.getElementById('current-title'),
  currentUploader: document.getElementById('current-uploader'),
  currentBotChip: document.getElementById('current-bot-chip'),
  currentChannelChip: document.getElementById('current-channel-chip'),
  liveStreamBadge: document.getElementById('live-stream-badge'),

  // Scrub Bar
  timeElapsed: document.getElementById('time-elapsed'),
  timeTotal: document.getElementById('time-total'),
  scrubBar: document.getElementById('scrub-bar'),
  scrubFill: document.getElementById('scrub-fill'),
  scrubHandle: document.getElementById('scrub-handle'),

  // Transport
  btnPlayPause: document.getElementById('btn-play-pause'),
  playIcon: document.getElementById('play-icon'),
  btnPrev: document.getElementById('btn-prev'),
  btnSkip: document.getElementById('btn-skip'),
  btnStop: document.getElementById('btn-stop'),
  btnRewind: document.getElementById('btn-rewind'),
  btnForward: document.getElementById('btn-forward'),
  btnLoop: document.getElementById('btn-loop'),
  loopStateText: document.getElementById('loop-state-text'),
  btnShuffle: document.getElementById('btn-shuffle'),
  btnMute: document.getElementById('btn-mute'),
  volumeSlider: document.getElementById('volume-slider'),
  volLabel: document.getElementById('vol-label'),

  // Search & Radio
  inputSearch: document.getElementById('input-search'),
  btnInstantPlay: document.getElementById('btn-instant-play'),
  btnEnqueue: document.getElementById('btn-enqueue'),
  radioStationsGrid: document.getElementById('radio-stations-grid'),

  // Queue
  queueTrackList: document.getElementById('queue-track-list'),
  queueCounter: document.getElementById('queue-counter'),
  btnClearQueue: document.getElementById('btn-clear-queue'),

  // TempVoice Elements
  statActiveRooms: document.getElementById('stat-active-rooms'),
  statTotalCreated: document.getElementById('stat-total-created'),
  statTalkTime: document.getElementById('stat-talk-time'),
  statPlanName: document.getElementById('stat-plan-name'),
  voiceRoomsGrid: document.getElementById('voice-rooms-grid'),
  btnRefreshRooms: document.getElementById('btn-refresh-rooms'),
  btnSyncDiscordPanel: document.getElementById('btn-sync-discord-panel'),

  // Modal Rename
  renameModal: document.getElementById('rename-modal'),
  inputNewChannelName: document.getElementById('input-new-channel-name'),
  modalCloseRename: document.getElementById('modal-close-rename'),
  btnCancelRename: document.getElementById('btn-cancel-rename'),
  btnConfirmRename: document.getElementById('btn-confirm-rename'),

  toastContainer: document.getElementById('toast-container'),
};

let renameTargetChannelId = null;

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  setupTheme();
  buildWorkspaceNavigation();
  addWorkspacePageHeadings();
  setupTabs();
  setupFeatureWorkspace();
  setupCommandPalette();
  setupVisualizer();
  setupTransportEvents();
  setupFxSwitches();
  setupSearchAndRadio();
  setupTempVoiceEvents();
  setupVipEvents();
  setupSummonEvents();

  await loadUserAuth();
  const savedTab = localStorage.getItem('astron_last_active_tab');
  if (savedTab && document.getElementById(`pane-${savedTab}`) && (savedTab !== 'vip' || state.isAdmin)) switchTab(savedTab);
  await loadClusterBots();
  await loadGuilds();
  if (state.authenticated) initWebSocket();
  renderOverview();

  // Periodic health ping for bot nodes
  setInterval(loadClusterBots, 5000);
});

function setupTheme() {
  const toggle = document.getElementById('btn-theme-toggle');
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('astron_theme') || 'light'; } catch (_) {}

  const applyTheme = (theme) => {
    const dark = theme === 'dark';
    document.body.classList.toggle('theme-dark', dark);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      toggle.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    }
  };
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  toggle?.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('astron_theme', next); } catch (_) {}
  });
}

function setupFeatureWorkspace() {
  const add = (pane, id, markup) => {
    const root = document.getElementById(`pane-${pane}`);
    if (root && !document.getElementById(id)) root.insertAdjacentHTML('beforeend', `<section class="cyber-card astron-feature-card" id="${id}">${markup}</section>`);
  };
  add('overview', 'astron-ops-card', `<div class="card-head"><div><h3 class="card-heading">Server readiness</h3><p class="card-sub">Bot status, permissions and setup checks for this server</p></div><button class="cyber-btn btn-ghost btn-sm" id="feature-refresh">Refresh</button></div><div id="feature-diagnostics" class="feature-list">Choose a server to run checks.</div><div class="cyber-form-group feature-inline"><label class="cyber-label" for="feature-language">Server language</label><select id="feature-language" class="cyber-select"><option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option></select><button class="cyber-btn btn-cyan" id="feature-save-language">Save</button></div><div class="card-head"><div><h3 class="card-heading">Recent activity</h3><p class="card-sub">Audit events from this server</p></div></div><div id="feature-events" class="feature-list">No activity loaded.</div><div class="card-head"><div><h3 class="card-heading">Discord notifications & webhooks</h3><p class="card-sub">Choose a bot channel or add an encrypted Discord webhook. Payments use the secure inbound endpoint.</p></div></div><div class="feature-inline"><select id="feature-notify-channel" class="cyber-select"><option value="">Choose notification channel (optional)</option></select><input id="feature-webhook-url" type="url" class="cyber-input" autocomplete="off" placeholder="https://discord.com/api/webhooks/…"><label><input type="checkbox" value="moderation" class="feature-notify-type" checked> Moderation</label><label><input type="checkbox" value="tickets" class="feature-notify-type" checked> Tickets</label><label><input type="checkbox" value="backups" class="feature-notify-type"> Backups</label><label><input type="checkbox" value="bot_offline" class="feature-notify-type"> Bot offline</label><label><input type="checkbox" value="music_errors" class="feature-notify-type"> Music errors</label><button class="cyber-btn btn-cyan" id="feature-save-integration">Save notifications</button><button class="cyber-btn btn-ghost" id="feature-test-integration">Send test</button><span id="feature-webhook-state"></span></div>`);
  add('music', 'astron-music-library', `<div class="card-head"><div><h3 class="card-heading">Music library & schedules</h3><p class="card-sub">Save tracks to personal playlists, view history, and schedule playback</p></div></div><div class="feature-inline"><input id="feature-playlist-name" class="cyber-input" placeholder="Playlist name"><button class="cyber-btn btn-cyan" id="feature-save-track">Save current search</button><select id="feature-playlist-select" class="cyber-select"><option value="">Your playlists</option></select><button class="cyber-btn btn-ghost" id="feature-load-playlist">View</button><button class="cyber-btn btn-ghost" id="feature-delete-playlist">Delete playlist</button></div><div id="feature-playlist-items" class="feature-list"></div><div class="feature-inline"><label class="cyber-label" for="feature-timer-minutes">Stop playback after</label><input id="feature-timer-minutes" type="number" min="0" max="1440" class="cyber-input" placeholder="Minutes"><button class="cyber-btn btn-ghost" id="feature-set-timer">Set timer</button><input id="feature-schedule-query" class="cyber-input" placeholder="Track or radio URL"><input id="feature-schedule-time" type="datetime-local" class="cyber-input"><label><input id="feature-schedule-repeat" type="checkbox"> Repeat daily</label><button class="cyber-btn btn-cyan" id="feature-add-schedule">Schedule</button></div><div id="feature-music-schedules" class="feature-list"></div><h4 class="card-heading">Recently played</h4><div id="feature-music-history" class="feature-list"></div>`);
  add('moderation', 'astron-moderation-tools', `<div class="card-head"><div><h3 class="card-heading">Member actions & audit log</h3><p class="card-sub">Warn, timeout, kick, ban or manage roles with a recorded reason</p></div></div><div class="feature-inline"><input id="feature-mod-target" class="cyber-input" inputmode="numeric" placeholder="Member ID"><select id="feature-mod-action" class="cyber-select"><option value="warn">Warn</option><option value="mute">Timeout</option><option value="kick">Kick</option><option value="ban">Ban</option><option value="unban">Unban</option><option value="role_add">Add role</option><option value="role_remove">Remove role</option></select><select id="feature-mod-role" class="cyber-select"><option value="">Role (when needed)</option></select><input id="feature-mod-duration" class="cyber-input" type="number" min="1" max="40320" value="60" placeholder="Timeout minutes"><input id="feature-mod-reason" class="cyber-input" maxlength="500" placeholder="Reason"><button id="feature-mod-submit" class="btn-glow-danger">Apply action</button></div><div id="feature-moderation-cases" class="feature-list"></div>`);
  add('tickets', 'astron-ticket-inbox', `<div class="card-head"><div><h3 class="card-heading">Open ticket inbox</h3><p class="card-sub">Claim, reply, close and download saved conversation transcripts</p></div><button id="feature-ticket-refresh" class="cyber-btn btn-ghost">Refresh</button></div><div id="feature-ticket-list" class="feature-list">No tickets loaded.</div>`);
  add('backups', 'astron-backup-tools', `<div class="card-head"><div><h3 class="card-heading">Scheduled backups & comparison</h3><p class="card-sub">Set an automatic snapshot cadence and inspect changes between backups</p></div></div><div class="feature-inline"><select id="feature-backup-interval" class="cyber-select"><option value="6">Every 6 hours</option><option value="12">Every 12 hours</option><option value="24" selected>Daily</option><option value="168">Weekly</option></select><button id="feature-backup-schedule" class="cyber-btn btn-cyan">Schedule backups</button><select id="feature-backup-first" class="cyber-select"><option value="">Older backup</option></select><select id="feature-backup-second" class="cyber-select"><option value="">Newer backup</option></select><button id="feature-backup-compare" class="cyber-btn btn-ghost">Compare</button></div><div id="feature-backup-schedule-status" class="feature-list"></div><div id="feature-backup-result" class="feature-list"></div><div class="feature-list">Partial restore is available by choosing roles, categories, or channels in the restore prompt. Restoring only recreates missing items.</div>`);
  const memberInput = document.getElementById('feature-mod-target');
  if (memberInput) {
    memberInput.setAttribute('list', 'feature-member-options');
    memberInput.insertAdjacentHTML('afterend', '<datalist id="feature-member-options"></datalist>');
    let memberSearchTimer;
    memberInput.addEventListener('input', () => { clearTimeout(memberSearchTimer); memberSearchTimer = setTimeout(() => loadMemberSuggestions(memberInput.value), 250); });
  }
  document.getElementById('feature-schedule-query')?.insertAdjacentHTML('afterend', '<select id="feature-schedule-station" class="cyber-select"><option value="">Or choose a radio station</option></select>');
  document.getElementById('feature-refresh')?.addEventListener('click', loadFeatureWorkspace);
  document.getElementById('feature-save-language')?.addEventListener('click', saveGuildLanguage);
  document.getElementById('feature-save-integration')?.addEventListener('click', saveGuildIntegration);
  document.getElementById('feature-test-integration')?.addEventListener('click', testGuildIntegration);
  document.getElementById('feature-save-track')?.addEventListener('click', saveTrackToPlaylist);
  document.getElementById('feature-load-playlist')?.addEventListener('click', loadPlaylistSongs);
  document.getElementById('feature-delete-playlist')?.addEventListener('click', deletePlaylist);
  document.getElementById('feature-set-timer')?.addEventListener('click', setMusicTimer);
  document.getElementById('feature-add-schedule')?.addEventListener('click', addMusicSchedule);
  document.getElementById('feature-mod-submit')?.addEventListener('click', submitModerationAction);
  document.getElementById('feature-ticket-refresh')?.addEventListener('click', loadTicketInbox);
  document.getElementById('feature-backup-schedule')?.addEventListener('click', scheduleBackups);
  document.getElementById('feature-backup-compare')?.addEventListener('click', compareBackups);
}

async function featureJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function loadFeatureWorkspace() {
  const guildId = state.currentGuildId;
  if (!guildId) return;
  const tasks = [
    featureJson(`/api/guild/${guildId}/diagnostics`).then(renderDiagnostics),
    featureJson(`/api/guild/${guildId}/events`).then(renderDashboardEvents),
    featureJson(`/api/guild/${guildId}/settings`).then(d => { const input = document.getElementById('feature-language'); if (input) { input.value = d.language || 'en'; applyDashboardLanguage(d.language || 'en'); } }),
    featureJson(`/api/guild/${guildId}/integration`).then(renderIntegration),
    featureJson(`/api/guild/${guildId}/music/history`).then(renderMusicHistory),
    featureJson(`/api/guild/${guildId}/music/schedules`).then(renderMusicSchedules),
    featureJson(`/api/guild/${guildId}/moderation/cases`).then(renderModerationCases),
    featureJson(`/api/guild/${guildId}/members`).then(renderMemberSuggestions),
    loadTicketInbox(),
    featureJson(`/api/guild/${guildId}/backups/schedule`).then(d => { const box = document.getElementById('feature-backup-schedule-status'); if (box) box.innerHTML = (d.schedules || []).map(s => `<div class="feature-row"><span>Next snapshot: ${escapeHtml(new Date(s.next_run).toLocaleString())} · every ${s.interval_hours} hours</span><button class="cyber-btn btn-ghost" onclick="removeBackupSchedule(${s.schedule_id})">Cancel</button></div>`).join('') || 'No automatic backup schedule configured.'; })
  ];
  try { await Promise.allSettled(tasks); } catch (_) {}
  try {
    const eco = await featureJson(`/api/guild/${guildId}/ecosystem`);
    const channel = document.getElementById('feature-notify-channel');
    const role = document.getElementById('feature-mod-role');
    if (channel) { channel.innerHTML = `<option value="">Choose notification channel</option>` + (eco.channels || []).filter(c => c.type === 'text').map(c => `<option value="${c.id}">#${escapeHtml(String(c.name))}</option>`).join(''); if (channel.dataset.selected) channel.value = channel.dataset.selected; }
    if (role) role.innerHTML = `<option value="">Role (when needed)</option>` + (eco.roles || []).map(r => `<option value="${r.id}">${escapeHtml(String(r.name))}</option>`).join('');
  } catch (_) {}
  try { const guildData=await featureJson(`/api/guild/${guildId}`); const stations=document.getElementById('feature-schedule-station'); if(stations) stations.innerHTML='<option value="">Or choose a radio station</option>'+Object.entries(guildData.stations||{}).map(([id,s])=>`<option value="${escapeHtml(String(id))}">${escapeHtml(String(s.name||id))}</option>`).join(''); } catch (_) {}
  try { const playlists = await featureJson('/api/music/playlists'); const select = document.getElementById('feature-playlist-select'); if (select) select.innerHTML = `<option value="">Your playlists</option>` + (playlists.playlists || []).map(p => `<option value="${escapeHtml(String(p.playlist_name))}">${escapeHtml(String(p.playlist_name))} (${p.count})</option>`).join(''); } catch (_) {}
  try { const data = await featureJson(`/api/guild/${guildId}/ecosystem`); const selectIds = ['feature-backup-first','feature-backup-second']; selectIds.forEach(id => { const select = document.getElementById(id); if (select) { const label = id.endsWith('first') ? 'Older backup' : 'Newer backup'; select.innerHTML = `<option value="">${label}</option>` + (data.backups || []).map(b => `<option value="${escapeHtml(String(b.backup_id))}">${escapeHtml(String(b.backup_name))} · ${new Date(b.created_at).toLocaleString()}</option>`).join(''); } }); } catch (_) {}
}

function renderDiagnostics(d) {
  const el = document.getElementById('feature-diagnostics'); if (!el) return;
  const checks=[{ok:d.online,text:d.online?'Bot is online':'Bot connection is offline'},{ok:Boolean(d.permissions?.manage_channels),text:'Manage Channels for tickets and backups'},{ok:Boolean(d.permissions?.manage_roles),text:'Manage Roles for assigning roles and backups'},{ok:Boolean(d.permissions?.moderate_members),text:'Moderate Members for timeouts'},{ok:(d.channels||0)>0,text:'Server channels are visible to the bot'}];
  const invite='https://discord.com/oauth2/authorize?client_id=1558704012499488778&scope=bot%20applications.commands&permissions=0';
  el.innerHTML = `<div><strong>${d.online ? '● Bot online' : '○ Bot offline'}</strong> · ${d.guild_found ? escapeHtml(String(d.bot_name || 'Astron')) : 'Bot not found in this server'}</div><div>${d.channels || 0} channels · ${d.roles || 0} roles</div><div class="feature-checklist">${checks.map(c=>`<span>${c.ok?'✓':'○'} ${c.text}</span>`).join('')}</div>${!d.guild_found?`<p><a href="${invite}" target="_blank" rel="noopener noreferrer">Invite Astron to this server</a> · Grant only the permissions your selected features need.</p>`:''}`;
}
function renderDashboardEvents(d) { const el = document.getElementById('feature-events'); if (el) el.innerHTML = (d.events || []).slice(0,12).map(e => `<div class="feature-row"><strong>${escapeHtml(String(e.event_type))}</strong><span>${escapeHtml(String(e.details))}</span><time>${escapeHtml(String(e.created_at))}</time></div>`).join('') || 'No recorded events yet.'; }
function renderMusicHistory(d) { const el = document.getElementById('feature-music-history'); if (el) el.innerHTML = (d.history || []).slice(0,10).map(x => `<div class="feature-row"><strong>${escapeHtml(String(x.title))}</strong><time>${escapeHtml(String(x.played_at))}</time></div>`).join('') || 'No playback history yet.'; }
function renderMusicSchedules(d) { const el = document.getElementById('feature-music-schedules'); if (el) el.innerHTML = (d.schedules || []).filter(x=>x.enabled).map(x => `<div class="feature-row"><strong>${escapeHtml(String(x.label || x.query || x.station_id))}</strong><time>${new Date(x.starts_at).toLocaleString()}</time><button class="cyber-btn btn-ghost" onclick="removeMusicSchedule(${x.schedule_id})">Cancel</button></div>`).join('') || 'No scheduled playback.'; }
function renderModerationCases(d) { const el = document.getElementById('feature-moderation-cases'); if (el) el.innerHTML = (d.cases || []).slice(0,30).map(x => `<div class="feature-row"><strong>#${x.case_id} ${escapeHtml(String(x.action))} · ${escapeHtml(String(x.target_id))}</strong><span>${escapeHtml(String(x.reason))}</span><time>${escapeHtml(String(x.created_at))}</time></div>`).join('') || 'No moderation cases recorded.'; }
function renderMemberSuggestions(d) { const list=document.getElementById('feature-member-options'); if(list) list.innerHTML=(d.members||[]).map(m=>`<option value="${escapeHtml(String(m.id))}" label="${escapeHtml(String(m.name))}${m.roles?.length?` · ${escapeHtml(m.roles.join(', '))}`:''}"></option>`).join(''); }
async function loadMemberSuggestions(query='') { try { renderMemberSuggestions(await featureJson(`/api/guild/${state.currentGuildId}/members?q=${encodeURIComponent(query)}`)); } catch (_) {} }
function renderIntegration(d) { const select = document.getElementById('feature-notify-channel'); if (select && d.notification_channel_id) select.dataset.selected = String(d.notification_channel_id); const status=document.getElementById('feature-webhook-state'); if(status) status.textContent=d.has_webhook?'Webhook saved securely':''; document.querySelectorAll('.feature-notify-type').forEach(c => { c.checked = (d.events || []).includes(c.value); }); }
async function loadTicketInbox() { if (!state.currentGuildId) return; try { const d = await featureJson(`/api/guild/${state.currentGuildId}/tickets`); const el = document.getElementById('feature-ticket-list'); if (!el) return; el.innerHTML = (d.tickets || []).map(t => `<div class="feature-row feature-ticket-row"><strong>#${t.ticket_id} · ${escapeHtml(String(t.ticket_type))}<small>${escapeHtml(String(t.status))} · <@${escapeHtml(String(t.owner_id))}></small></strong><div><button class="cyber-btn btn-ghost" onclick="ticketAction(${t.ticket_id},'claim')">Claim</button><button class="cyber-btn btn-ghost" onclick="ticketReply(${t.ticket_id})">Reply</button>${t.status === 'closed' ? `<button class="cyber-btn btn-ghost" onclick="viewTicketTranscript(${t.ticket_id})">Transcript</button>` : `<button class="btn-glow-danger" onclick="ticketAction(${t.ticket_id},'close')">Close</button>`}</div></div>`).join('') || 'No tickets found.'; } catch (e) { const el = document.getElementById('feature-ticket-list'); if (el) el.textContent = e.message; } }
async function saveGuildLanguage() { try { const lang = document.getElementById('feature-language').value; await featureJson(`/api/guild/${state.currentGuildId}/settings`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({language:lang})}); applyDashboardLanguage(lang); showToast('Server language saved','success'); } catch(e) { showToast(e.message,'error'); } }
function applyDashboardLanguage(lang) {
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  const translations={
    en:{nav:['Overview','Music','Voice channels','Security','Moderation','Member verification','Support tickets','Backups','Community'],overview:'Everything in sync.',subtitle:'A clear view of your bots, servers and live activity.',metrics:['Bots online','Servers ready','Music sessions','Selected server'],features:['Server readiness','Recent activity','Discord notifications & webhooks','Music library & schedules','Member actions & audit log','Open ticket inbox','Scheduled backups & comparison']},
    fr:{nav:['Vue générale','Musique','Salons vocaux','Sécurité','Modération','Vérification','Tickets','Sauvegardes','Communauté'],overview:'Tout est synchronisé.',subtitle:'Une vue claire de vos bots, serveurs et activité en direct.',metrics:['Bots en ligne','Serveurs prêts','Sessions musicales','Serveur sélectionné'],features:['État du serveur','Activité récente','Notifications Discord et webhooks','Bibliothèque musicale et programmation','Actions membres et journal de modération','Boîte de réception des tickets','Sauvegardes planifiées et comparaison']},
    ar:{nav:['نظرة عامة','الموسيقى','القنوات الصوتية','الأمان','الإشراف','التحقق','التذاكر','النسخ الاحتياطية','المجتمع'],overview:'كل شيء متزامن.',subtitle:'نظرة واضحة على البوتات والسيرفرات والنشاط المباشر.',metrics:['البوتات المتصلة','السيرفرات الجاهزة','جلسات الموسيقى','السيرفر المحدد'],features:['جاهزية السيرفر','النشاط الأخير','إشعارات Discord وWebhooks','مكتبة الموسيقى والجدولة','إجراءات الأعضاء وسجل الإشراف','صندوق التذاكر','النسخ المجدولة والمقارنة']}
  }[lang]||null;
  if(!translations)return;
  const controls={
    en:{buttons:['Refresh','Save','Save notifications','Send test','Save current search','View','Delete playlist','Set timer','Schedule','Apply action','Refresh','Schedule backups','Compare'],placeholders:['Choose notification channel (optional)','https://discord.com/api/webhooks/…','Playlist name','Member ID','Role (when needed)','Reason','Track or radio URL']},
    fr:{buttons:['Actualiser','Enregistrer','Enregistrer les alertes','Envoyer un test','Enregistrer la recherche','Voir','Supprimer la playlist','Régler le minuteur','Programmer','Appliquer','Actualiser','Programmer les sauvegardes','Comparer'],placeholders:['Choisir un salon de notification (facultatif)','https://discord.com/api/webhooks/…','Nom de la playlist','ID du membre','Rôle (si nécessaire)','Motif','Titre ou URL radio']},
    ar:{buttons:['تحديث','حفظ','حفظ الإشعارات','إرسال تجربة','حفظ البحث الحالي','عرض','حذف قائمة التشغيل','ضبط المؤقت','جدولة','تنفيذ الإجراء','تحديث','جدولة النسخ','مقارنة'],placeholders:['اختر قناة الإشعارات (اختياري)','https://discord.com/api/webhooks/…','اسم قائمة التشغيل','معرّف العضو','الرتبة (عند الحاجة)','السبب','الأغنية أو رابط الإذاعة']}
  }[lang];
  const buttonIds=['feature-refresh','feature-save-language','feature-save-integration','feature-test-integration','feature-save-track','feature-load-playlist','feature-delete-playlist','feature-set-timer','feature-add-schedule','feature-mod-submit','feature-ticket-refresh','feature-backup-schedule','feature-backup-compare'];
  buttonIds.forEach((id,i)=>{const el=document.getElementById(id);if(el&&controls.buttons[i])el.textContent=controls.buttons[i];});
  const placeholderIds=['feature-notify-channel','feature-webhook-url','feature-playlist-name','feature-mod-target','feature-mod-role','feature-mod-reason','feature-schedule-query'];
  placeholderIds.forEach((id,i)=>{const el=document.getElementById(id);if(el&&el.tagName!=='SELECT')el.placeholder=controls.placeholders[i]||'';});
  document.querySelectorAll('.nav-tab').forEach((b,i)=>{const span=b.querySelector('span');if(span&&translations.nav[i])span.textContent=translations.nav[i];});
  const title=document.querySelector('.overview-heading h1'); if(title)title.textContent=translations.overview;
  const subtitle=document.querySelector('.overview-subtitle'); if(subtitle)subtitle.textContent=translations.subtitle;
  document.querySelectorAll('.overview-metric .metric-label').forEach((el,i)=>{if(translations.metrics[i])el.textContent=translations.metrics[i];});
  document.querySelectorAll('.astron-feature-card .card-heading').forEach((el,i)=>{if(translations.features[i])el.textContent=translations.features[i];});
}
async function saveGuildIntegration() { try { const channel = document.getElementById('feature-notify-channel').value; const webhook = document.getElementById('feature-webhook-url').value.trim(); const events = [...document.querySelectorAll('.feature-notify-type:checked')].map(c=>c.value); await featureJson(`/api/guild/${state.currentGuildId}/integration`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({notification_channel_id:channel,webhook_url:webhook,events})}); document.getElementById('feature-webhook-url').value=''; showToast('Discord alerts saved','success'); loadFeatureWorkspace(); } catch(e) { showToast(e.message,'error'); } }
async function testGuildIntegration() { try { await featureJson(`/api/guild/${state.currentGuildId}/integration/test`,{method:'POST'}); showToast('Test notification sent','success'); } catch(e) { showToast(e.message,'error'); } }
async function saveTrackToPlaylist() { const name=document.getElementById('feature-playlist-name').value.trim(); const query=document.getElementById('input-search')?.value.trim(); if(!name||!query) return showToast('Add a playlist name and search for a track first','warning'); try { await featureJson('/api/music/playlists',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,title:query,query})}); showToast('Track added to playlist','success'); loadFeatureWorkspace(); } catch(e) { showToast(e.message,'error'); } }
async function loadPlaylistSongs() { const name=document.getElementById('feature-playlist-select').value; if(!name) return; try { const d=await featureJson(`/api/music/playlists?name=${encodeURIComponent(name)}`); document.getElementById('feature-playlist-items').innerHTML=(d.songs||[]).map(s=>`<div class="feature-row"><strong>${escapeHtml(String(s.song_title))}</strong><button class="cyber-btn btn-ghost" onclick="playPlaylistTrack('${encodeURIComponent(s.song_query)}')">Play</button></div>`).join('')||'This playlist is empty.'; } catch(e) { showToast(e.message,'error'); } }
async function deletePlaylist() { const name=document.getElementById('feature-playlist-select').value; if(!name) return showToast('Choose a playlist first','warning'); if(!confirm(`Delete playlist “${name}”?`)) return; try { await featureJson('/api/music/playlists',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'delete',name})}); showToast('Playlist deleted','success'); loadFeatureWorkspace(); } catch(e) { showToast(e.message,'error'); } }
async function removeMusicSchedule(schedule_id) { try { await featureJson(`/api/guild/${state.currentGuildId}/music/schedules`,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({schedule_id})}); loadFeatureWorkspace(); } catch(e) { showToast(e.message,'error'); } }
async function playPlaylistTrack(query) { try { await featureJson('/api/music/play',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({guild_id:state.currentGuildId,bot_id:state.activeBotId,query:decodeURIComponent(query)})}); showToast('Track sent to the player','success'); } catch(e) { showToast(e.message,'error'); } }
async function setMusicTimer() { try { const minutes=Number(document.getElementById('feature-timer-minutes').value||0); await featureJson(`/api/guild/${state.currentGuildId}/music/timer`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({minutes})}); showToast(minutes?'Playback timer set':'Playback timer cancelled','success'); } catch(e) { showToast(e.message,'error'); } }
async function addMusicSchedule() { const query=document.getElementById('feature-schedule-query').value.trim(); const station_id=document.getElementById('feature-schedule-station').value; const starts_at=document.getElementById('feature-schedule-time').value; try { await featureJson(`/api/guild/${state.currentGuildId}/music/schedules`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,station_id,starts_at:new Date(starts_at).toISOString(),repeat_daily:document.getElementById('feature-schedule-repeat').checked})}); showToast('Playback scheduled','success'); loadFeatureWorkspace(); } catch(e) { showToast(e.message,'error'); } }
async function submitModerationAction() { const payload={target_id:document.getElementById('feature-mod-target').value,action:document.getElementById('feature-mod-action').value,role_id:document.getElementById('feature-mod-role').value,duration_seconds:Number(document.getElementById('feature-mod-duration').value)*60,reason:document.getElementById('feature-mod-reason').value}; try { await featureJson(`/api/guild/${state.currentGuildId}/moderation/action`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); showToast('Moderation action recorded','success'); loadFeatureWorkspace(); } catch(e) { showToast(e.message,'error'); } }
async function ticketAction(ticket_id,action) { if(action==='close'&&!confirm('Close this ticket and save its transcript?')) return; try { await featureJson(`/api/guild/${state.currentGuildId}/tickets/action`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ticket_id,action})}); loadTicketInbox(); loadFeatureWorkspace(); } catch(e) { showToast(e.message,'error'); } }
async function ticketReply(ticket_id) { const message=prompt('Write a reply to this ticket'); if(!message) return; try { await featureJson(`/api/guild/${state.currentGuildId}/tickets/action`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ticket_id,action:'reply',message})}); showToast('Reply sent','success'); } catch(e) { showToast(e.message,'error'); } }
async function viewTicketTranscript(ticket_id) { try { const res=await fetch(`/api/guild/${state.currentGuildId}/tickets/${ticket_id}/transcript`); if(!res.ok) throw new Error('Transcript unavailable'); const url=URL.createObjectURL(await res.blob()); window.open(url,'_blank','noopener'); setTimeout(()=>URL.revokeObjectURL(url),60000); } catch(e) { showToast(e.message,'error'); } }
async function scheduleBackups() { try { await featureJson(`/api/guild/${state.currentGuildId}/backups/schedule`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({interval_hours:Number(document.getElementById('feature-backup-interval').value)})}); showToast('Backup schedule saved','success'); loadFeatureWorkspace(); } catch(e) { showToast(e.message,'error'); } }
async function removeBackupSchedule(schedule_id) { try { await featureJson(`/api/guild/${state.currentGuildId}/backups/schedule`,{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({schedule_id})}); loadFeatureWorkspace(); } catch(e) { showToast(e.message,'error'); } }
async function compareBackups() { try { const d=await featureJson(`/api/guild/${state.currentGuildId}/backups/compare`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({first_id:document.getElementById('feature-backup-first').value,second_id:document.getElementById('feature-backup-second').value})}); const el=document.getElementById('feature-backup-result'); el.innerHTML=Object.entries(d.changes).map(([k,v])=>`<div><strong>${k}</strong> · Added: ${v.added.map(escapeHtml).join(', ')||'none'} · Removed: ${v.removed.map(escapeHtml).join(', ')||'none'} · Modified: ${(v.modified||[]).map(x=>escapeHtml(x.name)).join(', ')||'none'}</div>`).join(''); } catch(e) { showToast(e.message,'error'); } }

function setupCommandPalette() {
  const overlay = document.getElementById('command-palette');
  const input = document.getElementById('command-palette-input');
  const results = document.getElementById('command-palette-results');
  const openButton = document.getElementById('btn-command-palette');
  const closeButton = document.getElementById('command-palette-close');
  if (!overlay || !input || !results || !openButton) return;

  let previousFocus = null;
  const pageNames = {
    overview: 'Overview', music: 'Music player', voice: 'Voice channels',
    security: 'Security', moderation: 'Moderation', verification: 'Member verification',
    tickets: 'Support tickets', backups: 'Server backups', community: 'Community tools',
    vip: 'VIP and licenses'
  };
  const pageIcons = { overview: '▦', music: '♫', voice: '⌁', security: '◇', moderation: '⚖', verification: '✓', tickets: '▤', backups: '↥', community: '◎', vip: '✦' };

  const close = () => {
    if (!overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    (previousFocus && document.contains(previousFocus) ? previousFocus : openButton).focus();
  };
  const open = () => {
    previousFocus = document.activeElement;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    input.value = '';
    renderResults('');
    input.focus();
  };
  const renderResults = (query) => {
    const needle = query.trim().toLocaleLowerCase();
    const commands = Object.entries(pageNames).filter(([id]) => id !== 'vip' || state.isAdmin).map(([id, name]) => ({
      kind: 'tab', id, title: name, detail: id === 'overview' ? 'Workspace' : 'Open section', icon: pageIcons[id]
    }));
    commands.push({ kind: 'refresh', id: 'refresh', title: 'Refresh bot and server status', detail: 'Reload live connections and servers', icon: '↻' });
    if (state.authenticated) {
      state.guilds.forEach((guild) => commands.push({
        kind: 'guild', id: String(guild.id), title: guild.name,
        detail: (guild.bots_present?.length || 0) + ' Astron bot' + (guild.bots_present?.length === 1 ? '' : 's'),
        icon: '◉'
      }));
    }
    const filtered = commands.filter((item) => !needle || (item.title + ' ' + item.detail).toLocaleLowerCase().includes(needle));
    if (!filtered.length) {
      results.innerHTML = '<div class="command-no-results">No matching pages or servers. Try a shorter search.</div>';
      return;
    }
    results.innerHTML = filtered.map((item) =>
      '<button class="command-result" type="button" data-command-kind="' + item.kind + '" data-command-id="' + escapeHtml(item.id) + '">' +
      '<span class="command-result-icon" aria-hidden="true">' + item.icon + '</span>' +
      '<span class="command-result-copy"><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.detail) + '</small></span>' +
      '<span class="command-result-type">' + (item.kind === 'guild' ? 'Server' : item.kind === 'tab' ? 'Page' : 'Action') + '</span></button>'
    ).join('');
  };

  openButton.addEventListener('click', open);
  closeButton?.addEventListener('click', close);
  input.addEventListener('input', () => renderResults(input.value));
  overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
  results.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-command-kind]');
    if (!button) return;
    const commandKind = button.dataset.commandKind;
    const commandId = button.dataset.commandId;
    close();
    if (commandKind === 'tab') switchTab(commandId);
    else if (commandKind === 'guild') {
      if (el.guildSelector) {
        el.guildSelector.value = commandId;
        el.guildSelector.dispatchEvent(new Event('change'));
      }
    } else if (commandKind === 'refresh') {
      await Promise.all([loadClusterBots(), loadGuilds()]);
    }
  });

  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key === 'Enter' && event.target === input) {
      const firstResult = results.querySelector('.command-result');
      if (firstResult) { event.preventDefault(); firstResult.click(); }
    }
    if (event.key === 'ArrowDown' && event.target === input) {
      event.preventDefault();
      results.querySelector('.command-result')?.focus();
    } else if (event.key === 'Tab') {
      const focusable = [...overlay.querySelectorAll('input, button:not([disabled])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });
  results.addEventListener('keydown', (event) => {
    const buttons = [...results.querySelectorAll('.command-result')];
    const index = buttons.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' && buttons.length) { event.preventDefault(); buttons[Math.min(index + 1, buttons.length - 1)].focus(); }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index <= 0) input.focus();
      else buttons[index - 1].focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      open();
    } else if (event.key === 'Escape' && overlay.classList.contains('active')) close();
  });
}

function buildWorkspaceNavigation() {
  const navigation = document.querySelector('.nav-tab-switcher');
  if (!navigation) return;
  navigation.setAttribute('aria-label', 'Main navigation');
  const groups = {
    overview: 'Workspace', music: 'Workspace', voice: 'Workspace',
    security: 'Server tools', moderation: 'Server tools', verification: 'Server tools',
    tickets: 'Server tools', backups: 'Server tools', community: 'Server tools',
    vip: 'Administration'
  };
  let previousGroup = '';
  navigation.querySelectorAll('.nav-tab').forEach((button) => {
    const tab = button.dataset.tab;
    const group = groups[tab];
    button.setAttribute('aria-controls', `pane-${tab}`);
    if (!button.hasAttribute('aria-current')) button.setAttribute('aria-current', button.classList.contains('active') ? 'page' : 'false');
    if (group && group !== previousGroup) {
      const label = document.createElement('span');
      label.className = 'nav-group-label';
      label.dataset.group = group;
      label.textContent = group;
      navigation.insertBefore(label, button);
      previousGroup = group;
    }
  });
}

function addWorkspacePageHeadings() {
  const headings = {
    music: ['Music player', 'Play tracks, control the queue and tune audio for your server.'],
    voice: ['Voice rooms', 'Monitor temporary channels and adjust room settings.'],
    security: ['Security', 'Choose the protections and thresholds used in this server.'],
    moderation: ['Moderation', 'Set up moderation roles, logs and active cases.'],
    verification: ['Member verification', 'Choose the roles and channel used for new members.'],
    tickets: ['Support tickets', 'Configure where support requests are created and routed.'],
    backups: ['Server backups', 'Save a snapshot of your server structure and restore it when needed.'],
    community: ['Community tools', 'Review member activity and manage automatic replies.'],
    vip: ['VIP & licenses', 'Manage subscriptions, license keys and payment delivery.']
  };
  Object.entries(headings).forEach(([tab, [title, description]]) => {
    const pane = document.getElementById(`pane-${tab}`);
    if (!pane || pane.querySelector('.workspace-page-heading')) return;
    const heading = document.createElement('header');
    heading.className = 'workspace-page-heading';
    heading.innerHTML = `<div><p class="overview-kicker">ASTRON / ${escapeHtml(tab.replace('-', ' '))}</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div>`;
    pane.insertBefore(heading, pane.firstElementChild);
  });
}

// User Session & OAuth2
async function loadUserAuth() {
  try {
    const res = await fetch('/api/me');
    const data = await res.json();
    state.authenticated = Boolean(data.authenticated);
    state.isAdmin = Boolean(data.is_admin);
    const vipTab = document.getElementById('tab-btn-vip');
    if (vipTab) {
      vipTab.hidden = !state.isAdmin;
      if (vipTab.previousElementSibling?.classList.contains('nav-group-label')) vipTab.previousElementSibling.hidden = !state.isAdmin;
    }
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.href = `${API_BASE}/api/auth/logout?redirect=${encodeURIComponent(window.location.href)}`;
    }

    if (data.authenticated) {
      if (el.btnDiscordLogin) el.btnDiscordLogin.style.display = 'none';
      if (el.userProfileChip) el.userProfileChip.style.display = 'flex';
      if (el.userName) {
        el.userName.innerHTML = `${escapeHtml(data.username)} ${data.is_admin ? '<span class="admin-tag">👑 ADMIN</span>' : ''}`;
      }
      if (el.userAvatar && data.avatar) {
        el.userAvatar.src = data.avatar;
      }
    } else {
      if (el.userProfileChip) el.userProfileChip.style.display = 'none';
      if (el.btnDiscordLogin) {
        el.btnDiscordLogin.style.display = 'inline-flex';
        el.btnDiscordLogin.href = `${window.location.origin}/login`;
        if (!data.oauth_configured) {
          el.btnDiscordLogin.title = 'Discord login is not configured on the server yet.';
          el.btnDiscordLogin.setAttribute('aria-label', 'Discord login is not configured');
        }
      }
    }
  } catch (err) {
    state.authenticated = false;
    state.isAdmin = false;
    const vipTab = document.getElementById('tab-btn-vip');
    if (vipTab) {
      vipTab.hidden = true;
      if (vipTab.previousElementSibling?.classList.contains('nav-group-label')) vipTab.previousElementSibling.hidden = true;
    }
    console.error('Failed to load user auth:', err);
  }
}

// Setup Canvas Visualizer
function setupVisualizer() {
  if (window.AudioWaveformVisualizer) {
    state.visualizer = new window.AudioWaveformVisualizer('waveform-canvas');
  }
}

// 3-Way Tab Switcher (Music, TempVoice, VIP Vault)
function setupTabs() {
  const tabs = ['overview', 'music', 'voice', 'security', 'moderation', 'verification', 'tickets', 'backups', 'community', 'vip'];
  tabs.forEach(tabKey => {
    const btn = document.getElementById(`tab-btn-${tabKey}`);
    if (btn) {
      btn.addEventListener('click', () => switchTab(tabKey));
    }
  });

  document.querySelectorAll('[data-open-tab]').forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.openTab));
  });
  document.getElementById('overview-refresh')?.addEventListener('click', async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    await Promise.all([loadClusterBots(), loadGuilds()]);
    button.disabled = false;
  });

  // Attach Ecosystem Save Handlers
  setupEcosystemActionEvents();
}

function switchTab(tabKey) {
  if (tabKey === 'vip' && !state.isAdmin) {
    showToast('Administrator access is required for VIP and license settings.', 'error');
    return;
  }
  const tabs = ['overview', 'music', 'voice', 'security', 'moderation', 'verification', 'tickets', 'backups', 'community', 'vip'];
  tabs.forEach(k => {
    const btn = document.getElementById(`tab-btn-${k}`);
    const pane = document.getElementById(`pane-${k}`);
    if (btn) {
      btn.classList.toggle('active', k === tabKey);
      btn.setAttribute('aria-current', k === tabKey ? 'page' : 'false');
    }
    if (pane) pane.classList.toggle('active', k === tabKey);
  });
  localStorage.setItem('astron_last_active_tab', tabKey);

  if (tabKey === 'vip') {
    loadVipVault();
  } else if (['security', 'moderation', 'verification', 'tickets', 'backups', 'community'].includes(tabKey)) {
    if (state.currentGuildId) {
      loadEcosystemData(state.currentGuildId);
    }
  }
}

// ============================================================
// ALL-IN-ONE ECOSYSTEM SYNC & MANAGEMENT (Drax + 5 Bots)
// ============================================================
async function loadEcosystemData(guildId) {
  if (!guildId) return;
  try {
    const res = await fetch(`/api/guild/${guildId}/ecosystem`);
    const data = await res.json();
    if (!data.success) return;

    // Helper: populate select element
    const populateSelect = (selectId, items, selectedValue, placeholder) => {
      const select = document.getElementById(selectId);
      if (!select) return;
      select.innerHTML = `<option value="">${placeholder || 'Select...'}</option>`;
      if (!items || items.length === 0) {
        const emptyOpt = document.createElement('option');
        emptyOpt.value = '';
        emptyOpt.disabled = true;
        emptyOpt.textContent = '⚠️ No items found for this server';
        select.appendChild(emptyOpt);
        return;
      }
      items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = String(item.id);
        opt.textContent = item.name;
        if (selectedValue && String(item.id) === String(selectedValue)) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });
    };

    const textChannels = (data.channels || []).filter(c => c.type === 'text');
    const categories = data.categories || [];
    const roles = data.roles || [];

    // 1. Dropdown Populators
    // Moderation
    populateSelect('mod-select-jail-role', roles, data.moderation?.jail_role_id, 'Select Jail Role...');
    populateSelect('mod-select-court-channel', textChannels, data.moderation?.jail_log_channel_id, 'Select Court Channel...');
    populateSelect('mod-select-log-channel', textChannels, data.moderation?.mod_log_channel_id, 'Select Mod Log Channel...');

    // Verification
    populateSelect('verif-select-verified', roles, data.verification?.verified_role_id, 'Select Verified Role...');
    populateSelect('verif-select-unverified', roles, data.verification?.unverified_role_id, 'Select Unverified Role...');
    populateSelect('verif-select-male', roles, data.verification?.male_role_id, 'Select Male Role...');
    populateSelect('verif-select-female', roles, data.verification?.female_role_id, 'Select Female Role...');
    populateSelect('verif-deploy-channel', textChannels, textChannels[0]?.id, 'Select Target Channel...');

    // Tickets
    const existingPanel = (data.ticket_panels && data.ticket_panels[0]) || {};
    populateSelect('ticket-select-support-role', roles, existingPanel.support_roles?.[0], 'Select Support Staff Role...');
    populateSelect('ticket-select-category', categories, existingPanel.category_id, 'Select Target Category...');
    populateSelect('ticket-deploy-channel', textChannels, textChannels[0]?.id, 'Select Channel for Desk...');

    // 2. Security Settings
    const sec = data.security || {};
    const setCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = Boolean(val); };
    setCheck('sec-toggle-antinuke', sec.anti_nuke_enabled !== 0);
    setCheck('sec-toggle-antiraid', sec.anti_raid_enabled !== 0);
    setCheck('sec-toggle-antibot', sec.anti_bot_enabled !== 0);
    setCheck('sec-toggle-antilink', sec.anti_link_enabled === 1);

    const secPunish = document.getElementById('sec-select-punishment');
    if (secPunish && sec.punishment) secPunish.value = sec.punishment;
    const secChLimit = document.getElementById('sec-limit-channel');
    if (secChLimit) secChLimit.value = sec.max_channel_deletes_per_min || 2;
    const secRoleLimit = document.getElementById('sec-limit-role');
    if (secRoleLimit) secRoleLimit.value = sec.max_role_deletes_per_min || 2;

    // 3. Active Sentenced Prisoners Table
    const inmatesTbody = document.getElementById('inmates-table-body');
    if (inmatesTbody) {
      const inmates = data.active_jails || [];
      if (inmates.length === 0) {
        inmatesTbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No prisoners currently in custody. Server courtroom is calm!</td></tr>';
      } else {
        inmatesTbody.innerHTML = inmates.map(j => `
          <tr>
            <td class="font-mono text-cyan">&lt;@${j.user_id}&gt;</td>
            <td class="font-bold">${escapeHtml(j.reason || 'Server rules violation')}</td>
            <td class="text-xs text-muted">${new Date(j.jailed_at).toLocaleString()}</td>
            <td class="text-xs text-muted">${j.expires_at ? new Date(j.expires_at).toLocaleString() : 'Permanent'}</td>
            <td>
              <button class="btn-glow-danger" style="padding: 4px 10px; font-size: 0.75rem;" onclick="handleUnjailMember('${j.user_id}')">
                🔓 Unjail
              </button>
            </td>
          </tr>
        `).join('');
      }
    }

    // 4. Backups Table
    const backupsTbody = document.getElementById('backups-table-body');
    if (backupsTbody) {
      const backups = data.backups || [];
      if (backups.length === 0) {
        backupsTbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No backups found. Create one with the button above!</td></tr>';
      } else {
        backupsTbody.innerHTML = backups.map(b => `
          <tr>
            <td class="font-mono text-cyan">${b.backup_id}</td>
            <td class="font-bold">${escapeHtml(b.backup_name)}</td>
            <td class="text-xs text-muted">${new Date(b.created_at).toLocaleString()}</td>
            <td>
              <span class="cyber-chip chip-emerald">Saved Safe</span>
            </td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="btn-glow-cyan" style="padding: 4px 10px; font-size: 0.75rem;" onclick="handleRestoreBackup('${b.backup_id}')">⚡ Restore</button>
                <button class="btn-glow-danger" style="padding: 4px 10px; font-size: 0.75rem;" onclick="handleDeleteBackup('${b.backup_id}')">🗑️</button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }

    // 5. Leaderboard Table
    const lbTbody = document.getElementById('leaderboard-table-body');
    if (lbTbody) {
      const users = data.rich_leaderboard || [];
      if (users.length === 0) {
        lbTbody.innerHTML = '<tr><td colspan="3" class="text-center py-4 text-muted">No economy records yet. Type in chat or run /daily!</td></tr>';
      } else {
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        lbTbody.innerHTML = users.map((u, i) => `
          <tr>
            <td class="font-bold">${medals[i] || i + 1}</td>
            <td class="font-mono text-cyan">&lt;@${u.user_id}&gt;</td>
            <td class="font-bold text-gold">${Number(u.total_wealth).toLocaleString()} 💰</td>
          </tr>
        `).join('');
      }
    }

  } catch (err) {
    console.error('Error loading ecosystem data:', err);
  }
}

function setupEcosystemActionEvents() {
  // Save Security
  const btnSaveSec = document.getElementById('btn-save-security');
  if (btnSaveSec) {
    btnSaveSec.addEventListener('click', async () => {
      if (!state.currentGuildId) return showToast('Please select a server first!', 'error');
      const payload = {
        anti_nuke_enabled: document.getElementById('sec-toggle-antinuke')?.checked ? 1 : 0,
        anti_raid_enabled: document.getElementById('sec-toggle-antiraid')?.checked ? 1 : 0,
        anti_bot_enabled: document.getElementById('sec-toggle-antibot')?.checked ? 1 : 0,
        anti_link_enabled: document.getElementById('sec-toggle-antilink')?.checked ? 1 : 0,
        punishment: document.getElementById('sec-select-punishment')?.value || 'strip_roles',
        max_channel_deletes_per_min: parseInt(document.getElementById('sec-limit-channel')?.value) || 2,
        max_role_deletes_per_min: parseInt(document.getElementById('sec-limit-role')?.value) || 2,
      };
      try {
        const res = await fetch(`/api/guild/${state.currentGuildId}/security/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.success) showToast('🛡️ Security Sentinel configuration saved!', 'success');
      } catch (e) {
        showToast('Failed to save security settings', 'error');
      }
    });
  }

  // Save Moderation
  const btnSaveMod = document.getElementById('btn-save-moderation');
  if (btnSaveMod) {
    btnSaveMod.addEventListener('click', async () => {
      if (!state.currentGuildId) return showToast('Please select a server first!', 'error');
      const payload = {
        jail_role_id: document.getElementById('mod-select-jail-role')?.value || null,
        jail_log_channel_id: document.getElementById('mod-select-court-channel')?.value || null,
        mod_log_channel_id: document.getElementById('mod-select-log-channel')?.value || null,
      };
      try {
        const res = await fetch(`/api/guild/${state.currentGuildId}/moderation/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.success) showToast('⚖️ Court & Moderation settings saved!', 'success');
      } catch (e) {
        showToast('Failed to save moderation settings', 'error');
      }
    });
  }

  // Save Verification
  const btnSaveVerif = document.getElementById('btn-save-verification');
  if (btnSaveVerif) {
    btnSaveVerif.addEventListener('click', async () => {
      if (!state.currentGuildId) return showToast('Please select a server first!', 'error');
      const payload = {
        verified_role_id: document.getElementById('verif-select-verified')?.value || null,
        unverified_role_id: document.getElementById('verif-select-unverified')?.value || null,
        male_role_id: document.getElementById('verif-select-male')?.value || null,
        female_role_id: document.getElementById('verif-select-female')?.value || null,
        is_enabled: 1
      };
      try {
        const res = await fetch(`/api/guild/${state.currentGuildId}/verification/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.success) showToast('🔐 Verification roles saved! You can now deploy the panel below.', 'success');
      } catch (e) {
        showToast('Failed to save verification settings', 'error');
      }
    });
  }

  // Deploy Verification Panel
  const btnDeployVerif = document.getElementById('btn-deploy-verification');
  if (btnDeployVerif) {
    btnDeployVerif.addEventListener('click', async () => {
      if (!state.currentGuildId) return showToast('Please select a server first!', 'error');
      const chId = document.getElementById('verif-deploy-channel')?.value;
      if (!chId) return showToast('Please select a target Discord channel first!', 'warning');
      try {
        btnDeployVerif.disabled = true;
        btnDeployVerif.innerHTML = '<span>⏳ Deploying...</span>';
        const res = await fetch(`/api/guild/${state.currentGuildId}/verification/deploy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel_id: chId })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`🎉 ${data.message}`, 'success');
        } else {
          showToast(`❌ ${data.error || 'Failed to deploy panel'}`, 'error');
        }
      } catch (err) {
        showToast(`Deploy error: ${err.message}`, 'error');
      } finally {
        btnDeployVerif.disabled = false;
        btnDeployVerif.innerHTML = '<span>🚀 Deploy Verification Panel to Discord</span>';
      }
    });
  }

  // Save Tickets
  const btnSaveTickets = document.getElementById('btn-save-tickets');
  if (btnSaveTickets) {
    btnSaveTickets.addEventListener('click', async () => {
      if (!state.currentGuildId) return showToast('Please select a server first!', 'error');
      const payload = {
        support_role_id: document.getElementById('ticket-select-support-role')?.value || null,
        category_id: document.getElementById('ticket-select-category')?.value || null,
        title: document.getElementById('ticket-input-title')?.value || '🎫 Support Ticket Desk',
        description: document.getElementById('ticket-input-desc')?.value || 'Click the button below to open a private ticket and speak directly with the staff team.'
      };
      try {
        const res = await fetch(`/api/guild/${state.currentGuildId}/tickets/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.success) showToast('🎫 Ticket configuration saved!', 'success');
      } catch (e) {
        showToast('Failed to save ticket settings', 'error');
      }
    });
  }

  // Deploy Ticket Desk
  const btnDeployTickets = document.getElementById('btn-deploy-tickets');
  if (btnDeployTickets) {
    btnDeployTickets.addEventListener('click', async () => {
      if (!state.currentGuildId) return showToast('Please select a server first!', 'error');
      const chId = document.getElementById('ticket-deploy-channel')?.value;
      if (!chId) return showToast('Please select a target channel first!', 'warning');
      try {
        btnDeployTickets.disabled = true;
        btnDeployTickets.innerHTML = '<span>⏳ Deploying...</span>';
        const res = await fetch(`/api/guild/${state.currentGuildId}/tickets/deploy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel_id: chId })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`🎉 ${data.message}`, 'success');
        } else {
          showToast(`❌ ${data.error || 'Failed to deploy ticket desk'}`, 'error');
        }
      } catch (err) {
        showToast(`Deploy error: ${err.message}`, 'error');
      } finally {
        btnDeployTickets.disabled = false;
        btnDeployTickets.innerHTML = '<span>🚀 Deploy Ticket Desk to Discord</span>';
      }
    });
  }

  // Create Backup
  const btnCreateBackup = document.getElementById('btn-create-backup');
  if (btnCreateBackup) {
    btnCreateBackup.addEventListener('click', async () => {
      if (!state.currentGuildId) return showToast('Please select a server first!', 'error');
      const bName = prompt('Enter a name for this backup:', `Dashboard Snapshot ${new Date().toLocaleDateString()}`);
      if (!bName) return;
      try {
        showToast('Creating full server backup snapshot...', 'info');
        const res = await fetch(`/api/guild/${state.currentGuildId}/backups/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: bName })
        });
        const resData = await res.json();
        if (resData.success) {
          showToast(`📦 Backup ${resData.backup_id} created successfully!`, 'success');
          loadEcosystemData(state.currentGuildId);
        } else {
          showToast(resData.error || 'Backup creation failed', 'error');
        }
      } catch (e) {
        showToast('Error creating backup', 'error');
      }
    });
  }

  // Save Auto-Responder
  const btnSaveAR = document.getElementById('btn-save-ar');
  if (btnSaveAR) {
    btnSaveAR.addEventListener('click', async () => {
      if (!state.currentGuildId) return showToast('Please select a server first!', 'error');
      const trig = document.getElementById('ar-input-trigger')?.value.trim();
      const resp = document.getElementById('ar-input-response')?.value.trim();
      if (!trig || !resp) return showToast('Please fill trigger and response fields!', 'error');
      try {
        const res = await fetch(`/api/guild/${state.currentGuildId}/autoresponder/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger_text: trig, response_text: resp, match_type: 'contains' })
        });
        const resData = await res.json();
        if (resData.success) {
          showToast('🤖 Auto-response rule added successfully!', 'success');
          document.getElementById('ar-input-trigger').value = '';
          document.getElementById('ar-input-response').value = '';
        }
      } catch (e) {
        showToast('Error saving auto-response rule', 'error');
      }
    });
  }
}

// Global actions for onclick
window.handleUnjailMember = async function(userId) {
  if (!confirm(`Are you sure you want to unjail user <@${userId}> and restore their roles?`)) return;
  try {
    const res = await fetch(`/api/guild/${state.currentGuildId}/moderation/unjail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    const d = await res.json();
    if (d.success) {
      showToast(`🔓 ${d.message}`, 'success');
      loadEcosystemData(state.currentGuildId);
    } else {
      showToast(d.error || 'Failed to unjail member', 'error');
    }
  } catch (e) {
    showToast(`Error: ${e.message}`, 'error');
  }
};

window.handleRestoreBackup = async function(backupId) {
  const choice = prompt('Choose restore sections separated by commas: roles, categories, channels', 'roles,categories,channels');
  if (choice === null) return;
  const sections = choice.split(',').map(s => s.trim().toLowerCase()).filter(s => ['roles','categories','channels'].includes(s));
  if (!sections.length || !confirm(`Restore ${sections.join(', ')} from ${backupId}? Only missing items are recreated.`)) return;
  try {
    showToast('Restoring server architecture...', 'info');
    const res = await fetch(`/api/guild/${state.currentGuildId}/backups/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backup_id: backupId, sections })
    });
    const d = await res.json();
    if (d.success) {
      showToast(`🎉 ${d.message}`, 'success');
      loadEcosystemData(state.currentGuildId);
    } else {
      showToast(d.error || 'Restore failed', 'error');
    }
  } catch (e) {
    showToast(`Error: ${e.message}`, 'error');
  }
};

window.handleDeleteBackup = async function(backupId) {
  if (!confirm(`Delete backup ${backupId} permanently?`)) return;
  try {
    const res = await fetch(`/api/guild/${state.currentGuildId}/backups/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backup_id: backupId })
    });
    const d = await res.json();
    if (d.success) {
      showToast('🗑️ Backup deleted', 'success');
      loadEcosystemData(state.currentGuildId);
    }
  } catch (e) {
    showToast(`Error: ${e.message}`, 'error');
  }
};


// ============================================================
// WEBSOCKET REAL-TIME SYNC
// ============================================================
function initWebSocket() {
  const wsUrl = `${WS_BASE}/ws`;

  state.ws = new WebSocket(wsUrl);

  state.ws.onopen = () => {
    state.wsConnected = true;
    showToast('⚡ WebSocket Connected: Real-Time Stream Online', 'success');
    sendWsMessage({ type: 'subscribe', guild_id: state.currentGuildId });
  };

  state.ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      handleWsMessage(msg);
    } catch (err) {
      console.error('WS parse error:', err);
    }
  };

  state.ws.onclose = () => {
    state.wsConnected = false;
    setTimeout(initWebSocket, 3000); // Auto reconnect
  };

  // Heartbeat ping for latency badge
  setInterval(() => {
    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
      state.ws.lastPing = performance.now();
      state.ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, 10000);
}

function sendWsMessage(obj) {
  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify(obj));
  }
}

function handleWsMessage(msg) {
  if (msg.type === 'pong' && state.ws.lastPing) {
    const lat = Math.round(performance.now() - state.ws.lastPing);
    el.latencyText.textContent = `${lat} ms`;
    return;
  }

  if (msg.type === 'guild_update' && msg.guild_id === state.currentGuildId) {
    state.guildData = msg.data;
    renderCurrentGuild();
  } else if (msg.type === 'guilds_updated') {
    loadGuilds();
    loadClusterBots();
  } else if (msg.type === 'dashboard_event' && String(msg.guild_id) === String(state.currentGuildId)) {
    const list = document.getElementById('feature-events');
    if (list) {
      const row = document.createElement('div');
      row.className = 'feature-row';
      row.innerHTML = `<strong>${escapeHtml(String(msg.data?.event_type || 'event'))}</strong><span>${escapeHtml(String(msg.data?.details || ''))}</span><time>${escapeHtml(String(msg.data?.created_at || ''))}</time>`;
      list.prepend(row);
      while (list.children.length > 12) list.lastElementChild.remove();
    }
  } else if (msg.type === 'toast') {
    showToast(msg.message, msg.variant || 'info');
  }
}

// ============================================================
// CLUSTER BOTS HEALTH & NODES MONITOR
// ============================================================
async function loadClusterBots() {
  try {
    const res = await fetch('/api/bots');
    const data = await res.json();
    if (data && data.nodes) {
      state.clusterError = false;
      state.clusterNodes = data.nodes;
      if (el.fleetStatusText) {
        const liveCnt = data.active_nodes ?? data.nodes.filter(n => n.status !== 'offline').length;
        el.fleetStatusText.textContent = `${liveCnt}/${data.total_nodes} NODES ONLINE`;
      }
      renderOverview();
    }
  } catch (err) {
    state.clusterError = true;
    renderOverview();
    console.error('Failed to load cluster bots:', err);
  }
}

function renderOverview() {
  const nodes = Array.isArray(state.clusterNodes) ? state.clusterNodes : [];
  const onlineNodes = nodes.filter((node) => node.status !== 'offline');
  const streams = nodes.reduce((total, node) => total + Number(node.active_streams || 0), 0);
  const guilds = Array.isArray(state.guilds) ? state.guilds : [];
  const selectedGuild = guilds.find((guild) => String(guild.id) === String(state.currentGuildId));

  const onlineCount = document.getElementById('overview-online-count');
  const totalCount = document.getElementById('overview-total-count');
  const serverCount = document.getElementById('overview-server-count');
  const streamCount = document.getElementById('overview-stream-count');
  const serverName = document.getElementById('overview-server-name');
  const serverStatus = document.getElementById('overview-server-status');
  if (onlineCount) onlineCount.textContent = nodes.length ? String(onlineNodes.length) : '—';
  if (totalCount) totalCount.textContent = nodes.length ? `of ${nodes.length} bots` : 'Waiting for bot status';
  if (serverCount) serverCount.textContent = state.authenticated ? String(guilds.length) : '—';
  if (streamCount) streamCount.textContent = nodes.length ? String(streams) : '—';
  if (serverName) serverName.textContent = selectedGuild?.name || 'Choose a server';
  if (serverStatus) {
    const botsHere = selectedGuild?.bots_present?.length || 0;
    serverStatus.textContent = selectedGuild
      ? `${botsHere} Astron bot${botsHere === 1 ? '' : 's'} in this server`
      : (state.authenticated ? 'Select a Discord server above' : 'Sign in with Discord to get started');
  }

  const list = document.getElementById('overview-bot-list');
  if (list) {
    if (!nodes.length) {
      list.innerHTML = '<div class="overview-empty">No bot status received yet. The fleet will appear here when the dashboard connects.</div>';
    } else {
      list.innerHTML = nodes.map((node) => {
        const online = node.status !== 'offline';
        const statusLabel = online
          ? (node.status === 'streaming' ? 'Streaming' : 'Online')
          : 'Offline';
        const guildCount = Number(node.guilds_count || 0);
        const details = [
          node.ping_ms == null ? null : `${Math.round(node.ping_ms)} ms`,
          `${guildCount} server${guildCount === 1 ? '' : 's'}`,
          node.type === 'voice' && Number(node.active_rooms || 0) ? `${node.active_rooms} active room${Number(node.active_rooms) === 1 ? '' : 's'}` : null,
        ].filter(Boolean).join('  /  ');
        return `<article class="overview-bot-row">
          <span class="bot-state-dot ${online ? 'is-online' : 'is-offline'}" aria-hidden="true"></span>
          <span class="overview-bot-copy"><strong>${escapeHtml(String(node.name || 'Astron bot'))}</strong><small>${escapeHtml(details || (online ? 'Connected to Discord' : 'Check the bot process and token configuration'))}</small></span>
          <span class="overview-bot-status ${online ? 'is-online' : 'is-offline'}">${statusLabel}</span>
        </article>`;
      }).join('');
    }
  }

  const note = document.getElementById('overview-health-message');
  if (note) {
    const offlineCount = nodes.length - onlineNodes.length;
    note.textContent = !state.authenticated
      ? 'Sign in with Discord to see servers and manage your bot fleet.'
      : (state.clusterError
        ? 'Live bot status is unavailable. Check the dashboard connection and try refreshing.'
        : (state.guildsError || (!nodes.length
        ? 'No bot status has arrived yet. Check that the Astron cluster is running.'
        : (offlineCount
          ? `${offlineCount} bot${offlineCount === 1 ? ' is' : 's are'} offline. The fleet list shows which connection needs attention.`
          : 'All reporting bots are connected. Choose a server to start managing it.'))));
  }

  const updated = document.getElementById('overview-updated');
  if (updated && nodes.length) {
    updated.textContent = `Updated ${new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date())}`;
  }
}

// ============================================================
// GUILDS & SERVER DATA
// ============================================================
async function loadGuilds() {
  state.guildsError = '';
  try {
    const res = await fetch('/api/guilds');
    let data = null;
    if (res.ok) {
      data = await res.json();
      state.guilds = (data.guilds || []).map(g => ({
        ...g,
        id: String(g.id)
      }));
    } else {
      throw new Error('Using fallback simulated servers');
    }

    el.guildSelector.innerHTML = '';
    if (state.guilds.length === 0) {
      el.guildSelector.innerHTML = '<option value="">No manageable servers with Astron online</option>';
      state.guildsError = state.authenticated
        ? 'No manageable servers with an Astron bot were found. Invite a bot or check your Discord server permissions.'
        : 'Sign in with Discord to view your servers.';
      renderOverview();
      return;
    }

    state.guilds.forEach((g) => {
      const opt = document.createElement('option');
      opt.value = String(g.id);
      const botsCnt = g.bots_present ? g.bots_present.length : 6;
      opt.textContent = `${g.name}${g.member_count > 0 ? ` (${g.member_count} members)` : ''} [${botsCnt} Nodes Active]`;
      el.guildSelector.appendChild(opt);
    });

    if (el.selectDirectGuild) {
      el.selectDirectGuild.innerHTML = '<option value="" disabled selected>Select a server...</option>';
      state.guilds.forEach((g) => {
        const dOpt = document.createElement('option');
        dOpt.value = String(g.id);
        dOpt.textContent = `${g.name} (${g.id})`;
        el.selectDirectGuild.appendChild(dOpt);
      });
      if (state.guilds.length > 0) {
        el.selectDirectGuild.value = String(state.guilds[0].id);
      }
    }

    // Restore saved guild preference or default to primary guild
    const savedGuildId = localStorage.getItem('astron_last_selected_guild');
    if (savedGuildId && state.guilds.some(g => String(g.id) === String(savedGuildId))) {
      state.currentGuildId = String(savedGuildId);
    } else if (!state.currentGuildId || !state.guilds.some(g => String(g.id) === String(state.currentGuildId))) {
      const primaryGuild = state.guilds.find(g => String(g.id) === '1491545502280585359') || state.guilds[0];
      state.currentGuildId = String(primaryGuild.id);
    }
    localStorage.setItem('astron_last_selected_guild', state.currentGuildId);
    el.guildSelector.value = String(state.currentGuildId);

    el.guildSelector.onchange = (e) => {
      state.currentGuildId = String(e.target.value);
      localStorage.setItem('astron_last_selected_guild', state.currentGuildId);
      fetchGuildState(state.currentGuildId);
      loadEcosystemData(state.currentGuildId);
      loadFeatureWorkspace();
      sendWsMessage({ type: 'subscribe', guild_id: state.currentGuildId });
    };

    await fetchGuildState(state.currentGuildId);
    await loadEcosystemData(state.currentGuildId);
    await loadFeatureWorkspace();
    renderOverview();
  } catch (err) {
    console.warn('Astron offline, loading simulated server cluster:', err.message);
    state.guilds = [
      { id: "101", name: "Cyber Haven Community", member_count: 4820, bots_present: ["1","2","3","4","5","6"] },
      { id: "102", name: "Adham Dev Lounge", member_count: 850, bots_present: ["1","2","3"] },
      { id: "103", name: "Morocco Gamers Hub", member_count: 1940, bots_present: ["1","2","4"] }
    ];
    if (el.guildSelector) {
      el.guildSelector.innerHTML = '';
      state.guilds.forEach((g) => {
        const opt = document.createElement('option');
        opt.value = String(g.id);
        opt.textContent = `${g.name} (${g.member_count} members) [${g.bots_present.length} Nodes Active]`;
        el.guildSelector.appendChild(opt);
      });
      el.guildSelector.value = "101";
    }
    state.currentGuildId = "101";
    const fleetStatus = document.getElementById('fleet-status-text');
    if (fleetStatus) fleetStatus.textContent = '6 Bot Nodes Connected (Live Simulation)';
    renderOverview();
  }
}

async function fetchGuildState(guildId) {
  if (!guildId) { renderOverview(); return; }
  try {
    const res = await fetch(`/api/guild/${guildId}`);
    const data = await res.json();
    state.guildData = data;
    renderOverview();

    // Populate voice channels for quick remote summoning
    if (el.selectVoiceChannel) {
      el.selectVoiceChannel.innerHTML = '<option value="" disabled selected>Select Voice Channel...</option>';
      const vcs = data.voice_channels || [];
      if (vcs.length === 0) {
        el.selectVoiceChannel.innerHTML = '<option value="" disabled>No Voice Channels in Server</option>';
      } else {
        vcs.forEach((vc) => {
          const opt = document.createElement('option');
          opt.value = vc.id;
          opt.textContent = `🔊 ${vc.name}${vc.members_count > 0 ? ` (${vc.members_count} listening)` : ''}`;
          el.selectVoiceChannel.appendChild(opt);
        });
        el.selectVoiceChannel.selectedIndex = 1;
      }
    }

    renderCurrentGuild();
  } catch (err) {
    console.error('Failed to fetch guild state:', err);
  }
}

function setupSummonEvents() {
  if (el.btnSummonBot) {
    el.btnSummonBot.addEventListener('click', async () => {
      if (!state.currentGuildId) {
        showToast('Please select a server first!', 'warning');
        return;
      }
      const channelId = el.selectVoiceChannel ? el.selectVoiceChannel.value : null;
      try {
        el.btnSummonBot.disabled = true;
        el.btnSummonBot.innerHTML = '<span>Summoning...</span>';
        const res = await fetch('/api/music/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guild_id: state.currentGuildId,
            bot_id: state.activeBotId,
            channel_id: channelId
          })
        });
        const d = await res.json();
        if (d.success) {
          showToast(d.message, 'success');
          await fetchGuildState(state.currentGuildId);
        } else {
          showToast(d.error || 'Failed to summon bot', 'error');
        }
      } catch (err) {
        showToast(`Summon error: ${err}`, 'error');
      } finally {
        el.btnSummonBot.disabled = false;
        el.btnSummonBot.innerHTML = '<span>⚡ Summon Bot</span>';
      }
    });
  }

  if (el.btnRefreshGuilds) {
    el.btnRefreshGuilds.addEventListener('click', async () => {
      el.btnRefreshGuilds.style.transform = 'rotate(360deg)';
      showToast('Refreshing Discord servers & bot cluster...', 'info');
      await loadClusterBots();
      await loadGuilds();
      setTimeout(() => { el.btnRefreshGuilds.style.transform = ''; }, 500);
    });
  }
}

// ============================================================
// RENDERERS
// ============================================================
function renderCurrentGuild() {
  if (!state.guildData) return;
  renderNodesGrid();
  renderMusicPlayer();
  renderQueue();
  renderRadioStations();
  renderTempVoice();
}

// 1. Render Audio Engine Nodes
function renderNodesGrid() {
  const bots = state.guildData.bots || [];
  el.nodesGrid.innerHTML = '';

  bots.forEach((b) => {
    const card = document.createElement('div');
    const isAct = b.id === state.activeBotId;
    const isStreaming = b.is_connected && (b.is_playing || b.is_paused);

    card.className = `node-card ${isAct ? 'active' : ''} ${isStreaming ? 'streaming' : ''} ${b.is_online === false ? 'offline' : ''}`;
    card.onclick = () => {
      state.activeBotId = b.id;
      renderNodesGrid();
      renderMusicPlayer();
      renderQueue();
    };

    const statusText = b.is_online === false
      ? '🔴 Offline • Bot process is not connected'
      : (isStreaming
        ? `🟢 Streaming in #${b.channel_name || 'voice'} (${b.channel_members || 0})`
        : (b.is_connected ? `⚡ In #${b.channel_name || 'voice'} • Idle` : '🟢 Online • Ready'));

    card.innerHTML = `
      <div class="node-header-row">
        <span class="node-title">${b.name}</span>
        <span class="node-status-indicator ${b.is_online === false ? 'offline' : (isStreaming ? 'streaming' : (b.is_connected ? 'connected' : 'online'))}"></span>
      </div>
      <div class="node-channel-info">${statusText}</div>
    `;
    el.nodesGrid.appendChild(card);
  });
}

// 2. Render Hero Music Player
function renderMusicPlayer() {
  const bots = state.guildData.bots || [];
  const curBot = bots.find((b) => b.id === state.activeBotId) || bots[0];
  if (!curBot) return;

  const current = curBot.current;
  const isPlaying = curBot.is_playing;
  const isPaused = curBot.is_paused;

  // Visualizer & Vinyl state
  if (state.visualizer) {
    state.visualizer.setPlaying(isPlaying && !isPaused);
  }

  if (isPlaying && !isPaused) {
    el.playerHeroCard.classList.add('is-playing');
  } else {
    el.playerHeroCard.classList.remove('is-playing');
  }

  // Play / Pause Icon
  if (isPlaying && !isPaused) {
    el.playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>';
  } else {
    el.playIcon.innerHTML = '<polygon points="6 3 20 12 6 21 6 3"></polygon>';
  }

  // Track Info
  if (current) {
    el.currentTitle.textContent = current.title || 'Unknown Title';
    el.currentUploader.textContent = current.uploader || 'Unknown Artist';
    el.currentCover.src = current.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
    el.liveStreamBadge.textContent = current.is_live ? '🔴 24/7 LIVE BROADCAST' : 'STUDIO LOSSLESS 320K';
  } else {
    el.currentTitle.textContent = 'Ready for Stream';
    el.currentUploader.textContent = 'Select a song or radio station below';
    el.currentCover.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
    el.liveStreamBadge.textContent = 'ONLINE • READY';
  }

  el.currentBotChip.textContent = `Node #${curBot.id} (${curBot.name})`;
  if (el.currentChannelChip) {
    if (curBot.is_connected && curBot.channel_name) {
      el.currentChannelChip.textContent = `🔊 #${curBot.channel_name}`;
      el.currentChannelChip.className = 'cyber-chip chip-cyan';
    } else {
      el.currentChannelChip.textContent = '🟢 Online • Standby';
      el.currentChannelChip.className = 'cyber-chip chip-emerald';
    }
  }

  // Scrub Bar
  const elapsed = curBot.elapsed || 0;
  const duration = (current && current.duration) ? current.duration : 0;

  el.timeElapsed.textContent = formatDuration(elapsed);
  el.timeTotal.textContent = duration > 0 ? formatDuration(duration) : 'Live';

  const percent = duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0;
  el.scrubFill.style.width = `${percent}%`;
  el.scrubHandle.style.left = `${percent}%`;

  // Volume & Loop
  el.volumeSlider.value = Math.round((curBot.volume || 1.0) * 100);
  el.volLabel.textContent = `${el.volumeSlider.value}%`;

  const loopModes = ['OFF', 'TRACK', 'QUEUE'];
  el.loopStateText.textContent = loopModes[curBot.loop_mode || 0];

  // Active FX Filter Highlight
  state.activeFilter = curBot.current_filter || null;
  document.querySelectorAll('.fx-chip').forEach((chip) => {
    const f = chip.getAttribute('data-filter');
    if (f && f === state.activeFilter) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

// 3. Render Queue
function renderQueue() {
  const bots = state.guildData.bots || [];
  const curBot = bots.find((b) => b.id === state.activeBotId) || bots[0];
  const queue = (curBot && curBot.queue) ? curBot.queue : [];

  el.queueCounter.textContent = `${queue.length} Track${queue.length !== 1 ? 's' : ''}`;

  if (queue.length === 0) {
    el.queueTrackList.innerHTML = `
      <div class="queue-empty-state">
        <div class="empty-icon">📜</div>
        <p>The queue is empty. Use the search bar or choose a radio station to add music!</p>
      </div>
    `;
    return;
  }

  el.queueTrackList.innerHTML = '';
  queue.forEach((track, idx) => {
    const item = document.createElement('div');
    item.className = 'queue-item';
    item.innerHTML = `
      <span class="queue-index">#${idx + 1}</span>
      <img class="queue-item-thumb" src="${track.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80'}" alt="Thumb">
      <div class="queue-item-details">
        <div class="queue-item-title">${escapeHtml(track.title)}</div>
        <div class="queue-item-uploader">${escapeHtml(track.uploader || 'Unknown')}</div>
      </div>
      <span class="queue-item-duration">${formatDuration(track.duration)}</span>
      <button class="queue-remove-btn" title="Remove Track" onclick="removeQueueTrack(${idx})">✕</button>
    `;
    el.queueTrackList.appendChild(item);
  });
}

// 4. Render Radio Stations Grid
function renderRadioStations() {
  const stations = state.guildData.stations || {};
  el.radioStationsGrid.innerHTML = '';

  for (const [stId, st] of Object.entries(stations)) {
    const item = document.createElement('div');
    item.className = 'station-item';
    item.onclick = () => launchRadioStation(stId, st.name);
    item.innerHTML = `
      <span class="station-icon">${st.icon || '📻'}</span>
      <div class="station-details">
        <span class="station-name">${st.name}</span>
        <span class="station-category">${st.category || 'Live Radio'}</span>
      </div>
    `;
    el.radioStationsGrid.appendChild(item);
  }
}

// 5. Render TempVoice Command Hub
function renderTempVoice() {
  const tv = state.guildData.tempvoice || {};
  const stats = tv.stats || {};
  const rooms = tv.rooms || [];

  el.statActiveRooms.textContent = rooms.length;
  el.statTotalCreated.textContent = stats.total_created_rooms ?? stats.created_rooms_count ?? 0;
  el.statTalkTime.textContent = `${Math.floor((stats.total_voice_seconds || 0) / 3600)}h ${Math.floor(((stats.total_voice_seconds || 0) % 3600) / 60)}m`;
  el.statPlanName.textContent = tv.is_vip ? '👑 VIP Lossless' : 'Free Plan';

  if (rooms.length === 0) {
    el.voiceRoomsGrid.innerHTML = `
      <div class="queue-empty-state" style="grid-column: 1 / -1; padding: 40px;">
        <div class="empty-icon">🎙️</div>
        <p>No active temporary voice lounges right now in this server.<br>Join <strong>➕ Join to Create</strong> in Discord to spawn one automatically!</p>
      </div>
    `;
    return;
  }

  el.voiceRoomsGrid.innerHTML = '';
  rooms.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'voice-room-card';

    const maxLimit = r.user_limit || 0;
    const memberCount = r.member_count || 0;
    const occupancyPercent = maxLimit > 0 ? Math.min(100, Math.round((memberCount / maxLimit) * 100)) : 100;

    card.innerHTML = `
      <div class="room-card-top">
        <div class="room-name-wrap">
          <span class="room-name">${escapeHtml(r.name)}</span>
          <div class="room-owner-tag">
            <span>👑 Owner: <strong>${escapeHtml(r.owner_name || 'Member')}</strong></span>
          </div>
        </div>
        <div class="room-badges-wrap">
          ${r.is_locked ? '<span class="cyber-chip" style="color: #f43f5e; border-color: #f43f5e;">🔒 Locked</span>' : '<span class="cyber-chip chip-cyan">🔓 Open</span>'}
          ${r.is_hidden ? '<span class="cyber-chip" style="color: #f59e0b;">👁️ Hidden</span>' : ''}
        </div>
      </div>

      <div class="room-occupancy-bar">
        <div class="occupancy-labels">
          <span>Capacity (${memberCount} / ${maxLimit > 0 ? maxLimit : '∞'})</span>
          <span>${r.bitrate ? Math.round(r.bitrate / 1000) + 'k HD' : '64k'}</span>
        </div>
        <div class="occupancy-track">
          <div class="occupancy-fill" style="width: ${occupancyPercent}%"></div>
        </div>
      </div>

      <div class="room-card-actions">
        <button class="room-btn" onclick="toggleRoomLock(${r.channel_id}, ${!r.is_locked})">
          ${r.is_locked ? '🔓 Unlock' : '🔒 Lock'}
        </button>
        <button class="room-btn" onclick="openRenameModal(${r.channel_id}, '${escapeHtml(r.name)}')">
          🔀 Rename
        </button>
        <button class="room-btn" onclick="promptRoomLimit(${r.channel_id})">
          👤 Limit
        </button>
        <button class="room-btn" onclick="cycleRoomBitrate(${r.channel_id}, ${r.bitrate || 64000})">
          🎚️ Bitrate
        </button>
        <button class="room-btn room-btn-danger" onclick="terminateVoiceRoom(${r.channel_id})">
          🗑️ Close
        </button>
      </div>
    `;
    el.voiceRoomsGrid.appendChild(card);
  });
}

// ============================================================
// REMOTE PLAYER CONTROLS (REST API Calls)
// ============================================================
function setupTransportEvents() {
  el.btnPlayPause.addEventListener('click', () => sendPlayerAction('toggle_pause'));
  el.btnSkip.addEventListener('click', () => sendPlayerAction('skip'));
  el.btnPrev.addEventListener('click', () => sendPlayerAction('previous'));
  el.btnStop.addEventListener('click', () => sendPlayerAction('stop'));
  el.btnRewind.addEventListener('click', () => sendPlayerAction('rewind_15'));
  el.btnForward.addEventListener('click', () => sendPlayerAction('forward_15'));
  el.btnLoop.addEventListener('click', () => sendPlayerAction('cycle_loop'));
  el.btnShuffle.addEventListener('click', () => sendPlayerAction('shuffle'));

  // Volume Slider
  el.volumeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    el.volLabel.textContent = `${val}%`;
  });
  el.volumeSlider.addEventListener('change', (e) => {
    const val = parseInt(e.target.value);
    sendPlayerAction('volume', { value: val / 100 });
  });

  // Mute button
  el.btnMute.addEventListener('click', () => {
    const isMuted = parseInt(el.volumeSlider.value) === 0;
    const target = isMuted ? 100 : 0;
    el.volumeSlider.value = target;
    el.volLabel.textContent = `${target}%`;
    sendPlayerAction('volume', { value: target / 100 });
  });

  // Scrub Seek Bar
  el.scrubBar.addEventListener('click', (e) => {
    const rect = el.scrubBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));

    const curBot = (state.guildData && state.guildData.bots) ? state.guildData.bots.find((b) => b.id === state.activeBotId) : null;
    const duration = (curBot && curBot.current && curBot.current.duration) ? curBot.current.duration : 0;

    if (duration > 0) {
      const targetSecs = Math.round(ratio * duration);
      sendPlayerAction('seek', { seconds: targetSecs });
    }
  });

  el.btnClearQueue.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire queue?')) {
      sendPlayerAction('clear_queue');
    }
  });
}

function setupFxSwitches() {
  document.querySelectorAll('.fx-chip[data-filter]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.getAttribute('data-filter');
      sendPlayerAction('filter', { filter: f });
    });
  });

  document.getElementById('fx-clear').addEventListener('click', () => {
    sendPlayerAction('filter', { filter: null });
  });
}

async function sendPlayerAction(action, payload = {}) {
  if (!state.currentGuildId) return;
  try {
    const res = await fetch('/api/music/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guild_id: state.currentGuildId,
        bot_id: state.activeBotId,
        action: action,
        ...payload
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast(`⚡ ${result.message || 'Action executed successfully!'}`, 'success');
      await fetchGuildState(state.currentGuildId);
    } else {
      showToast(`❌ ${result.error || 'Failed to execute command'}`, 'error');
    }
  } catch (err) {
    showToast(`❌ Network Error: ${err.message}`, 'error');
  }
}

// ============================================================
// SEARCH & RADIO LAUNCH
// ============================================================
function setupSearchAndRadio() {
  el.btnInstantPlay.addEventListener('click', () => executeSearchPlay(false));
  el.btnEnqueue.addEventListener('click', () => executeSearchPlay(true));
  el.inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      executeSearchPlay(false);
    }
  });
}

async function executeSearchPlay(isEnqueueOnly = false) {
  const q = el.inputSearch.value.trim();
  if (!q) {
    showToast('⚠️ Please enter a song title or URL to search', 'warning');
    return;
  }
  if (!state.currentGuildId) return;

  showToast(`🔍 Searching: "${q}"...`, 'info');
  try {
    const res = await fetch('/api/music/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guild_id: state.currentGuildId,
        bot_id: state.activeBotId,
        query: q,
        enqueue_only: isEnqueueOnly
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast(`🎶 Now Playing: ${result.title || q}`, 'success');
      el.inputSearch.value = '';
      await fetchGuildState(state.currentGuildId);
    } else {
      showToast(`❌ ${result.error || 'Failed to play search result'}`, 'error');
    }
  } catch (err) {
    showToast(`❌ Play Error: ${err.message}`, 'error');
  }
}

async function launchRadioStation(stationId, stationName) {
  if (!state.currentGuildId) return;
  showToast(`📻 Tuning into ${stationName}...`, 'info');
  try {
    const res = await fetch('/api/music/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guild_id: state.currentGuildId,
        bot_id: state.activeBotId,
        station_id: stationId
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast(`📻 Streaming: ${stationName} live!`, 'success');
      await fetchGuildState(state.currentGuildId);
    } else {
      showToast(`❌ ${result.error || 'Failed to stream radio station'}`, 'error');
    }
  } catch (err) {
    showToast(`❌ Radio Error: ${err.message}`, 'error');
  }
}

async function removeQueueTrack(index) {
  await sendPlayerAction('remove_track', { index: index });
}

// ============================================================
// TEMPVOICE ACTIONS
// ============================================================
function setupTempVoiceEvents() {
  el.btnRefreshRooms.addEventListener('click', () => fetchGuildState(state.currentGuildId));
  el.btnSyncDiscordPanel.addEventListener('click', async () => {
    showToast('🔄 Synchronizing Master Control Panel in Discord...', 'info');
    try {
      const res = await fetch('/api/voice/sync_panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guild_id: state.currentGuildId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('✅ Discord #🎛️-voice-control panel refreshed successfully!', 'success');
      } else {
        showToast(`❌ Error: ${data.error}`, 'error');
      }
    } catch (err) {
      showToast(`❌ Error: ${err.message}`, 'error');
    }
  });

  // Rename Modal
  el.modalCloseRename.addEventListener('click', closeRenameModal);
  el.btnCancelRename.addEventListener('click', closeRenameModal);
  el.btnConfirmRename.addEventListener('click', async () => {
    const newName = el.inputNewChannelName.value.trim();
    if (!newName || !renameTargetChannelId) return;
    await sendVoiceAction(renameTargetChannelId, 'rename', { name: newName });
    closeRenameModal();
  });
}

function openRenameModal(channelId, currentName) {
  renameTargetChannelId = channelId;
  el.inputNewChannelName.value = currentName || '';
  el.renameModal.classList.add('active');
  el.inputNewChannelName.focus();
}

function closeRenameModal() {
  renameTargetChannelId = null;
  el.renameModal.classList.remove('active');
}

async function toggleRoomLock(channelId, shouldLock) {
  await sendVoiceAction(channelId, shouldLock ? 'lock' : 'unlock');
}

async function promptRoomLimit(channelId) {
  const val = prompt('Set member capacity limit (0 = Unlimited):', '5');
  if (val !== null) {
    const limit = parseInt(val) || 0;
    await sendVoiceAction(channelId, 'limit', { limit: limit });
  }
}

async function cycleRoomBitrate(channelId, currentBitrate) {
  const bitrates = [64000, 128000, 256000, 384000];
  const nextIdx = (bitrates.indexOf(currentBitrate) + 1) % bitrates.length;
  const nextBitrate = bitrates[nextIdx];
  await sendVoiceAction(channelId, 'bitrate', { bitrate: nextBitrate });
}

async function terminateVoiceRoom(channelId) {
  if (confirm('Are you sure you want to terminate and delete this temporary room?')) {
    await sendVoiceAction(channelId, 'delete');
  }
}

async function sendVoiceAction(channelId, action, payload = {}) {
  if (!state.currentGuildId) return;
  try {
    const res = await fetch('/api/voice/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guild_id: state.currentGuildId,
        channel_id: channelId,
        action: action,
        ...payload
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast(`🛡️ ${result.message || 'Room updated!'}`, 'success');
      await fetchGuildState(state.currentGuildId);
    } else {
      showToast(`❌ ${result.error || 'Failed to update voice room'}`, 'error');
    }
  } catch (err) {
    showToast(`❌ Action Error: ${err.message}`, 'error');
  }
}

// ============================================================
// VIP & MONETIZATION LICENSE VAULT
// ============================================================
function setupVipEvents() {
  if (el.webhookEndpointUrl) {
    const target = `${API_BASE || window.location.origin}/api/webhook/payment`;
    el.webhookEndpointUrl.textContent = target;
  }
  if (el.btnGenerateKeys) {
    el.btnGenerateKeys.addEventListener('click', handleGenerateKeys);
  }
  if (el.btnCopyGenerated) {
    el.btnCopyGenerated.addEventListener('click', () => {
      const text = el.generatedKeysTextarea.value.trim();
      if (text) copyToClipboard(text, '📋 All generated keys copied to clipboard!');
    });
  }
  if (el.btnDirectGrant) {
    el.btnDirectGrant.addEventListener('click', handleDirectGrant);
  }
  if (el.btnDirectRevoke) {
    el.btnDirectRevoke.addEventListener('click', handleDirectRevoke);
  }
  if (el.btnCopyWebhookUrl) {
    el.btnCopyWebhookUrl.addEventListener('click', () => {
      const url = el.webhookEndpointUrl ? el.webhookEndpointUrl.textContent.trim() : `${API_BASE || window.location.origin}/api/webhook/payment`;
      copyToClipboard(url, '📋 Webhook endpoint URL copied!');
    });
  }
  if (el.btnTestWebhook) {
    el.btnTestWebhook.addEventListener('click', handleTestWebhook);
  }
  if (el.btnRefreshVault) {
    el.btnRefreshVault.addEventListener('click', () => loadVipVault(true));
  }
  if (el.inputVaultSearch) {
    el.inputVaultSearch.addEventListener('input', () => renderKeysTable());
  }

  // Vault Filter Pills
  document.querySelectorAll('.filter-pills .pill').forEach((pill) => {
    pill.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      state.vipActiveFilter = e.target.dataset.filter || 'all';
      renderKeysTable();
    });
  });
}

async function loadVipVault(showToastFeedback = false) {
  try {
    const res = await fetch('/api/keys');
    const data = await res.json();
    state.vipKeys = data.keys || [];

    if (data.stats) {
      if (el.statVipClaimed) el.statVipClaimed.textContent = data.stats.premium_guilds ?? data.stats.claimed_keys ?? 0;
      if (el.statVipAvailable) el.statVipAvailable.textContent = data.stats.available_keys ?? 0;
      if (el.statVipTotalKeys) el.statVipTotalKeys.textContent = data.stats.total_keys ?? 0;
      if (el.statVipRevenue) el.statVipRevenue.textContent = `$${(data.stats.est_revenue || 0).toFixed(2)}`;
    }

    if (el.vaultKeyCounter) {
      el.vaultKeyCounter.textContent = `${state.vipKeys.length} Total Keys`;
    }

    renderKeysTable();

    if (showToastFeedback) {
      showToast('🔄 License Vault refreshed successfully!', 'success');
    }
  } catch (err) {
    showToast(`❌ Error loading license vault: ${err.message}`, 'error');
  }
}

function renderKeysTable() {
  if (!el.keysTableBody) return;

  const query = (el.inputVaultSearch ? el.inputVaultSearch.value : '').toLowerCase().trim();
  const filter = state.vipActiveFilter || 'all';

  let filtered = state.vipKeys.filter(k => {
    if (filter === 'unclaimed' && k.is_claimed) return false;
    if (filter === 'claimed' && !k.is_claimed) return false;
    if (query) {
      const matchKey = (k.license_key || '').toLowerCase().includes(query);
      const matchNote = (k.note || '').toLowerCase().includes(query);
      const matchGuild = String(k.claimed_by_guild || '').includes(query);
      if (!matchKey && !matchNote && !matchGuild) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    el.keysTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-dim);">
          No license keys match your current filter or search.
        </td>
      </tr>
    `;
    return;
  }

  el.keysTableBody.innerHTML = filtered.map(k => {
    const bType = (k.bot_type || 'all').toLowerCase();
    let tierBadge = '<span class="cyber-chip chip-gold">👑 Ultra Bundle</span>';
    if (bType === 'music') {
      tierBadge = '<span class="cyber-chip chip-magenta">🎵 Music VIP</span>';
    } else if (bType === 'tempvoice' || bType === 'voice') {
      tierBadge = '<span class="cyber-chip chip-cyan">🎙️ Voice VIP</span>';
    }

    const durationStr = k.days >= 9999 ? '♾️ Lifetime' : `${k.days} Days`;
    const isClaimed = Boolean(k.is_claimed);
    const statusBadge = isClaimed
      ? '<span class="stat-badge badge-gold">👑 Claimed</span>'
      : '<span class="stat-badge badge-unclaimed">🟢 Available</span>';

    const claimedGuild = k.claimed_by_guild ? `<code>${k.claimed_by_guild}</code>` : '<span style="color:var(--text-dim);">—</span>';
    const noteStr = k.note ? escapeHtml(k.note) : '<span style="color:var(--text-dim);">None</span>';
    const createdStr = k.created_at ? k.created_at.substring(0, 10) : '—';

    return `
      <tr>
        <td>
          <div class="key-copy-cell">
            <span class="mono-key">${escapeHtml(k.license_key)}</span>
            <button class="cyber-btn btn-ghost btn-xs" onclick="copyToClipboard('${escapeHtml(k.license_key)}', '📋 Key copied!')">📋</button>
          </div>
        </td>
        <td>${tierBadge}</td>
        <td><strong>${durationStr}</strong></td>
        <td>${statusBadge}</td>
        <td>${claimedGuild}</td>
        <td>${noteStr}</td>
        <td style="font-size:0.75rem; color:var(--text-dim);">${createdStr}</td>
        <td>
          <button class="cyber-btn btn-danger-ghost btn-xs" onclick="handleRevokeKey('${escapeHtml(k.license_key)}')">
            🗑️ Revoke
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

async function handleGenerateKeys() {
  const tier = el.selectKeyTier ? el.selectKeyTier.value : 'all';
  const days = parseInt(el.selectKeyDuration ? el.selectKeyDuration.value : '30') || 30;
  const count = parseInt(el.inputKeyCount ? el.inputKeyCount.value : '1') || 1;
  const note = el.inputKeyNote ? el.inputKeyNote.value.trim() : '';

  try {
    const res = await fetch('/api/keys/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bot_type: tier,
        days: days,
        count: count,
        note: note
      })
    });
    const result = await res.json();
    if (result.success && result.keys) {
      showToast(`🎉 Generated ${result.keys.length} license key(s)!`, 'success');
      if (el.generatedOutputBox && el.generatedKeysTextarea) {
        el.generatedKeysTextarea.value = result.keys.join('\n');
        el.generatedOutputBox.style.display = 'block';
      }
      if (el.inputKeyNote) el.inputKeyNote.value = '';
      await loadVipVault();
    } else {
      showToast(`❌ Error: ${result.error || 'Failed to generate keys'}`, 'error');
    }
  } catch (err) {
    showToast(`❌ Generation Request Error: ${err.message}`, 'error');
  }
}

async function handleDirectGrant() {
  const guildId = el.selectDirectGuild ? el.selectDirectGuild.value : null;
  const tier = el.selectDirectTier ? el.selectDirectTier.value : 'all';
  const days = parseInt(el.selectDirectDays ? el.selectDirectDays.value : '30') || 30;

  if (!guildId) {
    showToast('❌ Please select a target server from the dropdown first.', 'error');
    return;
  }

  try {
    const res = await fetch('/api/vip/grant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guild_id: guildId,
        bot_type: tier,
        days: days
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast(`👑 ${result.message}`, 'success');
      await loadVipVault();
      if (state.currentGuildId == guildId) {
        fetchGuildState(guildId);
      }
    } else {
      showToast(`❌ ${result.error || 'Failed to grant VIP'}`, 'error');
    }
  } catch (err) {
    showToast(`❌ Direct Grant Error: ${err.message}`, 'error');
  }
}

async function handleDirectRevoke() {
  const guildId = el.selectDirectGuild ? el.selectDirectGuild.value : null;
  const tier = el.selectDirectTier ? el.selectDirectTier.value : 'all';

  if (!guildId) {
    showToast('❌ Please select a target server from the dropdown first.', 'error');
    return;
  }

  if (!confirm(`Are you sure you want to revoke VIP from server ID ${guildId}?`)) {
    return;
  }

  try {
    const res = await fetch('/api/vip/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guild_id: guildId,
        bot_type: tier
      })
    });
    const result = await res.json();
    if (result.success) {
      showToast(`🛡️ ${result.message}`, 'success');
      await loadVipVault();
      if (state.currentGuildId == guildId) {
        fetchGuildState(guildId);
      }
    } else {
      showToast(`❌ ${result.error || 'Failed to revoke VIP'}`, 'error');
    }
  } catch (err) {
    showToast(`❌ Direct Revoke Error: ${err.message}`, 'error');
  }
}

async function handleRevokeKey(key) {
  if (!confirm(`Revoke and permanently delete key: ${key}? If claimed, server VIP will also be canceled.`)) {
    return;
  }
  try {
    const res = await fetch('/api/keys/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: key })
    });
    const result = await res.json();
    if (result.success) {
      showToast(`🗑️ ${result.message}`, 'success');
      await loadVipVault();
    } else {
      showToast(`❌ ${result.error || 'Failed to revoke key'}`, 'error');
    }
  } catch (err) {
    showToast(`❌ Revoke Error: ${err.message}`, 'error');
  }
}

async function handleTestWebhook() {
  if (!el.btnTestWebhook) return;
  el.btnTestWebhook.disabled = true;
  el.btnTestWebhook.innerHTML = '<span>⏳ Firing test webhook...</span>';

  try {
    const res = await fetch('/api/webhook/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const result = await res.json();
    if (el.webhookTestResult && el.webhookTestStatus && el.webhookTestBody) {
      el.webhookTestResult.style.display = 'block';
      el.webhookTestStatus.innerHTML = result.success
        ? '<strong style="color:#10b981;">✅ 200 OK — Key Auto-Generated Successfully!</strong>'
        : '<strong style="color:#f43f5e;">❌ Webhook Error</strong>';
      el.webhookTestBody.textContent = JSON.stringify(result, null, 2);
    }
    if (result.success) showToast(result.message || 'Test key generated.', 'success');
    else showToast(result.error || 'Payment integration test failed.', 'error');
    await loadVipVault();
  } catch (err) {
    showToast(`❌ Webhook Test Failed: ${err.message}`, 'error');
  } finally {
    el.btnTestWebhook.disabled = false;
    el.btnTestWebhook.innerHTML = '<span>🚀 Fire Test Webhook Purchase Event</span>';
  }
}

function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, 'success');
    }).catch(() => {
      fallbackCopyText(text, successMsg);
    });
  } else {
    fallbackCopyText(text, successMsg);
  }
}

function fallbackCopyText(text, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast(successMsg, 'success');
  } catch (err) {
    showToast(`Copy failed: ${text}`, 'error');
  }
  ta.remove();
}

// ============================================================
// UTILITIES & TOASTS
// ============================================================
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '00:00';
  seconds = Math.round(seconds);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const hours = Math.floor(mins / 60);
  if (hours > 0) {
    const remMins = mins % 60;
    return `${hours}:${remMins < 10 ? '0' : ''}${remMins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

function showToast(message, variant = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${variant}`;
  toast.textContent = message;
  el.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
