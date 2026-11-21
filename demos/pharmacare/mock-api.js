/* PharmaCare — in-page stand-in for api.php (static portfolio demo).
   Same actions, same JSON shapes as api.php; data starts from a real export. */
(function () {
  'use strict';
  var DB = {"me":{"id":1,"username":"pharmacien","role":"admin"},"clients":[{"id":8,"name":"Salma Berrada","med":"Fer + Vit C","dose":"1 cp","notes":"Anémie — cure de 2 mois","created_by":"pharmacien","created_at":"2026-09-23 09:15","visits":2},{"id":7,"name":"Hicham Nabi","med":"Levothyrox","dose":"50µg","notes":"Hypothyroïdie","created_by":"pharmacien","created_at":"2026-09-19 09:15","visits":1},{"id":6,"name":"Nadia Alaoui","med":"Ventoline","dose":"100µg","notes":"Asthme — spray","created_by":"assistant","created_at":"2026-09-15 09:15","visits":4},{"id":5,"name":"Mohammed Chafik","med":"Metformine","dose":"850mg","notes":"Diabète type 2","created_by":"pharmacien","created_at":"2026-09-11 09:15","visits":9},{"id":4,"name":"Khadija Rami","med":"Oméprazole","dose":"20mg","notes":"Traitement du reflux","created_by":"assistant","created_at":"2026-09-07 09:15","visits":5},{"id":3,"name":"Youssef Amine","med":"Ibuprofène","dose":"400mg","notes":"Allergie aux pénicillines","created_by":"pharmacien","created_at":"2026-09-04 09:15","visits":2},{"id":2,"name":"Fatima Zahra Idrissi","med":"Paracétamol","dose":"1g","notes":"Renouvellement mensuel","created_by":"pharmacien","created_at":"2026-09-01 09:15","visits":7},{"id":1,"name":"Ahmed Benali","med":"Amoxicilline","dose":"500mg","notes":"Traitement 7 jours","created_by":"pharmacien","created_at":"2026-08-29 09:15","visits":3}],"blacklist":[{"id":3,"name":"Rachid Nouri","reason":"Comportement agressif","created_by":"admin","created_at":"2026-09-21 09:15"},{"id":2,"name":"Client Inconnu","reason":"Impayé répété","created_by":"admin","created_at":"2026-09-13 09:15"},{"id":1,"name":"Karim Sabri","reason":"Ordonnances falsifiées","created_by":"admin","created_at":"2026-09-03 09:15"}],"users":[{"id":1,"username":"pharmacien","role":"admin","created_at":"2026-09-25 09:15"},{"id":2,"username":"assistant","role":"assistant","created_at":"2026-09-25 09:15"}],"stats":{"users":[{"username":"pharmacien","role":"admin","created_at":"2026-09-25 09:15","deleted":false,"clients":24,"today":0,"blacklist":0,"last":"2026-09-23 09:15"},{"username":"assistant","role":"assistant","created_at":"2026-09-25 09:15","deleted":false,"clients":9,"today":0,"blacklist":0,"last":"2026-09-15 09:15"}],"generated_at":"2026-09-25T10:16:57+01:00","period_start":null,"total_clients":33,"total_today":0,"total_blacklist":0,"total_all":33},"visits_log":[{"id":6,"client_id":8,"client_name":"Salma Berrada","old_visits":1,"new_visits":2,"changed_by":"pharmacien","changed_at":"2026-09-25 09:15"},{"id":5,"client_id":7,"client_name":"Hicham Nabi","old_visits":0,"new_visits":1,"changed_by":"pharmacien","changed_at":"2026-09-24 09:15"},{"id":4,"client_id":4,"client_name":"Khadija Rami","old_visits":4,"new_visits":5,"changed_by":"assistant","changed_at":"2026-09-23 09:15"},{"id":3,"client_id":1,"client_name":"Ahmed Benali","old_visits":2,"new_visits":3,"changed_by":"pharmacien","changed_at":"2026-09-23 09:15"},{"id":2,"client_id":5,"client_name":"Mohammed Chafik","old_visits":8,"new_visits":9,"changed_by":"pharmacien","changed_at":"2026-09-22 09:15"},{"id":1,"client_id":2,"client_name":"Fatima Zahra Idrissi","old_visits":6,"new_visits":7,"changed_by":"pharmacien","changed_at":"2026-09-22 09:15"}],"imgs":{"1":{"id":1,"id_img":null,"rx_img":null},"2":{"id":2,"id_img":null,"rx_img":null},"3":{"id":3,"id_img":null,"rx_img":null},"4":{"id":4,"id_img":null,"rx_img":null},"5":{"id":5,"id_img":null,"rx_img":null},"6":{"id":6,"id_img":null,"rx_img":null},"7":{"id":7,"id_img":null,"rx_img":null},"8":{"id":8,"id_img":null,"rx_img":null}}};
  var me = DB.me;
  var nextId = function (arr) { return arr.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1; };
  var iso = function () { return new Date().toISOString(); };

  function out(code, data) {
    return new Response(JSON.stringify(data), {
      status: code,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().trim().replace(/\s+/g, ' '); }
  function nameMatch(dbName, names) {
    var n = norm(dbName);
    for (var i = 0; i < names.length; i++) {
      var q = norm(names[i]);
      if (q.length < 2) continue;
      if (n === q || (q.length >= 3 && n.indexOf(q) !== -1) || (n.length >= 3 && q.indexOf(n) !== -1)) return true;
    }
    return false;
  }
  function findClients(names) {
    return DB.clients.filter(function (c) { return nameMatch(c.name, names); });
  }
  function findBL(names) {
    return DB.blacklist.filter(function (c) { return nameMatch(c.name, names); });
  }
  function recomputeStats() {
    var today = iso().slice(0, 10);
    var cl = {}, bl = {}, tc = {};
    DB.clients.forEach(function (c) {
      var ts = new Date(c.created_at);
      if (isNaN(ts)) return;
      var k = c.created_by;
      if (!cl[k]) cl[k] = { n: 0, last: null };
      cl[k].n += parseInt(c.visits, 10) || 0;
      if (!cl[k].last || ts > new Date(cl[k].last)) cl[k].last = c.created_at;
      if (iso().slice(0, 10) === today && c.created_at.slice(0, 10) === today) {
        tc[k] = (tc[k] || 0) + (parseInt(c.visits, 10) || 0);
      }
    });
    DB.blacklist.forEach(function (b) { bl[b.created_by] = (bl[b.created_by] || 0) + 1; });
    var rows = DB.users.map(function (u) {
      return {
        username: u.username, role: u.role, created_at: u.created_at, deleted: false,
        clients: cl[u.username] ? cl[u.username].n : 0,
        today: tc[u.username] || 0,
        blacklist: bl[u.username] || 0,
        last: cl[u.username] ? cl[u.username].last : null
      };
    });
    var total = function (k) { return rows.reduce(function (s, r) { return s + r[k]; }, 0); };
    return {
      users: rows,
      generated_at: iso(),
      period_start: DB.stats.period_start || null,
      total_clients: total('clients'),
      total_today: total('today'),
      total_blacklist: total('blacklist'),
      total_all: DB.clients.reduce(function (s, c) { return s + (parseInt(c.visits, 10) || 0); }, 0)
    };
  }

  function handle(action, params, method, body) {
    var id = parseInt(params.id, 10) || parseInt(body.id, 10) || 0;

    if (action === 'me') return out(200, { user: me });
    if (action === 'logout') return out(200, { ok: true });

    if (action === 'clients') return out(200, DB.clients);
    if (action === 'client_imgs') return out(200, DB.imgs[id] || { id_img: null, rx_img: null });

    if (action === 'client_add') {
      if (!body.name || !body.id_img || !body.rx_img) return out(400, { error: 'Nom + photos obligatoires' });
      if (!body.force) {
        var dups = findClients([body.name]);
        if (dups.length) return out(409, { error: 'Ce client existe deja dans la base !', existing: dups });
      }
      var nid = nextId(DB.clients);
      DB.imgs[nid] = { id_img: body.id_img, rx_img: body.rx_img };
      DB.clients.unshift({
        id: nid, name: String(body.name).trim(), med: body.med || '', dose: body.dose || '',
        notes: body.notes || '', created_by: me.username, created_at: iso(), visits: 1
      });
      return out(200, { ok: true, id: nid });
    }
    if (action === 'client_del') {
      DB.clients = DB.clients.filter(function (c) { return c.id !== id; });
      return out(200, { ok: true });
    }
    if (action === 'client_visits') {
      var v = parseInt(body.visits, 10);
      if (!id) return out(400, { error: 'ID manquant' });
      if (isNaN(v) || v < 0 || v > 999) return out(400, { error: 'Nombre de visites invalide (0-999)' });
      var c = DB.clients.filter(function (x) { return x.id === id; })[0];
      if (!c) return out(404, { error: 'Client introuvable' });
      var old = parseInt(c.visits, 10) || 0;
      c.visits = v;
      DB.visits_log.unshift({
        id: nextId(DB.visits_log), client_id: id, client_name: c.name,
        old_visits: old, new_visits: v, changed_by: me.username, changed_at: iso()
      });
      return out(200, { ok: true, visits: v });
    }
    if (action === 'client_edit') {
      if (!body.id_img && !body.rx_img) return out(400, { error: 'Ajoute au moins une photo' });
      var cur = DB.imgs[id] || { id_img: null, rx_img: null };
      DB.imgs[id] = { id_img: body.id_img || cur.id_img, rx_img: body.rx_img || cur.rx_img };
      return out(200, { ok: true });
    }
    if (action === 'visits_logs') return out(200, DB.visits_log);

    if (action === 'blacklist') return out(200, DB.blacklist);
    if (action === 'bl_add') {
      if (!body.name) return out(400, { error: 'Nom obligatoire' });
      var bid = nextId(DB.blacklist);
      DB.blacklist.unshift({
        id: bid, name: String(body.name).trim(), reason: body.reason || '',
        created_by: me.username, created_at: iso()
      });
      return out(200, { ok: true, id: bid });
    }
    if (action === 'bl_del') {
      DB.blacklist = DB.blacklist.filter(function (b) { return b.id !== id; });
      return out(200, { ok: true });
    }

    if (action === 'users') return out(200, DB.users);
    if (action === 'user_add') {
      if (!body.username || !body.password) return out(400, { error: 'Username + password obligatoires' });
      if (String(body.password).length < 4) return out(400, { error: 'Mot de passe trop court (min 4)' });
      if (DB.users.some(function (u) { return u.username === String(body.username).trim(); }))
        return out(400, { error: 'Username deja utilise' });
      DB.users.push({
        id: nextId(DB.users), username: String(body.username).trim(),
        role: body.role === 'admin' ? 'admin' : 'staff', created_at: iso()
      });
      return out(200, { ok: true });
    }
    if (action === 'user_del') {
      if (id === me.id) return out(400, { error: 'Impossible de supprimer votre propre compte' });
      DB.users = DB.users.filter(function (u) { return u.id !== id; });
      return out(200, { ok: true });
    }

    if (action === 'stats') return out(200, recomputeStats());
    if (action === 'reset_stats') return out(200, { ok: true, reset_at: iso() });
    if (action === 'password') {
      if (String(body.old || '') !== 'demo1234') return out(400, { error: 'Ancien mot de passe incorrect' });
      if (String(body.new || '').length < 4) return out(400, { error: 'Mot de passe trop court (min 4)' });
      return out(200, { ok: true });
    }

    if (action === 'analyze') {
      if (!body.id_img && !body.rx_img) return out(400, { error: 'Ajoute au moins une photo' });
      var nm = body.name || 'Nadia Alaoui';
      var extracted = {
        id_name: nm, rx_name: nm, medication: 'Amoxicilline 500mg',
        dosage: '3', doctor: 'Dr. Berrada', rx_notes: 'Traitement 7 jours'
      };
      var names = [nm];
      return out(200, {
        extracted: extracted, aiError: null, mismatch: false,
        exists: findClients(names).length > 0, blacklisted: findBL(names).length > 0,
        clients: findClients(names), blacklist: findBL(names)
      });
    }
    return out(404, { error: 'Not found' });
  }

  /* ---------- install ---------- */
  var original = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (url, opts) {
    var u = typeof url === 'string' ? url : (url && url.url) || '';
    if (u.indexOf('api.php') === -1) return original ? original(url, opts) : Promise.reject(new Error('offline'));
    opts = opts || {};
    var method = String(opts.method || 'GET').toUpperCase();
    var params = {};
    var qi = u.indexOf('?');
    if (qi !== -1) {
      u.slice(qi + 1).split('&').forEach(function (p) {
        var kv = p.split('=');
        if (kv[0]) params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
      });
    }
    var body = {};
    try { if (opts.body && typeof opts.body === 'string') body = JSON.parse(opts.body); } catch (e) {}
    return Promise.resolve(handle(params.action || '', params, method, body));
  };

  /* "Déconnexion" would leave the static demo — answer the logout call and stay put */
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      var b = document.getElementById('btn-logout');
      if (b) b.onclick = function (e) {
        e.preventDefault();
        try { fetch('api.php?action=logout', { method: 'POST' }); } catch (_) {}
        return false;
      };
    }, 0);
  });
})();
