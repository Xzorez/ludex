'use strict';

const { app, BrowserWindow, ipcMain, shell, dialog, nativeImage } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

// Nombre consistente para la carpeta de datos en desarrollo y producción
app.setName('Ludex');

// ---------------------------------------------------------------------------
// Rutas de datos (se guardan en la carpeta de usuario, fuera de la app)
// ---------------------------------------------------------------------------
const userDir = () => app.getPath('userData');
const gamesFile = () => path.join(userDir(), 'games.json');

// ---------------------------------------------------------------------------
// Utilidades de almacenamiento
// ---------------------------------------------------------------------------
function readGames() {
  try {
    const raw = fs.readFileSync(gamesFile(), 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeGames(games) {
  fs.writeFileSync(gamesFile(), JSON.stringify(games, null, 2), 'utf8');
}

// ---------------------------------------------------------------------------
// Búsqueda en el catálogo de Steam (en vivo, sin clave de API)
// store.steampowered.com/api/storesearch devuelve JSON con nombre, id e imagen
// ---------------------------------------------------------------------------
function storeSearchUrl(term) {
  return (
    'https://store.steampowered.com/api/storesearch/?term=' +
    encodeURIComponent(term) +
    '&l=spanish&cc=es'
  );
}

async function steamSearch(query) {
  const q = String(query || '').trim();
  if (q.length < 2) return [];

  const res = await fetch(storeSearchUrl(q), {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Steam respondió ' + res.status);

  const json = await res.json();
  const items = (json.items || []).filter((it) => it.type === 'app');

  return items.map((it) => ({
    appid: it.id,
    name: it.name,
    cover: `https://cdn.cloudflare.steamstatic.com/steam/apps/${it.id}/library_600x900.jpg`,
    header: `https://cdn.cloudflare.steamstatic.com/steam/apps/${it.id}/header.jpg`,
    tiny: it.tiny_image || '',
    metascore: it.metascore || '',
  }));
}

// Comprobación rápida de conectividad con Steam
async function steamPing() {
  const res = await fetch(
    'https://api.steampowered.com/ISteamWebAPIUtil/GetServerInfo/v1/'
  );
  return res.ok;
}

// ---------------------------------------------------------------------------
// Página de inicio: juegos populares / novedades / más jugados (sin clave)
// ---------------------------------------------------------------------------
function normFeatured(arr) {
  return (arr || [])
    .filter((it) => it.id)
    .map((it) => ({
      appid: it.id,
      name: it.name,
      header:
        it.header_image ||
        it.large_capsule_image ||
        `https://cdn.cloudflare.steamstatic.com/steam/apps/${it.id}/header.jpg`,
    }));
}

async function steamFeatured() {
  const res = await fetch(
    'https://store.steampowered.com/api/featuredcategories?l=spanish&cc=es',
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) throw new Error('Steam respondió ' + res.status);
  const j = await res.json();
  return {
    top_sellers: normFeatured(j.top_sellers && j.top_sellers.items),
    new_releases: normFeatured(j.new_releases && j.new_releases.items),
    coming_soon: normFeatured(j.coming_soon && j.coming_soon.items),
  };
}

// Descubrir juegos de 1 jugador / modo historia (categoría 2 + etiqueta Story Rich)
function decodeEntities(s) {
  return String(s)
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function steamDiscover(filter, count = 24) {
  const url =
    'https://store.steampowered.com/search/results/?category2=2&tags=1742&filter=' +
    filter +
    '&cc=es&l=spanish&json=1&count=' +
    count +
    '&infinite=1';
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Steam respondió ' + res.status);
  const html = (await res.json()).results_html || '';
  const re =
    /data-ds-appid="(\d+)"[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?<span class="title">([^<]+)<\/span>/g;
  const seen = new Set();
  const items = [];
  let m;
  while ((m = re.exec(html))) {
    const appid = Number(m[1]);
    if (seen.has(appid)) continue;
    seen.add(appid);
    items.push({ appid, name: decodeEntities(m[3].trim()), image: m[2] });
  }
  return items;
}

async function steamHome() {
  const [popular, wishlist] = await Promise.all([
    steamDiscover('topsellers', 40).catch(() => []),
    steamDiscover('popularwishlist', 30).catch(() => []),
  ]);
  return { popular, wishlist };
}

async function steamMostPlayed(limit = 12) {
  const res = await fetch(
    'https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/?l=spanish'
  );
  if (!res.ok) throw new Error('Steam respondió ' + res.status);
  const ranks = ((await res.json()).response || {}).ranks || [];
  const out = [];
  for (const r of ranks.slice(0, limit)) {
    try {
      const d = await steamDetails(r.appid);
      if (d) out.push({ appid: r.appid, name: d.name, header: d.header, players: r.peak_in_game });
    } catch {
      /* saltar */
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Ficha enriquecida de Steam (descripción, géneros, fecha, capturas)
// ---------------------------------------------------------------------------
const detailsCache = new Map(); // appid -> data (durante la sesión)

async function steamDetails(appid) {
  if (detailsCache.has(appid)) return detailsCache.get(appid);
  const url =
    'https://store.steampowered.com/api/appdetails?appids=' +
    appid +
    '&l=spanish&cc=es';
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Steam respondió ' + res.status);

  const json = await res.json();
  const entry = json[String(appid)];
  if (!entry || !entry.success || !entry.data) return null;
  const d = entry.data;

  const out = {
    appid,
    name: d.name,
    description: d.short_description || '',
    genres: (d.genres || []).map((g) => g.description),
    releaseDate: (d.release_date && d.release_date.date) || '',
    developer: (d.developers || []).join(', '),
    publisher: (d.publishers || []).join(', '),
    metacritic: (d.metacritic && d.metacritic.score) || null,
    price: d.price_overview
      ? {
          final: d.price_overview.final_formatted || '',
          initial: d.price_overview.initial_formatted || '',
          discount: d.price_overview.discount_percent || 0,
        }
      : d.is_free
      ? { free: true }
      : null,
    header:
      d.header_image ||
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
    background: d.background_raw || d.background || '',
    screenshots: (d.screenshots || [])
      .slice(0, 8)
      .map((s) => ({ thumb: s.path_thumbnail, full: s.path_full })),
  };
  detailsCache.set(appid, out);
  return out;
}

// ---------------------------------------------------------------------------
// Precios de la lista de deseos (una sola petición por lote, sin clave)
// appdetails con filters=price_overview admite varios appids separados por coma
// ---------------------------------------------------------------------------
const priceCache = new Map(); // appid -> { data, ts }
const PRICE_TTL = 30 * 60 * 1000; // 30 min

async function steamPrices(appids) {
  const out = {};
  const need = [];
  for (const id of appids) {
    const c = priceCache.get(id);
    if (c && Date.now() - c.ts < PRICE_TTL) out[id] = c.data;
    else need.push(id);
  }
  for (let i = 0; i < need.length; i += 40) {
    const batch = need.slice(i, i + 40);
    const url =
      'https://store.steampowered.com/api/appdetails?appids=' +
      batch.join(',') +
      '&filters=price_overview&cc=es&l=spanish';
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) continue;
    const json = await res.json();
    for (const id of batch) {
      const entry = json && json[String(id)];
      const po = entry && entry.success && entry.data && entry.data.price_overview;
      const data = po
        ? {
            final: po.final_formatted || '',
            initial: po.initial_formatted || '',
            discount: po.discount_percent || 0,
          }
        : null;
      priceCache.set(id, { data, ts: Date.now() });
      out[id] = data;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// HowLongToBeat (sin API oficial). Flujo: GET /api/bleed/init para obtener un
// token de sesión y luego POST /api/bleed con la búsqueda. Degrada a null.
// ---------------------------------------------------------------------------
const HLTB_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const hltbCache = new Map(); // título -> resultado

function hltbPayload(title) {
  const terms = String(title).trim().split(/\s+/).filter(Boolean);
  return {
    searchType: 'games',
    searchTerms: terms,
    searchPage: 1,
    size: 20,
    searchOptions: {
      games: {
        userId: 0,
        platform: '',
        sortCategory: 'popular',
        rangeCategory: 'main',
        rangeTime: { min: null, max: null },
        gameplay: { perspective: '', flow: '', genre: '', difficulty: '' },
        rangeYear: { min: '', max: '' },
        modifier: '',
      },
      users: { sortCategory: 'postcount' },
      lists: { sortCategory: 'follows' },
      filter: '',
      sort: 0,
      randomizer: 0,
    },
    useCache: true,
  };
}

function hltbHours(sec) {
  if (!sec || sec <= 0) return null;
  return Math.round((sec / 3600) * 10) / 10;
}

function hltbPickBest(list, title) {
  if (!list || !list.length) return null;
  const t = title.toLowerCase();
  return (
    list.find((g) => (g.game_name || '').toLowerCase() === t) ||
    list.find((g) => (g.game_name || '').toLowerCase().includes(t)) ||
    list[0]
  );
}

// Obtiene el token de seguridad de búsqueda
async function hltbInit() {
  const res = await fetch(
    `https://howlongtobeat.com/api/bleed/init?t=${Date.now()}`,
    { headers: { 'User-Agent': HLTB_UA, Referer: 'https://howlongtobeat.com/' } }
  );
  if (!res.ok) throw new Error('HLTB init ' + res.status);
  return res.json(); // { token, hpKey, hpVal }
}

async function hltbRequest(title) {
  const sec = await hltbInit();
  const body = hltbPayload(title);
  if (sec.hpKey) body[sec.hpKey] = sec.hpVal; // el reto va también en el cuerpo
  const res = await fetch('https://howlongtobeat.com/api/bleed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': HLTB_UA,
      Origin: 'https://howlongtobeat.com',
      Referer: 'https://howlongtobeat.com/',
      'x-auth-token': sec.token,
      'x-hp-key': sec.hpKey,
      'x-hp-val': sec.hpVal,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('HLTB ' + res.status);
  return res.json();
}

async function hltbSearch(title) {
  if (hltbCache.has(title)) return hltbCache.get(title);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const json = await hltbRequest(title);
      const best = hltbPickBest(json.data || json.results || [], title);
      const out = best
        ? {
            id: best.game_id || best.id || null,
            main: hltbHours(best.comp_main),
            mainExtra: hltbHours(best.comp_plus),
            completionist: hltbHours(best.comp_100),
            matched: best.game_name || '',
          }
        : null;
      hltbCache.set(title, out);
      return out;
    } catch {
      if (attempt === 1) return null; // tras reintentar (p. ej. token caducado)
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// IPC: la interfaz pide datos y acciones al proceso principal
// ---------------------------------------------------------------------------
ipcMain.handle('games:list', () => readGames());

ipcMain.handle('games:save', (_e, game) => {
  const games = readGames();
  const idx = games.findIndex((g) => g.id === game.id);
  if (idx >= 0) games[idx] = game;
  else games.push(game);
  writeGames(games);
  return game;
});

ipcMain.handle('games:delete', (_e, id) => {
  const games = readGames().filter((g) => g.id !== id);
  writeGames(games);
  return true;
});

ipcMain.handle('steam:ping', async () => {
  try {
    return { ok: await steamPing() };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
});

ipcMain.handle('steam:search', async (_e, query) => {
  try {
    const results = await steamSearch(query);
    return { ok: true, results };
  } catch (err) {
    return { ok: false, error: String(err.message || err), results: [] };
  }
});

ipcMain.handle('steam:details', async (_e, appid) => {
  try {
    return { ok: true, data: await steamDetails(appid) };
  } catch (err) {
    return { ok: false, error: String(err.message || err), data: null };
  }
});

ipcMain.handle('steam:prices', async (_e, appids) => {
  try {
    const ids = (Array.isArray(appids) ? appids : []).map(Number).filter(Boolean);
    return { ok: true, data: await steamPrices(ids) };
  } catch (err) {
    return { ok: false, error: String(err.message || err), data: {} };
  }
});

// Carátula para juegos añadidos a mano: elegir imagen local y devolverla como
// data URL (reducida con nativeImage); así viaja en games.json y en el backup
ipcMain.handle('cover:pick', async (e) => {
  const w = BrowserWindow.fromWebContents(e.sender);
  const { canceled, filePaths } = await dialog.showOpenDialog(w, {
    title: 'Elegir carátula',
    properties: ['openFile'],
    filters: [{ name: 'Imagen', extensions: ['png', 'jpg', 'jpeg'] }],
  });
  if (canceled || !filePaths || !filePaths.length) return { ok: false, canceled: true };
  try {
    let img = nativeImage.createFromPath(filePaths[0]);
    if (img.isEmpty()) throw new Error('Imagen no válida');
    if (img.getSize().width > 600) img = img.resize({ width: 600 });
    return { ok: true, dataUrl: 'data:image/jpeg;base64,' + img.toJPEG(88).toString('base64') };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
});

ipcMain.handle('hltb:search', async (_e, title) => {
  try {
    return { ok: true, data: await hltbSearch(title) };
  } catch (err) {
    return { ok: false, error: String(err.message || err), data: null };
  }
});

ipcMain.handle('app:openExternal', (_e, url) => {
  if (/^https?:\/\//i.test(url)) shell.openExternal(url);
});

ipcMain.handle('steam:featured', async () => {
  try {
    return { ok: true, data: await steamFeatured() };
  } catch (err) {
    return { ok: false, error: String(err.message || err), data: null };
  }
});

ipcMain.handle('steam:mostPlayed', async () => {
  try {
    return { ok: true, data: await steamMostPlayed() };
  } catch (err) {
    return { ok: false, error: String(err.message || err), data: [] };
  }
});

ipcMain.handle('steam:home', async () => {
  try {
    return { ok: true, data: await steamHome() };
  } catch (err) {
    return { ok: false, error: String(err.message || err), data: null };
  }
});

// Exportar el "Resumen del año" como imagen PNG
ipcMain.handle('wrapped:export', async (e, rect) => {
  const w = BrowserWindow.fromWebContents(e.sender);
  if (!w) return { ok: false };
  try {
    const img = await w.webContents.capturePage({
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    });
    const { canceled, filePath } = await dialog.showSaveDialog(w, {
      title: 'Guardar resumen del año',
      defaultPath: `ludex-resumen-${rect.year || ''}.png`,
      filters: [{ name: 'Imagen PNG', extensions: ['png'] }],
    });
    if (canceled || !filePath) return { ok: false, canceled: true };
    fs.writeFileSync(filePath, img.toPNG());
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
});

// Controles de la ventana (barra de título personalizada)
ipcMain.handle('win:minimize', (e) => BrowserWindow.fromWebContents(e.sender)?.minimize());
ipcMain.handle('win:maximizeToggle', (e) => {
  const w = BrowserWindow.fromWebContents(e.sender);
  if (!w) return;
  if (w.isMaximized()) w.unmaximize();
  else w.maximize();
});
ipcMain.handle('win:close', (e) => BrowserWindow.fromWebContents(e.sender)?.close());
ipcMain.handle('win:isMaximized', (e) => !!BrowserWindow.fromWebContents(e.sender)?.isMaximized());

// ---------------------------------------------------------------------------
// Auto-actualización (GitHub Releases vía electron-updater)
// ---------------------------------------------------------------------------
let updateWin = null;
function sendUpdate(status, data) {
  try {
    if (updateWin && !updateWin.isDestroyed())
      updateWin.webContents.send('update:status', { status, ...(data || {}) });
  } catch {
    /* ventana cerrada */
  }
}
function setupUpdates(win) {
  updateWin = win;
  if (!app.isPackaged) return; // en desarrollo no hay updater
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => sendUpdate('checking'));
  autoUpdater.on('update-available', (info) => sendUpdate('available', { version: info.version }));
  autoUpdater.on('update-not-available', () => sendUpdate('none'));
  autoUpdater.on('download-progress', (p) =>
    sendUpdate('downloading', { percent: Math.round(p.percent || 0) })
  );
  autoUpdater.on('update-downloaded', (info) => sendUpdate('ready', { version: info.version }));
  autoUpdater.on('error', (err) => sendUpdate('error', { error: String((err && err.message) || err) }));
  autoUpdater.checkForUpdates().catch(() => {});
}

ipcMain.handle('update:check', async () => {
  if (!app.isPackaged) return { ok: false, dev: true };
  try {
    await autoUpdater.checkForUpdates();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
});
ipcMain.handle('update:install', () => {
  try {
    autoUpdater.quitAndInstall();
  } catch {
    /* nada */
  }
});
ipcMain.handle('app:version', () => app.getVersion());

// Copia de seguridad: exportar / importar la biblioteca (JSON)
ipcMain.handle('backup:export', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Exportar biblioteca de Ludex',
    defaultPath: `ludex-backup-${new Date().toISOString().slice(0, 10)}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (canceled || !filePath) return { ok: false, canceled: true };
  try {
    fs.writeFileSync(filePath, JSON.stringify(readGames(), null, 2), 'utf8');
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
});

ipcMain.handle('backup:import', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Importar biblioteca de Ludex',
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (canceled || !filePaths || !filePaths.length) return { ok: false, canceled: true };
  try {
    const data = JSON.parse(fs.readFileSync(filePaths[0], 'utf8'));
    if (!Array.isArray(data)) throw new Error('El archivo no es una biblioteca válida.');
    writeGames(data);
    return { ok: true, count: data.length, games: data };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
});

// ---------------------------------------------------------------------------
// Ventana
// ---------------------------------------------------------------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 720,
    minHeight: 560,
    backgroundColor: '#0c0d11',
    autoHideMenuBar: true,
    frame: false,
    title: 'Ludex',
    icon: path.join(__dirname, '..', 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  win.on('maximize', () => win.webContents.send('win:state', true));
  win.on('unmaximize', () => win.webContents.send('win:state', false));

  win.webContents.once('did-finish-load', () => setupUpdates(win));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
