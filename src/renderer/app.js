'use strict';

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------
let games = [];
let currentView = 'home';
let viewMode = 'grid'; // 'grid' | 'list'
let homeData = { sp: null };
let manualCheck = false;
let appVer = '';
let lang = 'es';
const timeout = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Idiomas (i18n)
// ---------------------------------------------------------------------------
const LANGS = { es: 'Español', en: 'English' };
const I18N = {
  es: {
    'app.tagline': 'Tu biblioteca de juegos',
    'setup.welcome': 'Te damos la bienvenida a',
    'setup.subtitle': 'Elige tus preferencias para empezar. Podrás cambiarlas luego en Ajustes.',
    'setup.language': 'Idioma',
    'setup.theme': 'Tema',
    'setup.accent': 'Color de acento',
    'setup.start': 'Empezar',
    'nav.home': 'Inicio', 'nav.all': 'Todos', 'nav.log': 'Bitácora', 'nav.playing': 'Jugando',
    'nav.paused': 'En pausa', 'nav.completed': 'Completados', 'nav.dropped': 'Abandonados',
    'nav.backlog': 'Quiero jugar', 'nav.wishlist': 'Deseos', 'nav.liked': 'Me gusta',
    'nav.stats': 'Estadísticas', 'nav.collections': 'Colecciones',
    'title.wishlist': 'Lista de deseos', 'title.collection': 'Colección',
    'add.game': 'Añadir juego', 'filter.ph': 'Filtrar biblioteca…',
    'tool.random': 'Al azar', 'tool.random.title': '¿A qué juego juego?',
    'tool.grid': 'Cuadrícula', 'tool.list': 'Lista / bitácora', 'tool.settings': 'Ajustes',
    'sort.recent': 'Más recientes', 'sort.old': 'Más antiguos', 'sort.rating': 'Mejor nota', 'sort.title': 'Título (A-Z)',
    'count.games': '{n} juegos', 'count.game': '1 juego',
    'st.completed': 'Terminado', 'st.playing': 'Jugando', 'st.paused': 'En pausa',
    'st.dropped': 'Abandonado', 'st.backlog': 'Quiero jugar', 'st.wishlist': 'Lista de deseos',
    'home.popular': 'Populares de un jugador', 'home.wishlist': 'Más deseados en Steam',
    'home.heroTag': 'Recomendado · un jugador, historia', 'home.add': 'Añadir a mi biblioteca',
    'home.inLib': 'En tu biblioteca', 'home.error': 'No se pudieron cargar las recomendaciones. Revisa tu conexión.',
    'empty.list.t': 'No hay juegos en esta lista', 'empty.list.b': 'Pulsa <b>Añadir juego</b> para buscar en el catálogo de Steam.',
    'empty.log.t': 'Tu bitácora está vacía', 'empty.log.b': 'Marca un juego como <b>Completado</b> y aparecerá aquí ordenado por fecha.',
    'col.empty': 'Crea colecciones desde la ficha de un juego.',
    'search.title': 'Añadir juego desde Steam', 'search.ph': 'Escribe el nombre del juego… (ej. Hollow Knight)',
    'search.start': 'Empieza a escribir para buscar en el catálogo de Steam.',
    'search.min': 'Escribe al menos 2 letras…', 'search.searching': 'Buscando…',
    'search.offline': 'No se pudo conectar con Steam. Revisa tu conexión a Internet.',
    'search.none': 'Sin resultados. Prueba con otro nombre.',
    'search.add': 'Añadir', 'search.added': 'Añadido',
    'tab.rate': 'Tu valoración', 'tab.info': 'Detalles',
    'f.rating': 'Nota', 'f.finished': 'Terminado el', 'f.tags': 'Etiquetas', 'f.collections': 'Colecciones',
    'f.review': 'Diario / Reseña', 'f.review.ph': '¿Qué te pareció? Apunta aquí tu diario…',
    'f.tags.ph': 'Añade una etiqueta y pulsa Enter…', 'f.col.ph': 'Añade a una colección y pulsa Enter…',
    'f.spoiler': 'Contiene spoilers', 'spoiler.cover': 'Esta reseña contiene spoilers', 'spoiler.show': 'Mostrar',
    'like': 'Me gusta', 'liked': 'Te gusta', 'steam.view': 'Ver en Steam',
    'st.btn.completed': 'Completado', 'st.btn.playing': 'Jugando', 'st.btn.paused': 'En pausa',
    'st.btn.dropped': 'Abandonado', 'st.btn.backlog': 'Quiero jugar', 'st.btn.wishlist': 'Lista de deseos',
    'info.hltb': '¿Cuánto se tarda? (HowLongToBeat)', 'info.genres': 'Géneros', 'info.shots': 'Capturas',
    'hltb.main': 'Historia', 'hltb.extra': '+ Extras', 'hltb.full': 'Completista', 'hltb.none': 'No disponible en HowLongToBeat.',
    'shots.none': 'Sin capturas.', 'btn.delete': 'Eliminar', 'btn.cancel': 'Cancelar', 'btn.save': 'Guardar',
    'stats.wrap': 'Ver resumen del año', 'stats.none.t': 'Aún no hay datos', 'stats.none.b': 'Añade juegos para ver tus estadísticas.',
    'stats.total': 'Juegos en total', 'stats.completed': 'Completados', 'stats.playing': 'Jugando ahora',
    'stats.backlog': 'En tu backlog', 'stats.avg': 'Nota media', 'stats.rated': '{n} valorados',
    'stats.hoursDone': 'Horas completadas', 'stats.hltbNote': 'según HowLongToBeat',
    'stats.hoursBacklog': 'Backlog por jugar', 'stats.timeEst': 'tiempo estimado', 'stats.liked': 'Te gustan',
    'stats.byYear': 'Completados por año', 'stats.byGenre': 'Géneros más jugados',
    'stats.yearEmpty': 'Marca juegos como completados con su fecha.', 'stats.genreEmpty': 'Se rellenan al añadir juegos de Steam.',
    'wrap.kicker': 'Resumen Ludex', 'wrap.h1': 'Tu año en juegos · ', 'wrap.best': 'Tu juego del año',
    'wrap.terminados': 'Terminados', 'wrap.hours': 'Horas jugadas', 'wrap.avg': 'Nota media', 'wrap.topMonth': 'Mes más activo',
    'wrap.genres': 'Géneros favoritos', 'wrap.foot': '{n} marcados con me gusta · hecho con Ludex',
    'wrap.empty': 'No terminaste juegos en {y}.', 'wrap.save': 'Guardar imagen', 'wrap.prev': 'Año anterior', 'wrap.next': 'Año siguiente',
    'set.accent': 'Color de acento', 'set.size': 'Tamaño de las carátulas', 'set.size.s': 'Pequeñas',
    'set.size.m': 'Medianas', 'set.size.l': 'Grandes', 'set.theme': 'Tema',
    'theme.midnight': 'Medianoche', 'theme.oled': 'Negro', 'theme.slate': 'Pizarra', 'theme.warm': 'Cálido',
    'set.dynbg': 'Fondo dinámico según la carátula (en la ficha del juego)',
    'set.backup': 'Copia de seguridad', 'set.export': 'Exportar biblioteca', 'set.import': 'Importar…',
    'set.import.note': 'La importación reemplaza tu biblioteca actual por la del archivo.',
    'set.updates': 'Actualizaciones', 'set.checkUpd': 'Buscar actualizaciones', 'set.lang': 'Idioma',
    'confirm.del.t': 'Eliminar juego', 'confirm.del.b': '¿Seguro que quieres eliminar "{name}" de tu biblioteca? Esta acción no se puede deshacer.',
    'upd.searching': 'Buscando actualizaciones…', 'upd.downloading': 'Descargando actualización…',
    'upd.ready': 'Versión {v} lista para instalar', 'upd.restart': 'Reiniciar e instalar',
    'upd.latest': 'Ya tienes la última versión', 'upd.fail': 'No se pudo comprobar actualizaciones',
    'upd.dev': 'Solo funciona en la app instalada',
    'toast.saved': 'Guardado', 'toast.deleted': 'Eliminado', 'toast.added': '"{name}" añadido a Quiero jugar',
    'toast.exported': 'Biblioteca exportada', 'toast.imported': 'Importados {n} juegos',
    'toast.expErr': 'No se pudo exportar', 'toast.impErr': 'No se pudo importar', 'toast.noGames': 'Aún no hay juegos en tu biblioteca',
    'toast.imgSaved': 'Imagen guardada', 'toast.imgErr': 'No se pudo guardar la imagen', 'jugadores': 'jugadores',
    'noDate': 'Sin fecha', 'updating': 'Buscando actualizaciones…',
  },
  en: {
    'app.tagline': 'Your game library',
    'setup.welcome': 'Welcome to',
    'setup.subtitle': 'Choose your preferences to start. You can change them later in Settings.',
    'setup.language': 'Language',
    'setup.theme': 'Theme',
    'setup.accent': 'Accent color',
    'setup.start': 'Get started',
    'nav.home': 'Home', 'nav.all': 'All', 'nav.log': 'Log', 'nav.playing': 'Playing',
    'nav.paused': 'Paused', 'nav.completed': 'Completed', 'nav.dropped': 'Dropped',
    'nav.backlog': 'Want to play', 'nav.wishlist': 'Wishlist', 'nav.liked': 'Liked',
    'nav.stats': 'Statistics', 'nav.collections': 'Collections',
    'title.wishlist': 'Wishlist', 'title.collection': 'Collection',
    'add.game': 'Add game', 'filter.ph': 'Filter library…',
    'tool.random': 'Random', 'tool.random.title': 'What should I play?',
    'tool.grid': 'Grid', 'tool.list': 'List / log', 'tool.settings': 'Settings',
    'sort.recent': 'Most recent', 'sort.old': 'Oldest', 'sort.rating': 'Highest rated', 'sort.title': 'Title (A-Z)',
    'count.games': '{n} games', 'count.game': '1 game',
    'st.completed': 'Finished', 'st.playing': 'Playing', 'st.paused': 'Paused',
    'st.dropped': 'Dropped', 'st.backlog': 'Want to play', 'st.wishlist': 'Wishlist',
    'home.popular': 'Popular single-player', 'home.wishlist': 'Most wishlisted on Steam',
    'home.heroTag': 'Recommended · single-player, story', 'home.add': 'Add to my library',
    'home.inLib': 'In your library', 'home.error': "Couldn't load recommendations. Check your connection.",
    'empty.list.t': 'No games in this list', 'empty.list.b': 'Click <b>Add game</b> to search the Steam catalog.',
    'empty.log.t': 'Your log is empty', 'empty.log.b': 'Mark a game as <b>Completed</b> and it will appear here by date.',
    'col.empty': 'Create collections from a game’s detail.',
    'search.title': 'Add game from Steam', 'search.ph': 'Type a game name… (e.g. Hollow Knight)',
    'search.start': 'Start typing to search the Steam catalog.',
    'search.min': 'Type at least 2 letters…', 'search.searching': 'Searching…',
    'search.offline': "Couldn't reach Steam. Check your internet connection.",
    'search.none': 'No results. Try another name.',
    'search.add': 'Add', 'search.added': 'Added',
    'tab.rate': 'Your rating', 'tab.info': 'Details',
    'f.rating': 'Rating', 'f.finished': 'Finished on', 'f.tags': 'Tags', 'f.collections': 'Collections',
    'f.review': 'Journal / Review', 'f.review.ph': 'What did you think? Write your journal here…',
    'f.tags.ph': 'Add a tag and press Enter…', 'f.col.ph': 'Add to a collection and press Enter…',
    'f.spoiler': 'Contains spoilers', 'spoiler.cover': 'This review contains spoilers', 'spoiler.show': 'Show',
    'like': 'Like', 'liked': 'Liked', 'steam.view': 'View on Steam',
    'st.btn.completed': 'Completed', 'st.btn.playing': 'Playing', 'st.btn.paused': 'Paused',
    'st.btn.dropped': 'Dropped', 'st.btn.backlog': 'Want to play', 'st.btn.wishlist': 'Wishlist',
    'info.hltb': 'How long to beat? (HowLongToBeat)', 'info.genres': 'Genres', 'info.shots': 'Screenshots',
    'hltb.main': 'Story', 'hltb.extra': '+ Extras', 'hltb.full': 'Completionist', 'hltb.none': 'Not available on HowLongToBeat.',
    'shots.none': 'No screenshots.', 'btn.delete': 'Delete', 'btn.cancel': 'Cancel', 'btn.save': 'Save',
    'stats.wrap': 'See year in review', 'stats.none.t': 'No data yet', 'stats.none.b': 'Add games to see your statistics.',
    'stats.total': 'Games in total', 'stats.completed': 'Completed', 'stats.playing': 'Playing now',
    'stats.backlog': 'In your backlog', 'stats.avg': 'Average rating', 'stats.rated': '{n} rated',
    'stats.hoursDone': 'Hours completed', 'stats.hltbNote': 'per HowLongToBeat',
    'stats.hoursBacklog': 'Backlog to play', 'stats.timeEst': 'estimated time', 'stats.liked': 'You like',
    'stats.byYear': 'Completed by year', 'stats.byGenre': 'Most played genres',
    'stats.yearEmpty': 'Mark games as completed with their date.', 'stats.genreEmpty': 'They fill in as you add Steam games.',
    'wrap.kicker': 'Ludex Recap', 'wrap.h1': 'Your year in games · ', 'wrap.best': 'Your game of the year',
    'wrap.terminados': 'Finished', 'wrap.hours': 'Hours played', 'wrap.avg': 'Average rating', 'wrap.topMonth': 'Most active month',
    'wrap.genres': 'Favorite genres', 'wrap.foot': '{n} liked · made with Ludex',
    'wrap.empty': "You didn't finish any games in {y}.", 'wrap.save': 'Save image', 'wrap.prev': 'Previous year', 'wrap.next': 'Next year',
    'set.accent': 'Accent color', 'set.size': 'Cover size', 'set.size.s': 'Small',
    'set.size.m': 'Medium', 'set.size.l': 'Large', 'set.theme': 'Theme',
    'theme.midnight': 'Midnight', 'theme.oled': 'Black', 'theme.slate': 'Slate', 'theme.warm': 'Warm',
    'set.dynbg': 'Dynamic background from the cover (in the game detail)',
    'set.backup': 'Backup', 'set.export': 'Export library', 'set.import': 'Import…',
    'set.import.note': 'Importing replaces your current library with the file.',
    'set.updates': 'Updates', 'set.checkUpd': 'Check for updates', 'set.lang': 'Language',
    'confirm.del.t': 'Delete game', 'confirm.del.b': 'Are you sure you want to delete "{name}" from your library? This cannot be undone.',
    'upd.searching': 'Checking for updates…', 'upd.downloading': 'Downloading update…',
    'upd.ready': 'Version {v} ready to install', 'upd.restart': 'Restart and install',
    'upd.latest': 'You have the latest version', 'upd.fail': "Couldn't check for updates",
    'upd.dev': 'Only works in the installed app',
    'toast.saved': 'Saved', 'toast.deleted': 'Deleted', 'toast.added': '"{name}" added to Want to play',
    'toast.exported': 'Library exported', 'toast.imported': 'Imported {n} games',
    'toast.expErr': "Couldn't export", 'toast.impErr': "Couldn't import", 'toast.noGames': 'No games in your library yet',
    'toast.imgSaved': 'Image saved', 'toast.imgErr': "Couldn't save the image", 'jugadores': 'players',
    'noDate': 'No date', 'updating': 'Checking for updates…',
  },
};
function t(k, vars) {
  let s = (I18N[lang] && I18N[lang][k]) || I18N.es[k] || k;
  if (vars) for (const p in vars) s = s.split('{' + p + '}').join(vars[p]);
  return s;
}
function applyI18n(root) {
  (root || document).querySelectorAll('[data-i18n]').forEach((el) => {
    const txt = t(el.dataset.i18n);
    const ic = el.querySelector(':scope > .ms');
    if (ic) {
      el.textContent = '';
      el.appendChild(ic);
      el.appendChild(document.createTextNode(' ' + txt));
    } else {
      el.textContent = txt;
    }
  });
  (root || document).querySelectorAll('[data-i18n-ph]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  (root || document).querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
}
function applyLang(l) {
  lang = LANGS[l] ? l : 'es';
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
  applyI18n();
}
let activeFilter = null; // género o etiqueta activos
let editing = null;
let editingId = null; // id del juego abierto (para callbacks asíncronos)

const detailMemo = {}; // appid -> ficha de Steam (con capturas), solo en memoria

const STATUS_META = {
  completed: { icon: 'task_alt', label: 'Terminado', chip: 'Terminado' },
  playing: { icon: 'play_arrow', label: 'Jugando', chip: 'Jugando' },
  paused: { icon: 'pause', label: 'En pausa', chip: 'En pausa' },
  dropped: { icon: 'block', label: 'Abandonado', chip: 'Dropped' },
  backlog: { icon: 'bookmarks', label: 'Quiero jugar', chip: 'Backlog' },
  wishlist: { icon: 'card_giftcard', label: 'Lista de deseos', chip: 'Deseos' },
};

const VIEW_TITLE = {
  home: 'Inicio',
  all: 'Todos',
  log: 'Bitácora',
  stats: 'Estadísticas',
  playing: 'Jugando',
  paused: 'En pausa',
  completed: 'Completados',
  dropped: 'Abandonados',
  backlog: 'Quiero jugar',
  wishlist: 'Lista de deseos',
  liked: 'Me gusta',
};

// Vistas agrupadas bajo el desplegable de "Jugando"
const GROUP_VIEWS = ['playing', 'paused', 'completed', 'dropped', 'backlog'];
const GROUP_TABS = {
  playing: { icon: 'play_arrow', label: 'Jugando' },
  paused: { icon: 'pause', label: 'En pausa' },
  completed: { icon: 'task_alt', label: 'Completados' },
  dropped: { icon: 'block', label: 'Abandonados' },
  backlog: { icon: 'bookmarks', label: 'Quiero jugar' },
};

// Colores de acento disponibles (personalización)
const ACCENTS = [
  { id: 'magenta', c1: '#7b5cff', c2: '#ff4d8d' },
  { id: 'cyan', c1: '#22d3ee', c2: '#3b82f6' },
  { id: 'green', c1: '#34d399', c2: '#10b981' },
  { id: 'orange', c1: '#ffb152', c2: '#ff4d6d' },
  { id: 'purple', c1: '#c084fc', c2: '#7c3aed' },
  { id: 'gold', c1: '#f7c948', c2: '#f97316' },
  { id: 'blue', c1: '#38bdf8', c2: '#2563eb' },
  { id: 'rose', c1: '#fb7185', c2: '#e11d48' },
  { id: 'teal', c1: '#2dd4bf', c2: '#0ea5e9' },
  { id: 'lime', c1: '#a3e635', c2: '#16a34a' },
];

// Temas (tonos de fondo)
const THEMES = {
  midnight: { '--bg': '#0c0d11', '--bg-2': '#111319', '--panel': '#171a22', '--panel-2': '#1e222c', '--line': '#262b37', '--line-soft': '#1d212b', '--bg-glow': '#18141f' },
  oled: { '--bg': '#000000', '--bg-2': '#0a0a0c', '--panel': '#121214', '--panel-2': '#17171b', '--line': '#242428', '--line-soft': '#161618', '--bg-glow': '#100b16' },
  slate: { '--bg': '#0d1117', '--bg-2': '#121821', '--panel': '#18222f', '--panel-2': '#1f2b3a', '--line': '#2b3a4d', '--line-soft': '#1b2531', '--bg-glow': '#16202e' },
  warm: { '--bg': '#110f10', '--bg-2': '#181416', '--panel': '#211b1e', '--panel-2': '#2a2226', '--line': '#382c33', '--line-soft': '#231b20', '--bg-glow': '#1f1320' },
};

let settings = { accent: 'magenta', size: 'm', theme: 'midnight', dynBg: false };
let activeCollection = null;
let lbShots = [];
let lbIndex = 0;

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function uid() {
  return 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function icon(name, cls = '') {
  return `<span class="ms ${cls}">${name}</span>`;
}
function coverUrl(appid) {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`;
}
function headerUrl(appid) {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])
  );
}

const COVER_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="240"><rect width="160" height="240" fill="#1e222c"/></svg>'
  );

// Cadena de respaldo de carátula:
//  1) library_600x900.jpg (directa)  2) header.jpg (directa)
//  3) URL con hash de Steam (appdetails header_image) — funciona con juegos nuevos/sin lanzar
//  4) marcador
function attachCoverFallback(img, appid, storedHeader) {
  img.dataset.fb = '0';
  img.onerror = async () => {
    const step = img.dataset.fb;
    if (step === '0' && appid) {
      img.dataset.fb = '1';
      img.src = headerUrl(appid);
    } else if (step === '1' && appid) {
      img.dataset.fb = '2';
      const hashed = storedHeader || (await fetchDetailsHeader(appid));
      if (hashed) {
        img.src = hashed;
        return;
      }
      img.onerror = null;
      img.src = COVER_PLACEHOLDER;
    } else {
      img.onerror = null;
      img.src = COVER_PLACEHOLDER;
    }
  };
}

async function fetchDetailsHeader(appid) {
  const d = await fetchDetails(appid);
  return d && d.header ? d.header : null;
}

let toastTimer = null;
function toast(msg, ic = 'check_circle') {
  const el = $('#toast');
  el.innerHTML = icon(ic, 'fill') + '<span>' + escapeHtml(msg) + '</span>';
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2400);
}

// ---------------------------------------------------------------------------
// Estrellas (medias estrellas exactas mediante capa recortada)
// ---------------------------------------------------------------------------
function starsHtml(rating, cls = '') {
  const pct = (Math.max(0, Math.min(5, rating || 0)) / 5) * 100;
  const filled = '<span class="ms fill">star</span>'.repeat(5);
  const empty = '<span class="ms">star</span>'.repeat(5);
  return (
    `<span class="star-row ${cls}">` +
    `<span class="sr-base">${empty}</span>` +
    `<span class="sr-fill" style="width:${pct}%">${filled}</span>` +
    `</span>`
  );
}

function renderStarPicker(container, rating, onChange) {
  container.className = 'star-row big picker';
  container.innerHTML =
    `<span class="sr-base">${'<span class="ms">star</span>'.repeat(5)}</span>` +
    `<span class="sr-fill"></span>`;
  const base = container.querySelector('.sr-base');
  const fill = container.querySelector('.sr-fill');
  fill.innerHTML = '<span class="ms fill">star</span>'.repeat(5);

  const setVisual = (v) => {
    fill.style.width = (Math.max(0, Math.min(5, v)) / 5) * 100 + '%';
  };
  setVisual(rating);

  const valueFromEvent = (e) => {
    const r = base.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, e.clientX - r.left));
    const val = Math.ceil((x / r.width) * 10) / 2;
    return Math.max(0.5, Math.min(5, val));
  };

  container.onmousemove = (e) => setVisual(valueFromEvent(e));
  container.onmouseleave = () => setVisual(rating);
  container.onclick = (e) => {
    rating = valueFromEvent(e);
    setVisual(rating);
    onChange(rating);
  };
}

// ---------------------------------------------------------------------------
// Carga y guardado
// ---------------------------------------------------------------------------
async function loadGames() {
  games = await window.api.listGames();
  render();
}
async function persist(game) {
  await window.api.saveGame(game);
  const idx = games.findIndex((g) => g.id === game.id);
  if (idx >= 0) games[idx] = game;
  else games.push(game);
}

// ---------------------------------------------------------------------------
// Enriquecido: géneros + ficha de Steam y horas de HowLongToBeat
// ---------------------------------------------------------------------------
async function fetchDetails(appid) {
  if (appid in detailMemo) return detailMemo[appid];
  let data = null;
  try {
    const res = await window.api.steamDetails(appid);
    if (res && res.ok) data = res.data;
  } catch {
    /* sin conexión */
  }
  detailMemo[appid] = data;
  return data;
}

// Trae géneros/ficha/HLTB y lo guarda en el juego
async function enrichAndPersist(game) {
  if (game.appid) {
    const d = await fetchDetails(game.appid);
    if (d) {
      game.genres = d.genres || [];
      game.releaseDate = d.releaseDate || '';
      game.developer = d.developer || '';
      game.description = d.description || '';
      game.header = d.header || ''; // URL con hash (carátula fiable)
    }
  }
  if (game.hltb === undefined) {
    try {
      const res = await window.api.hltbSearch(game.title);
      game.hltb = res && res.ok ? res.data : null;
    } catch {
      game.hltb = null;
    }
  }
  await window.api.saveGame(game);
  const idx = games.findIndex((g) => g.id === game.id);
  if (idx >= 0) games[idx] = game;
}

// Relleno suave en segundo plano de los juegos que aún no tienen datos
async function backfillEnrichment() {
  const pending = games
    .filter((g) => g.appid && (!g.genres || g.hltb === undefined || !g.header))
    .slice(0, 60);
  for (const g of pending) {
    await enrichAndPersist(g);
    await new Promise((r) => setTimeout(r, 250));
  }
  if (pending.length) render();
}

// ---------------------------------------------------------------------------
// Filtro / orden
// ---------------------------------------------------------------------------
function viewGames(view) {
  if (view === 'all') return games;
  if (view === 'liked') return games.filter((g) => g.liked);
  if (view === 'log') return games.filter((g) => g.status === 'completed' || g.finished);
  if (view === 'collection')
    return games.filter((g) => (g.collections || []).includes(activeCollection));
  return games.filter((g) => g.status === view);
}

function allCollections() {
  const set = new Set();
  for (const g of games) for (const c of g.collections || []) set.add(c);
  return [...set].sort((a, b) => a.localeCompare(b));
}

function gameDate(g) {
  return g.finished || g.started || g.addedAt || '';
}

function matchesFilter(g) {
  if (!activeFilter) return true;
  return (g.genres || []).includes(activeFilter) || (g.tags || []).includes(activeFilter);
}

function filteredGames() {
  let list = viewGames(currentView).slice();

  const q = $('#filterInput').value.trim().toLowerCase();
  if (q) list = list.filter((g) => g.title.toLowerCase().includes(q));
  if (activeFilter) list = list.filter(matchesFilter);

  const sort = $('#sortSelect').value;
  list.sort((a, b) => {
    switch (sort) {
      case 'date_asc':
        return gameDate(a).localeCompare(gameDate(b));
      case 'rating_desc':
        return (b.rating || 0) - (a.rating || 0);
      case 'title_asc':
        return a.title.localeCompare(b.title);
      default:
        return gameDate(b).localeCompare(gameDate(a));
    }
  });
  return list;
}

function updateCounts() {
  $$('[data-count]').forEach((el) => {
    el.textContent = viewGames(el.dataset.count).length;
  });
}

// Cambiar de vista (gestiona pestañas simples, el grupo "Jugando" y colecciones)
function clearNavActive() {
  $$('.seg').forEach((b) => b.classList.remove('active'));
  $('#playGroup').classList.remove('active');
  $('#colGroup').classList.remove('active');
}

function setPlayLabel(view) {
  const inGroup = GROUP_VIEWS.includes(view);
  const meta = inGroup ? GROUP_TABS[view] : GROUP_TABS.playing;
  $('#pgIcon').textContent = meta.icon;
  $('#pgLabel').textContent = t('nav.' + (inGroup ? view : 'playing'));
  $('#pgCount').dataset.count = inGroup ? view : 'playing';
  $('#playGroup .seg-main').dataset.view = inGroup ? view : 'playing';
  return inGroup;
}

function selectView(view) {
  currentView = view;
  activeCollection = null;
  clearNavActive();
  const inGroup = setPlayLabel(view);
  const simple = document.querySelector('.seg[data-view="' + view + '"]');
  if (simple) simple.classList.add('active');
  $('#playGroup').classList.toggle('active', inGroup);
  $('#colLabel').textContent = 'Colecciones';
  closePgMenu();
  closeColMenu();
  render();
}

function selectCollection(name) {
  currentView = 'collection';
  activeCollection = name;
  clearNavActive();
  setPlayLabel('playing');
  $('#colGroup').classList.add('active');
  $('#colLabel').textContent = name;
  closePgMenu();
  closeColMenu();
  render();
}

function openPgMenu() {
  $('#pgMenu').classList.remove('hidden');
  $$('#pgMenu .seg-menu-item').forEach((it) =>
    it.classList.toggle('active', it.dataset.view === currentView)
  );
}
function closePgMenu() {
  $('#pgMenu').classList.add('hidden');
}
function togglePgMenu() {
  if ($('#pgMenu').classList.contains('hidden')) openPgMenu();
  else closePgMenu();
}

function renderColMenu() {
  const cols = allCollections();
  const menu = $('#colMenu');
  if (!cols.length) {
    menu.innerHTML = '<div class="menu-empty">' + t('col.empty') + '</div>';
    return;
  }
  menu.innerHTML = cols
    .map((c) => {
      const n = games.filter((g) => (g.collections || []).includes(c)).length;
      const active =
        currentView === 'collection' && activeCollection === c ? ' active' : '';
      return `<button class="seg-menu-item${active}" data-collection="${escapeHtml(
        c
      )}">${icon('folder')} ${escapeHtml(c)} <span class="mi-count">${n}</span></button>`;
    })
    .join('');
}
function openColMenu() {
  renderColMenu();
  $('#colMenu').classList.remove('hidden');
}
function closeColMenu() {
  $('#colMenu').classList.add('hidden');
}
function toggleColMenu() {
  if ($('#colMenu').classList.contains('hidden')) openColMenu();
  else closeColMenu();
}

// ---------------------------------------------------------------------------
// Render principal
// ---------------------------------------------------------------------------
function viewTitleText(view) {
  if (view === 'collection') return activeCollection || t('title.collection');
  if (view === 'wishlist') return t('title.wishlist');
  return t('nav.' + view) || 'Ludex';
}
function monthYear(d) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en' : 'es', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(d));
}

function render() {
  updateCounts();
  renderColMenu();
  const isHome = currentView === 'home';
  const isLog = currentView === 'log';
  const isStats = currentView === 'stats';
  $('#viewTitle').textContent = viewTitleText(currentView);

  const hideTools = isLog || isStats || isHome;
  $('#viewToggle').style.display = hideTools ? 'none' : '';
  $('#sortSelect').closest('.select-wrap').style.display = hideTools ? 'none' : '';
  document.querySelector('.subbar-tools').style.display =
    isHome || isStats ? 'none' : 'flex';

  renderFilterBar();

  const area = $('#listArea');

  if (isHome) {
    $('#viewCount').textContent = '';
    renderHome(area);
    return;
  }
  if (isStats) {
    $('#viewCount').textContent = '';
    renderStats(area);
    return;
  }

  let list;
  if (isLog) {
    list = viewGames('log').filter(matchesFilter);
    const q = $('#filterInput').value.trim().toLowerCase();
    if (q) list = list.filter((g) => g.title.toLowerCase().includes(q));
    list = list.slice().sort((a, b) => gameDate(b).localeCompare(gameDate(a)));
  } else {
    list = filteredGames();
  }

  $('#viewCount').textContent =
    list.length === 1 ? t('count.game') : t('count.games', { n: list.length });

  if (!list.length) {
    area.innerHTML =
      '<div class="empty-state">' +
      icon(isLog ? 'event_note' : 'videogame_asset') +
      `<div class="e-title">${isLog ? t('empty.log.t') : t('empty.list.t')}</div>` +
      `<p>${isLog ? t('empty.log.b') : t('empty.list.b')}</p></div>`;
    return;
  }

  area.innerHTML = '';
  if (isLog) renderTimeline(area, list);
  else if (viewMode === 'grid') renderGrid(area, list);
  else renderList(area, list);
}

// ----------------------- Barra de filtros -----------------------
function renderFilterBar() {
  const bar = $('#filterBar');
  if (currentView === 'stats' || currentView === 'home') {
    bar.classList.add('hidden');
    bar.innerHTML = '';
    return;
  }
  const base = currentView === 'log' ? viewGames('log') : viewGames(currentView);
  const counts = new Map();
  for (const g of base) {
    for (const x of [...(g.genres || []), ...(g.tags || [])]) {
      counts.set(x, (counts.get(x) || 0) + 1);
    }
  }
  if (!counts.size) {
    bar.classList.add('hidden');
    bar.innerHTML = '';
    return;
  }
  bar.classList.remove('hidden');
  const items = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 24);
  let html = `<span class="filter-lead">${icon('filter_list')}</span>`;
  if (activeFilter) {
    html += `<button class="filter-chip clear" data-filter="">${icon('close')} ${escapeHtml(
      activeFilter
    )}</button>`;
  }
  html += items
    .map(
      ([name, n]) =>
        `<button class="filter-chip${name === activeFilter ? ' active' : ''}" data-filter="${escapeHtml(
          name
        )}">${escapeHtml(name)} <span class="fc-count">${n}</span></button>`
    )
    .join('');
  bar.innerHTML = html;
}

// ----------------------- Cuadrícula -----------------------
function renderGrid(area, list) {
  const grid = document.createElement('div');
  grid.className = 'grid';
  for (const g of list) grid.appendChild(cardEl(g));
  area.appendChild(grid);
}

function cardEl(g) {
  const card = document.createElement('div');
  card.className = 'card';
  const st = STATUS_META[g.status];
  const hours = g.hltb && g.hltb.main;

  card.innerHTML =
    '<img alt="">' +
    (st
      ? `<span class="status-chip ${g.status}">${icon(st.icon, 'fill')}${t('st.' + g.status)}</span>`
      : '') +
    (g.liked ? '<span class="ms fill like-flag">favorite</span>' : '') +
    '<div class="card-overlay">' +
    (g.rating ? starsHtml(g.rating, 'small') : '') +
    `<div class="card-title">${escapeHtml(g.title)}</div>` +
    (hours ? `<div class="card-hltb">${icon('schedule')} ${hours} h</div>` : '') +
    '</div>';

  const img = card.querySelector('img');
  img.src = g.appid ? coverUrl(g.appid) : g.cover || '';
  if (g.appid) attachCoverFallback(img, g.appid, g.header);

  card.addEventListener('click', () => openEdit(g));
  return card;
}

// ----------------------- Lista / bitácora -----------------------
function renderTimeline(area, list) {
  let lastGroup = null;
  for (const g of list) {
    const d = gameDate(g);
    let group = t('noDate');
    if (d) {
      group = monthYear(d);
      group = group.charAt(0).toUpperCase() + group.slice(1);
    }
    if (group !== lastGroup) {
      const h = document.createElement('div');
      h.className = 'group-head';
      h.innerHTML = icon('calendar_month') + escapeHtml(group);
      area.appendChild(h);
      lastGroup = group;
    }
    area.appendChild(rowEl(g, d));
  }
}

function renderList(area, list) {
  const sortByDate =
    $('#sortSelect').value === 'date_desc' || $('#sortSelect').value === 'date_asc';
  if (sortByDate) {
    renderTimeline(area, list);
  } else {
    for (const g of list) area.appendChild(rowEl(g, gameDate(g)));
  }
}

function rowEl(g, d) {
  const row = document.createElement('div');
  row.className = 'row';
  const st = STATUS_META[g.status];

  const day = d ? new Date(d).getDate() : '';
  const dayCls = d ? 'row-day' : 'row-day empty';
  const dayTxt = d ? day : '—';

  row.innerHTML =
    `<div class="${dayCls}">${dayTxt}</div>` +
    `<img class="row-cover" alt="">` +
    `<div class="row-main"><div class="row-title">${escapeHtml(g.title)}</div>${starsHtml(g.rating, 'small')}</div>` +
    `<div class="row-status">${st ? icon(st.icon) + t('st.' + g.status) : ''}</div>` +
    `<div class="row-arrow">${icon('chevron_right')}</div>`;

  const img = row.querySelector('.row-cover');
  img.src = g.appid ? coverUrl(g.appid) : g.cover || '';
  if (g.appid) attachCoverFallback(img, g.appid, g.header);

  row.addEventListener('click', () => openEdit(g));
  return row;
}

// ----------------------- Página de inicio (1 jugador / historia) -----------------------
function recCard(it) {
  const inLib = games.some((g) => g.appid === it.appid);
  return (
    `<button class="rec-card${inLib ? ' in-lib' : ''}" data-appid="${it.appid}" data-name="${escapeHtml(
      it.name
    )}" title="${escapeHtml(it.name)}">` +
    '<div class="rec-cover">' +
    `<img alt="" loading="lazy" data-appid="${it.appid}" data-img="${escapeHtml(it.image || '')}">` +
    '<div class="rec-grad"></div>' +
    (inLib
      ? '<span class="rec-badge ms fill">check_circle</span>'
      : '<span class="rec-add ms">add_circle</span>') +
    '</div>' +
    `<div class="rec-name">${escapeHtml(it.name)}</div>` +
    '</button>'
  );
}

function homeGrid(title, ic, items) {
  if (!items || !items.length) return '';
  return (
    `<section class="home-sec"><h3>${icon(ic)} ${escapeHtml(title)}</h3>` +
    `<div class="rec-grid">${items.map(recCard).join('')}</div></section>`
  );
}

function applyRecImages(root) {
  root.querySelectorAll('.rec-cover img').forEach((img) => {
    const appid = Number(img.dataset.appid);
    img.src = coverUrl(appid);
    attachCoverFallback(img, appid, img.dataset.img || '');
  });
}

async function renderHome(area) {
  if (!homeData.sp) {
    try {
      const r = await window.api.steamHome();
      homeData.sp = r && r.ok && r.data ? r.data : { popular: [], fresh: [] };
    } catch {
      homeData.sp = { popular: [], fresh: [] };
    }
  }
  if (currentView !== 'home') return;

  const owned = (appid) => games.some((g) => g.appid === appid);
  const popular = (homeData.sp.popular || []).filter((it) => !owned(it.appid));
  const popIds = new Set(popular.map((it) => it.appid));
  const wishlist = (homeData.sp.wishlist || []).filter(
    (it) => !owned(it.appid) && !popIds.has(it.appid)
  );

  if (!popular.length && !wishlist.length) {
    area.innerHTML =
      '<div class="home"><div class="home-loading">' +
      icon('wifi_off') +
      ' ' + t('home.error') + '</div></div>';
    return;
  }

  area.innerHTML =
    '<div class="home">' +
    '<div id="homeHero" class="home-hero-slot"></div>' +
    homeGrid(t('home.popular'), 'local_fire_department', popular.slice(1)) +
    homeGrid(t('home.wishlist'), 'favorite', wishlist) +
    '</div>';
  applyRecImages(area);
  renderHero(popular[0]);
}

async function renderHero(it) {
  const slot = $('#homeHero');
  if (!slot || !it) return;
  const inLib = games.some((g) => g.appid === it.appid);
  slot.innerHTML =
    '<div class="home-hero" id="heroBox">' +
    '<div class="home-hero-shade"></div>' +
    '<div class="home-hero-content">' +
    '<div class="home-hero-tag">' +
    icon('auto_awesome') +
    ' ' + t('home.heroTag') + '</div>' +
    `<h2 class="home-hero-title">${escapeHtml(it.name)}</h2>` +
    '<div class="home-hero-genres" id="heroGenres"></div>' +
    `<button class="home-hero-btn rec-card" data-appid="${it.appid}" data-name="${escapeHtml(it.name)}">` +
    (inLib
      ? icon('check_circle') + ' ' + t('home.inLib')
      : icon('add') + ' ' + t('home.add')) +
    '</button>' +
    '</div></div>';
  const d = await fetchDetails(it.appid);
  if (currentView !== 'home') return;
  const box = $('#heroBox');
  if (!box) return;
  box.style.backgroundImage = `url("${(d && (d.background || d.header)) || headerUrl(it.appid)}")`;
  if (d && d.genres && d.genres.length && $('#heroGenres')) {
    $('#heroGenres').innerHTML = d.genres
      .slice(0, 4)
      .map((g) => `<span>${escapeHtml(g)}</span>`)
      .join('');
  }
}

async function addRecommended(appid, name) {
  const existing = games.find((g) => g.appid === appid);
  if (existing) {
    openEdit(existing);
    return;
  }
  const game = {
    id: uid(),
    appid,
    title: name,
    platform: 'PC con Windows',
    status: 'backlog',
    rating: 0,
    liked: false,
    started: '',
    finished: '',
    review: '',
    tags: [],
    collections: [],
    addedAt: new Date().toISOString().slice(0, 10),
  };
  await persist(game);
  toast(t('toast.added', { name }), 'playlist_add_check');
  if (currentView === 'home') renderHome($('#listArea'));
  enrichAndPersist(game).then(() => {
    if (currentView === 'home') renderHome($('#listArea'));
  });
}

// ----------------------- Estadísticas -----------------------
function renderStats(area) {
  if (!games.length) {
    area.innerHTML =
      '<div class="empty-state">' +
      icon('insights') +
      `<div class="e-title">${t('stats.none.t')}</div>` +
      `<p>${t('stats.none.b')}</p></div>`;
    return;
  }

  const byStatus = (s) => games.filter((g) => g.status === s).length;
  const rated = games.filter((g) => g.rating > 0);
  const avg = rated.length ? rated.reduce((a, g) => a + g.rating, 0) / rated.length : 0;
  const completed = games.filter((g) => g.status === 'completed');
  const hoursDone = completed.reduce((a, g) => a + ((g.hltb && g.hltb.main) || 0), 0);
  const backlog = games.filter((g) => g.status === 'backlog');
  const hoursBacklog = backlog.reduce((a, g) => a + ((g.hltb && g.hltb.main) || 0), 0);

  const years = {};
  for (const g of completed) {
    const d = g.finished || g.started;
    if (d) {
      const y = new Date(d).getFullYear();
      years[y] = (years[y] || 0) + 1;
    }
  }
  const genres = {};
  for (const g of games) for (const x of g.genres || []) genres[x] = (genres[x] || 0) + 1;

  const statCard = (ic, value, label, sub) =>
    `<div class="stat-card">${icon(ic)}<div class="sc-value">${value}</div>` +
    `<div class="sc-label">${escapeHtml(label)}</div>` +
    (sub ? `<div class="sc-sub">${escapeHtml(sub)}</div>` : '') +
    '</div>';

  const bar = (label, val, max, suffix = '') => {
    const pct = max ? Math.round((val / max) * 100) : 0;
    return (
      '<div class="bar-row">' +
      `<div class="bar-label">${escapeHtml(label)}</div>` +
      `<div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>` +
      `<div class="bar-val">${val}${suffix}</div>` +
      '</div>'
    );
  };

  const yearKeys = Object.keys(years).sort();
  const yearMax = Math.max(1, ...Object.values(years));
  const yearsBars = yearKeys.length
    ? yearKeys.map((y) => bar(y, years[y], yearMax)).join('')
    : `<p class="chip-empty">${t('stats.yearEmpty')}</p>`;

  const genreEntries = Object.entries(genres).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const genreMax = Math.max(1, ...genreEntries.map((e) => e[1]));
  const genreBars = genreEntries.length
    ? genreEntries.map(([g, n]) => bar(g, n, genreMax)).join('')
    : `<p class="chip-empty">${t('stats.genreEmpty')}</p>`;

  area.innerHTML =
    '<div class="stats">' +
    '<button id="openWrapBtn" class="wrap-open-btn">' +
    icon('auto_awesome') +
    ' ' + t('stats.wrap') + '</button>' +
    '<div class="stat-cards">' +
    statCard('sports_esports', games.length, t('stats.total')) +
    statCard('task_alt', completed.length, t('stats.completed')) +
    statCard('play_arrow', byStatus('playing'), t('stats.playing')) +
    statCard('bookmarks', backlog.length, t('stats.backlog')) +
    statCard('star', avg ? avg.toFixed(1) : '—', t('stats.avg'), t('stats.rated', { n: rated.length })) +
    statCard('schedule', Math.round(hoursDone) + ' h', t('stats.hoursDone'), t('stats.hltbNote')) +
    statCard('hourglass_top', Math.round(hoursBacklog) + ' h', t('stats.hoursBacklog'), t('stats.timeEst')) +
    statCard('favorite', games.filter((g) => g.liked).length, t('stats.liked')) +
    '</div>' +
    '<div class="stat-panels">' +
    `<div class="stat-panel"><h3>${icon('calendar_month')} ${t('stats.byYear')}</h3>${yearsBars}</div>` +
    `<div class="stat-panel"><h3>${icon('category')} ${t('stats.byGenre')}</h3>${genreBars}</div>` +
    '</div>' +
    '</div>';
}

// ----------------------- Resumen del año (Wrapped) -----------------------
let wrapYear = null;

function finishedYears() {
  const set = new Set();
  for (const g of games) if (g.finished) set.add(new Date(g.finished).getFullYear());
  return [...set].sort((a, b) => b - a);
}

function openWrapped() {
  const years = finishedYears();
  wrapYear = years[0] || new Date().getFullYear();
  renderWrapped();
  $('#wrappedModal').classList.remove('hidden');
}

function wrapNav(dir) {
  const years = finishedYears();
  if (!years.length) return;
  let idx = years.indexOf(wrapYear);
  if (idx === -1) idx = 0;
  idx = Math.min(years.length - 1, Math.max(0, idx + dir));
  wrapYear = years[idx];
  renderWrapped();
}

function renderWrapped() {
  const Y = wrapYear;
  $('#wrapYearLabel').textContent = Y;
  const card = $('#wrapCard');
  const finished = games.filter(
    (g) => g.finished && new Date(g.finished).getFullYear() === Y
  );

  if (!finished.length) {
    card.innerHTML =
      '<div class="wrap-bg"></div><div class="wrap-inner"><div class="wrap-empty">' +
      icon('event_busy') +
      `<div style="margin-top:8px">${t('wrap.empty', { y: Y })}</div></div></div>`;
    return;
  }

  const hours = finished.reduce((a, g) => a + ((g.hltb && g.hltb.main) || 0), 0);
  const rated = finished.filter((g) => g.rating > 0);
  const avg = rated.length ? rated.reduce((a, g) => a + g.rating, 0) / rated.length : 0;
  const best = finished.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  const liked = finished.filter((g) => g.liked).length;

  const months = {};
  for (const g of finished) {
    const m = new Date(g.finished).getMonth();
    months[m] = (months[m] || 0) + 1;
  }
  const topMonthIdx = Object.keys(months).sort((a, b) => months[b] - months[a])[0];
  let topMonth = '—';
  if (topMonthIdx != null) {
    topMonth = new Intl.DateTimeFormat(lang === 'en' ? 'en' : 'es', { month: 'long' }).format(
      new Date(2000, Number(topMonthIdx), 1)
    );
    topMonth = topMonth.charAt(0).toUpperCase() + topMonth.slice(1);
  }

  const genres = {};
  for (const g of finished) for (const x of g.genres || []) genres[x] = (genres[x] || 0) + 1;
  const genreEntries = Object.entries(genres).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const gMax = Math.max(1, ...genreEntries.map((e) => e[1]));

  const num = (ic, v, l) =>
    `<div class="wrap-num">${icon(ic)}<div class="wrap-num-v">${v}</div><div class="wrap-num-l">${escapeHtml(
      l
    )}</div></div>`;

  card.innerHTML =
    '<div class="wrap-bg"></div><div class="wrap-inner">' +
    '<div class="wrap-kicker">' + icon('auto_awesome') + ' ' + t('wrap.kicker') + '</div>' +
    `<div class="wrap-h1">${t('wrap.h1')}<b>${Y}</b></div>` +
    '<div class="wrap-top">' +
    `<img class="wrap-best-cover" alt="">` +
    '<div>' +
    `<div class="wrap-best-label">${t('wrap.best')}</div>` +
    `<div class="wrap-best-title">${escapeHtml(best.title)}</div>` +
    (best.rating ? starsHtml(best.rating, 'big') : '') +
    '</div></div>' +
    '<div class="wrap-nums">' +
    num('task_alt', finished.length, t('wrap.terminados')) +
    num('schedule', Math.round(hours) + ' h', t('wrap.hours')) +
    num('star', avg ? avg.toFixed(1) : '—', t('wrap.avg')) +
    num('calendar_month', topMonth, t('wrap.topMonth')) +
    '</div>' +
    (genreEntries.length
      ? `<div class="wrap-genres-t">${t('wrap.genres')}</div>` +
        genreEntries
          .map(
            ([g, n]) =>
              `<div class="wrap-genre"><div class="wrap-genre-n">${escapeHtml(g)}</div>` +
              `<div class="wrap-genre-bar"><div class="wrap-genre-fill" style="width:${Math.round(
                (n / gMax) * 100
              )}%"></div></div>` +
              `<div class="wrap-genre-c">${n}</div></div>`
          )
          .join('')
      : '') +
    '<div class="wrap-foot">' +
    '<div class="wrap-foot-brand">' + icon('stadia_controller', 'fill') + ' Ludex</div>' +
    `<div class="wrap-foot-note">${t('wrap.foot', { n: liked })}</div>` +
    '</div>' +
    '</div>';

  const cover = card.querySelector('.wrap-best-cover');
  if (best.appid) {
    cover.src = coverUrl(best.appid);
    attachCoverFallback(cover, best.appid, best.header);
  } else {
    cover.style.display = 'none';
  }
}

async function exportWrapped() {
  const card = $('#wrapCard');
  const r = card.getBoundingClientRect();
  const res = await window.api.wrappedExport({
    x: r.x,
    y: r.y,
    width: r.width,
    height: r.height,
    year: wrapYear,
  });
  if (res.ok) toast(t('toast.imgSaved'));
  else if (!res.canceled) toast(t('toast.imgErr'), 'error');
}

// ---------------------------------------------------------------------------
// Modal de edición
// ---------------------------------------------------------------------------
function switchTab(name) {
  $$('#editTabs .tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  $('#panelRate').classList.toggle('hidden', name !== 'rate');
  $('#panelInfo').classList.toggle('hidden', name !== 'info');
}

function openEdit(game) {
  editing = JSON.parse(JSON.stringify(game));
  editingId = editing.id;

  $('#editTitle').textContent = editing.title;
  $('#editHero').style.backgroundImage = editing.appid
    ? `url("${headerUrl(editing.appid)}")`
    : 'none';
  const dyn = $('#editDynBg');
  if (settings.dynBg && editing.appid) {
    dyn.style.backgroundImage = `url("${headerUrl(editing.appid)}")`;
    dyn.classList.add('on');
  } else {
    dyn.classList.remove('on');
    dyn.style.backgroundImage = 'none';
  }
  const cover = $('#editCover');
  cover.src = editing.appid ? coverUrl(editing.appid) : editing.cover || '';
  if (editing.appid) attachCoverFallback(cover, editing.appid, editing.header);

  $('#editFinished').value = editing.finished || '';
  $('#editReview').value = editing.review || '';
  $('#spoilerCheck').checked = !!editing.spoiler;
  $('#spoilerCover').classList.toggle('hidden', !editing.spoiler);

  renderStarPicker($('#starRow'), editing.rating || 0, (val) => {
    editing.rating = val;
  });

  updateStatusButtons();
  updateLikeButton();
  renderTags();
  renderCols();
  switchTab('rate');
  $('#steamLink').style.display = editing.appid ? '' : 'none';

  // Detalles con lo que ya tengamos
  renderHltb(editing.hltb);
  renderGenres(editing.genres);
  renderDetailMeta(
    editing.appid
      ? {
          releaseDate: editing.releaseDate,
          developer: editing.developer,
          description: editing.description,
          screenshots: [],
        }
      : null
  );

  $('#editModal').classList.remove('hidden');

  // Completar en segundo plano (capturas, géneros y HLTB que falten)
  if (editing.appid) {
    const myId = editingId;
    fetchDetails(editing.appid).then((d) => {
      if (!editing || editingId !== myId || !d) return;
      if (!editing.genres || !editing.genres.length) {
        editing.genres = d.genres || [];
        renderGenres(editing.genres);
      }
      editing.releaseDate = editing.releaseDate || d.releaseDate;
      editing.developer = editing.developer || d.developer;
      editing.description = editing.description || d.description;
      renderDetailMeta({
        releaseDate: editing.releaseDate,
        developer: editing.developer,
        description: editing.description,
        metacritic: d.metacritic,
        screenshots: d.screenshots,
      });
    });
    if (editing.hltb === undefined || editing.hltb === null) {
      window.api.hltbSearch(editing.title).then((res) => {
        if (!editing || editingId !== myId) return;
        if (res && res.ok && res.data) {
          editing.hltb = res.data;
          renderHltb(editing.hltb);
        }
      });
    }
  }
}

function renderHltb(h) {
  const box = $('#hltbBox');
  if (!h) {
    box.innerHTML = '<span class="hltb-empty">' + t('hltb.none') + '</span>';
    return;
  }
  const cell = (label, val) =>
    `<div class="hltb-cell"><div class="hltb-val">${
      val ? val + '<small> h</small>' : '—'
    }</div><div class="hltb-lab">${label}</div></div>`;
  box.innerHTML =
    cell(t('hltb.main'), h.main) + cell(t('hltb.extra'), h.mainExtra) + cell(t('hltb.full'), h.completionist);
}

function renderGenres(genres) {
  const box = $('#genreBox');
  box.innerHTML =
    genres && genres.length
      ? genres.map((g) => `<span class="chip">${escapeHtml(g)}</span>`).join('')
      : '<span class="chip-empty">—</span>';
}

function renderDetailMeta(d) {
  const meta = $('#metaBox');
  const desc = $('#descBox');
  const shots = $('#shotsBox');
  if (!d) {
    meta.innerHTML = '';
    desc.textContent = '';
    shots.innerHTML = '<span class="chip-empty">—</span>';
    return;
  }
  const bits = [];
  if (d.releaseDate) bits.push(icon('event') + ' ' + escapeHtml(d.releaseDate));
  if (d.developer) bits.push(icon('engineering') + ' ' + escapeHtml(d.developer));
  if (d.metacritic) bits.push(icon('star_rate') + ' Metacritic ' + d.metacritic);
  meta.innerHTML = bits.map((b) => `<span class="meta-item">${b}</span>`).join('');
  desc.textContent = d.description || '';
  shots.innerHTML =
    d.screenshots && d.screenshots.length
      ? d.screenshots
          .map((s) => `<img src="${s.thumb}" data-full="${s.full}" alt="">`)
          .join('')
      : '<span class="chip-empty">' + t('shots.none') + '</span>';
}

function renderTags() {
  const wrap = $('#tagChips');
  wrap.innerHTML = (editing.tags || [])
    .map(
      (t, i) =>
        `<span class="tag-chip">${escapeHtml(t)}<button class="tag-x" data-tagidx="${i}">${icon(
          'close'
        )}</button></span>`
    )
    .join('');
}

function addTag(val) {
  val = val.trim();
  if (!val) return;
  editing.tags = editing.tags || [];
  if (!editing.tags.some((t) => t.toLowerCase() === val.toLowerCase())) {
    editing.tags.push(val);
    renderTags();
  }
}

function renderCols() {
  $('#colChips').innerHTML = (editing.collections || [])
    .map(
      (c, i) =>
        `<span class="tag-chip">${escapeHtml(c)}<button class="col-x" data-colidx="${i}">${icon(
          'close'
        )}</button></span>`
    )
    .join('');
  $('#colDatalist').innerHTML = allCollections()
    .map((c) => `<option value="${escapeHtml(c)}"></option>`)
    .join('');
}
function addCol(val) {
  val = val.trim();
  if (!val) return;
  editing.collections = editing.collections || [];
  if (!editing.collections.some((c) => c.toLowerCase() === val.toLowerCase())) {
    editing.collections.push(val);
    renderCols();
  }
}

function updateStatusButtons() {
  $$('#statusButtons button').forEach((b) => {
    b.classList.toggle('active', b.dataset.status === editing.status);
  });
}

function updateLikeButton() {
  const b = $('#likeBtn');
  b.classList.toggle('liked', !!editing.liked);
  b.querySelector('.ms').classList.toggle('fill', !!editing.liked);
  b.querySelector('.like-text').textContent = editing.liked ? t('liked') : t('like');
}

function closeModals() {
  $('#editModal').classList.add('hidden');
  $('#searchModal').classList.add('hidden');
  $('#settingsModal').classList.add('hidden');
  $('#wrappedModal').classList.add('hidden');
  editing = null;
  editingId = null;
}

// ---------------------------------------------------------------------------
// Personalización (color de acento y tamaño de carátulas)
// ---------------------------------------------------------------------------
function applyAccent(id) {
  const a = ACCENTS.find((x) => x.id === id) || ACCENTS[0];
  const r = document.documentElement.style;
  r.setProperty('--accent', a.c2);
  r.setProperty('--accent-2', a.c1);
  r.setProperty('--accent-grad', `linear-gradient(135deg, ${a.c1} 0%, ${a.c2} 100%)`);
}
function applySize(s) {
  document.body.classList.remove('cov-s', 'cov-m', 'cov-l');
  document.body.classList.add('cov-' + s);
}
function applyTheme(id) {
  const t = THEMES[id] || THEMES.midnight;
  const r = document.documentElement.style;
  for (const k in t) r.setProperty(k, t[k]);
}
function loadSettings() {
  let l = localStorage.getItem('lang') || (navigator.language || 'es').slice(0, 2);
  if (!LANGS[l]) l = 'es';
  settings.accent = localStorage.getItem('accent') || 'magenta';
  settings.size = localStorage.getItem('coverSize') || 'm';
  settings.theme = localStorage.getItem('theme') || 'midnight';
  settings.dynBg = localStorage.getItem('dynBg') === '1';
  applyAccent(settings.accent);
  applySize(settings.size);
  applyTheme(settings.theme);
  applyLang(l);
}
function openSettings() {
  $('#accentRow').innerHTML = ACCENTS.map(
    (a) =>
      `<button class="accent-swatch${a.id === settings.accent ? ' active' : ''}" data-accent="${a.id}" style="background:linear-gradient(135deg, ${a.c1}, ${a.c2})"></button>`
  ).join('');
  $$('#sizeRow button').forEach((b) => b.classList.toggle('active', b.dataset.size === settings.size));
  $$('#themeRow button').forEach((b) => b.classList.toggle('active', b.dataset.theme === settings.theme));
  $('#langRow').innerHTML = Object.keys(LANGS)
    .map((k) => `<button data-lang="${k}" class="${k === lang ? 'active' : ''}">${LANGS[k]}</button>`)
    .join('');
  $('#dynBgCheck').checked = settings.dynBg;
  $('#versionHint').textContent = appVer ? (lang === 'en' ? 'Version ' : 'Versión ') + appVer : 'Ludex';
  $('#settingsModal').classList.remove('hidden');
}

// Pantalla de configuración inicial (primera vez)
function buildSetup() {
  $('#setupLang').innerHTML = Object.keys(LANGS)
    .map((k) => `<button data-lang="${k}" class="${k === lang ? 'active' : ''}">${LANGS[k]}</button>`)
    .join('');
  $('#setupTheme').innerHTML = ['midnight', 'oled', 'slate', 'warm']
    .map((th) => `<button data-theme="${th}" class="${th === settings.theme ? 'active' : ''}">${t('theme.' + th)}</button>`)
    .join('');
  $('#setupAccent').innerHTML = ACCENTS.map(
    (a) =>
      `<button class="accent-swatch${a.id === settings.accent ? ' active' : ''}" data-accent="${a.id}" style="background:linear-gradient(135deg, ${a.c1}, ${a.c2})"></button>`
  ).join('');
}
function openSetup() {
  buildSetup();
  applyI18n(document.getElementById('setup'));
  $('#setup').classList.remove('hidden');
}

// Diálogo de confirmación con la estética de la app (sustituye a confirm())
function confirmDialog({ title, text, okLabel = t('btn.delete'), danger = true }) {
  return new Promise((resolve) => {
    const modal = $('#confirmModal');
    const ok = $('#confirmOk');
    const cancel = $('#confirmCancel');
    $('#confirmTitle').textContent = title;
    $('#confirmText').textContent = text;
    ok.textContent = okLabel;
    ok.className = danger ? 'danger-btn solid' : 'primary-btn';
    modal.classList.remove('hidden');
    const done = (val) => {
      modal.classList.add('hidden');
      ok.onclick = null;
      cancel.onclick = null;
      modal.onclick = null;
      resolve(val);
    };
    ok.onclick = () => done(true);
    cancel.onclick = () => done(false);
    modal.onclick = (e) => {
      if (e.target === modal) done(false);
    };
  });
}

function openLightbox(list, index) {
  lbShots = list || [];
  lbIndex = index || 0;
  showLb();
  $('#lightbox').classList.remove('hidden');
}
function showLb() {
  if (!lbShots.length) return;
  $('#lightboxImg').src = lbShots[lbIndex];
  const multi = lbShots.length > 1;
  $('#lbPrev').classList.toggle('hidden', !multi);
  $('#lbNext').classList.toggle('hidden', !multi);
  $('#lbCounter').textContent = multi ? `${lbIndex + 1} / ${lbShots.length}` : '';
}
function lbStep(d) {
  if (!lbShots.length) return;
  lbIndex = (lbIndex + d + lbShots.length) % lbShots.length;
  showLb();
}
function closeLightbox() {
  $('#lightbox').classList.add('hidden');
  $('#lightboxImg').src = '';
  lbShots = [];
}

// ---------------------------------------------------------------------------
// Búsqueda en Steam
// ---------------------------------------------------------------------------
let searchTimer = null;
let searchSeq = 0;

function openSearch() {
  $('#searchModal').classList.remove('hidden');
  $('#steamSearchInput').value = '';
  $('#searchResults').innerHTML = '<p class="hint">' + t('search.start') + '</p>';
  setTimeout(() => $('#steamSearchInput').focus(), 50);
}

async function doSearch(q) {
  const box = $('#searchResults');
  if (q.trim().length < 2) {
    box.innerHTML = '<p class="hint">' + t('search.min') + '</p>';
    return;
  }
  const seq = ++searchSeq;
  box.innerHTML = '<p class="hint">' + t('search.searching') + '</p>';

  const res = await window.api.searchSteam(q);
  if (seq !== searchSeq) return;

  if (!res.ok) {
    box.innerHTML = '<p class="hint">' + t('search.offline') + '</p>';
    return;
  }
  const results = res.results;
  if (!results.length) {
    box.innerHTML = '<p class="hint">' + t('search.none') + '</p>';
    return;
  }
  box.innerHTML = '';
  for (const r of results) {
    const already = games.some((g) => g.appid === r.appid);
    const el = document.createElement('div');
    el.className = 'result' + (already ? ' added' : '');
    el.innerHTML =
      '<img alt="">' +
      `<div class="r-name">${escapeHtml(r.name)}</div>` +
      `<div class="r-add">${already ? icon('check') + t('search.added') : icon('add') + t('search.add')}</div>`;
    const img = el.querySelector('img');
    img.src = r.tiny || r.cover; // la miniatura con hash funciona también con juegos nuevos
    attachCoverFallback(img, r.appid, r.header);
    el.addEventListener('click', () => addFromSteam(r, el));
    box.appendChild(el);
  }
}

async function addFromSteam(r, el) {
  if (games.some((g) => g.appid === r.appid)) {
    const existing = games.find((g) => g.appid === r.appid);
    closeModals();
    openEdit(existing);
    return;
  }
  const game = {
    id: uid(),
    appid: r.appid,
    title: r.name,
    platform: 'PC con Windows',
    status: 'backlog',
    rating: 0,
    liked: false,
    started: '',
    finished: '',
    review: '',
    tags: [],
    collections: [],
    addedAt: new Date().toISOString().slice(0, 10),
  };
  await persist(game);
  el.classList.add('added');
  el.querySelector('.r-add').innerHTML = icon('check') + t('search.added');
  toast(t('toast.added', { name: r.name }), 'playlist_add_check');
  render();
  enrichAndPersist(game).then(() => render()); // géneros + HLTB en segundo plano
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------
function wireEvents() {
  // Pestañas simples
  $$('.seg').forEach((btn) => {
    btn.addEventListener('click', () => selectView(btn.dataset.view));
  });
  // Grupo "Jugando": el cuerpo selecciona su vista actual; el cursor abre el menú
  $('#playGroup .seg-main').addEventListener('click', (e) => {
    selectView(e.currentTarget.dataset.view);
  });
  $('#pgCaret').addEventListener('click', (e) => {
    e.stopPropagation();
    togglePgMenu();
  });
  $$('#pgMenu .seg-menu-item').forEach((it) => {
    it.addEventListener('click', () => selectView(it.dataset.view));
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#playGroup')) closePgMenu();
  });

  // Abrir el desplegable al pasar el ratón (con retardo al salir)
  let pgHoverTimer = null;
  const pg = $('#playGroup');
  pg.addEventListener('mouseenter', () => {
    clearTimeout(pgHoverTimer);
    openPgMenu();
  });
  pg.addEventListener('mouseleave', () => {
    pgHoverTimer = setTimeout(closePgMenu, 180);
  });

  // Colecciones (desplegable dinámico)
  $('#colMain').addEventListener('click', () => toggleColMenu());
  $('#colCaret').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleColMenu();
  });
  $('#colMenu').addEventListener('click', (e) => {
    const it = e.target.closest('.seg-menu-item');
    if (it && it.dataset.collection) selectCollection(it.dataset.collection);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#colGroup')) closeColMenu();
  });
  let colHoverTimer = null;
  const cg = $('#colGroup');
  cg.addEventListener('mouseenter', () => {
    clearTimeout(colHoverTimer);
    openColMenu();
  });
  cg.addEventListener('mouseleave', () => {
    colHoverTimer = setTimeout(closeColMenu, 180);
  });

  $$('#viewToggle button').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#viewToggle button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      viewMode = btn.dataset.mode;
      render();
    });
  });

  $('#addBtn').addEventListener('click', openSearch);
  $('#filterInput').addEventListener('input', render);
  $('#sortSelect').addEventListener('change', render);

  // Barra de filtros (género / etiqueta)
  $('#filterBar').addEventListener('click', (e) => {
    const b = e.target.closest('.filter-chip');
    if (!b) return;
    const f = b.dataset.filter;
    activeFilter = f && f !== activeFilter ? f : null;
    render();
  });

  // Cerrar modales
  $$('[data-close]').forEach((b) => b.addEventListener('click', closeModals));
  $$('.modal').forEach((m) =>
    m.addEventListener('click', (e) => {
      if (m.id === 'confirmModal') return; // lo gestiona confirmDialog
      if (e.target === m) closeModals();
    })
  );
  document.addEventListener('keydown', (e) => {
    const confirmOpen = !$('#confirmModal').classList.contains('hidden');
    const lbOpen = !$('#lightbox').classList.contains('hidden');
    if (e.key === 'Escape') {
      if (confirmOpen) $('#confirmCancel').click();
      else if (lbOpen) closeLightbox();
      else closeModals();
      return;
    }
    if (lbOpen && e.key === 'ArrowLeft') lbStep(-1);
    if (lbOpen && e.key === 'ArrowRight') lbStep(1);
  });

  // Pestañas del modal
  $('#editTabs').addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (t) switchTab(t.dataset.tab);
  });

  // Editor de etiquetas
  $('#tagInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(e.target.value);
      e.target.value = '';
    }
  });
  $('#tagChips').addEventListener('click', (e) => {
    const x = e.target.closest('.tag-x');
    if (!x || !editing) return;
    editing.tags.splice(Number(x.dataset.tagidx), 1);
    renderTags();
  });
  $('#colInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCol(e.target.value);
      e.target.value = '';
    }
  });
  $('#colChips').addEventListener('click', (e) => {
    const x = e.target.closest('.col-x');
    if (!x || !editing) return;
    editing.collections.splice(Number(x.dataset.colidx), 1);
    renderCols();
  });

  // Capturas: abrir en grande dentro de la app (pop-up centrado, con flechas)
  $('#shotsBox').addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img || !img.dataset.full) return;
    const imgs = [...$('#shotsBox').querySelectorAll('img')];
    const list = imgs.map((i) => i.dataset.full).filter(Boolean);
    openLightbox(list, Math.max(0, imgs.indexOf(img)));
  });
  $('#lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox' || e.target.closest('.lightbox-close')) closeLightbox();
  });
  $('#lbPrev').addEventListener('click', () => lbStep(-1));
  $('#lbNext').addEventListener('click', () => lbStep(1));

  // Spoilers
  $('#revealBtn').addEventListener('click', () => $('#spoilerCover').classList.add('hidden'));
  $('#spoilerCheck').addEventListener('change', (e) => {
    if (editing) editing.spoiler = e.target.checked;
  });

  // Ajustes
  $('#settingsBtn').addEventListener('click', openSettings);
  $('#accentRow').addEventListener('click', (e) => {
    const b = e.target.closest('.accent-swatch');
    if (!b) return;
    settings.accent = b.dataset.accent;
    localStorage.setItem('accent', settings.accent);
    applyAccent(settings.accent);
    $$('#accentRow .accent-swatch').forEach((s) =>
      s.classList.toggle('active', s.dataset.accent === settings.accent)
    );
  });
  $('#sizeRow').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    settings.size = b.dataset.size;
    localStorage.setItem('coverSize', settings.size);
    applySize(settings.size);
    $$('#sizeRow button').forEach((x) => x.classList.toggle('active', x === b));
  });
  $('#themeRow').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    settings.theme = b.dataset.theme;
    localStorage.setItem('theme', settings.theme);
    applyTheme(settings.theme);
    $$('#themeRow button').forEach((x) => x.classList.toggle('active', x === b));
  });
  $('#langRow').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-lang]');
    if (!b) return;
    applyLang(b.dataset.lang);
    $$('#langRow button').forEach((x) => x.classList.toggle('active', x === b));
    render();
  });

  // Pantalla de configuración inicial
  $('#setupLang').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-lang]');
    if (!b) return;
    applyLang(b.dataset.lang);
    buildSetup();
    applyI18n(document.getElementById('setup'));
  });
  $('#setupTheme').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-theme]');
    if (!b) return;
    settings.theme = b.dataset.theme;
    applyTheme(settings.theme);
    $$('#setupTheme button').forEach((x) => x.classList.toggle('active', x === b));
  });
  $('#setupAccent').addEventListener('click', (e) => {
    const b = e.target.closest('.accent-swatch');
    if (!b) return;
    settings.accent = b.dataset.accent;
    applyAccent(settings.accent);
    $$('#setupAccent .accent-swatch').forEach((x) => x.classList.toggle('active', x === b));
  });
  $('#setupStart').addEventListener('click', () => {
    localStorage.setItem('lang', lang);
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('accent', settings.accent);
    localStorage.setItem('coverSize', settings.size);
    localStorage.setItem('dynBg', settings.dynBg ? '1' : '0');
    localStorage.setItem('setupDone', '1');
    $('#setup').classList.add('hidden');
  });
  $('#dynBgCheck').addEventListener('change', (e) => {
    settings.dynBg = e.target.checked;
    localStorage.setItem('dynBg', settings.dynBg ? '1' : '0');
    const dyn = $('#editDynBg');
    if (editing && settings.dynBg && editing.appid) {
      dyn.style.backgroundImage = `url("${headerUrl(editing.appid)}")`;
      dyn.classList.add('on');
    } else {
      dyn.classList.remove('on');
    }
  });
  $('#exportBtn').addEventListener('click', async () => {
    const res = await window.api.backupExport();
    if (res.ok) toast(t('toast.exported'));
    else if (!res.canceled) toast(t('toast.expErr'), 'error');
  });
  $('#importBtn').addEventListener('click', async () => {
    const res = await window.api.backupImport();
    if (res.ok) {
      games = res.games;
      render();
      $('#settingsModal').classList.add('hidden');
      toast(t('toast.imported', { n: res.count }));
    } else if (!res.canceled) {
      toast(t('toast.impErr'), 'error');
    }
  });

  // Juego al azar (¿a qué juego?)
  $('#randomBtn').addEventListener('click', () => {
    let pool =
      currentView === 'stats'
        ? []
        : currentView === 'log'
        ? viewGames('log')
        : viewGames(currentView);
    if (!pool.length) pool = viewGames('backlog');
    if (!pool.length) pool = games;
    if (!pool.length) {
      toast(t('toast.noGames'), 'info');
      return;
    }
    openEdit(pool[Math.floor(Math.random() * pool.length)]);
  });

  // Controles de la ventana (barra de título personalizada)
  $('#winMin').addEventListener('click', () => window.api.winMinimize());
  $('#winMax').addEventListener('click', () => window.api.winMaximizeToggle());
  $('#winClose').addEventListener('click', () => window.api.winClose());
  window.api.onWinState((max) => {
    $('#winMax .ms').textContent = max ? 'filter_none' : 'crop_square';
  });
  window.api.winIsMaximized().then((max) => {
    $('#winMax .ms').textContent = max ? 'filter_none' : 'crop_square';
  });

  // Actualizaciones
  window.api.onUpdateStatus((s) => {
    const bar = $('#updateBar');
    const text = $('#updateText');
    const btn = $('#updateBtn');
    const ic = $('#updateIcon');
    if (s.status === 'available' || s.status === 'downloading') {
      bar.classList.remove('hidden');
      ic.textContent = 'download';
      text.textContent =
        s.status === 'downloading'
          ? t('upd.downloading') + ' ' + (s.percent || 0) + '%'
          : t('upd.downloading');
      btn.classList.add('hidden');
    } else if (s.status === 'ready') {
      bar.classList.remove('hidden');
      ic.textContent = 'check_circle';
      text.textContent = t('upd.ready', { v: s.version });
      btn.classList.remove('hidden');
    } else if (s.status === 'none') {
      if (manualCheck) {
        toast(t('upd.latest'));
        manualCheck = false;
      }
    } else if (s.status === 'error') {
      if (manualCheck) {
        toast(t('upd.fail'), 'error');
        manualCheck = false;
      }
    }
  });
  $('#updateBtn').addEventListener('click', () => window.api.updateInstall());
  $('#updateClose').addEventListener('click', () => $('#updateBar').classList.add('hidden'));
  $('#updateCheckBtn').addEventListener('click', async () => {
    manualCheck = true;
    toast(t('upd.searching'), 'sync');
    const r = await window.api.updateCheck();
    if (r && r.dev) {
      toast(t('upd.dev'), 'info');
      manualCheck = false;
    } else if (r && !r.ok && !r.dev) {
      toast(t('upd.fail'), 'error');
      manualCheck = false;
    }
  });

  // Tarjetas de juegos recomendados (página de Inicio) + botón del resumen
  $('#listArea').addEventListener('click', (e) => {
    const rc = e.target.closest('.rec-card');
    if (rc) {
      addRecommended(Number(rc.dataset.appid), rc.dataset.name);
      return;
    }
    if (e.target.closest('#openWrapBtn')) openWrapped();
  });

  // Resumen del año
  $('#wrapPrev').addEventListener('click', () => wrapNav(1));
  $('#wrapNext').addEventListener('click', () => wrapNav(-1));
  $('#wrapExport').addEventListener('click', exportWrapped);

  // Búsqueda con retardo
  $('#steamSearchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const q = e.target.value;
    searchTimer = setTimeout(() => doSearch(q), 220);
  });

  // Botones de estado
  $$('#statusButtons button').forEach((b) => {
    b.addEventListener('click', () => {
      if (!editing) return;
      editing.status = b.dataset.status;
      if (editing.status === 'completed' && !$('#editFinished').value) {
        const today = new Date().toISOString().slice(0, 10);
        $('#editFinished').value = today;
        editing.finished = today;
      }
      updateStatusButtons();
    });
  });

  $('#likeBtn').addEventListener('click', () => {
    if (!editing) return;
    editing.liked = !editing.liked;
    updateLikeButton();
  });

  $('#steamLink').addEventListener('click', () => {
    if (editing && editing.appid)
      window.api.openExternal(`https://store.steampowered.com/app/${editing.appid}/`);
  });

  $('#saveBtn').addEventListener('click', async () => {
    if (!editing) return;
    editing.finished = $('#editFinished').value;
    editing.review = $('#editReview').value;
    editing.spoiler = $('#spoilerCheck').checked;
    await persist(editing);
    toast(t('toast.saved'));
    closeModals();
    render();
  });

  $('#deleteBtn').addEventListener('click', async () => {
    if (!editing) return;
    const ok = await confirmDialog({
      title: t('confirm.del.t'),
      text: t('confirm.del.b', { name: editing.title }),
    });
    if (!ok || !editing) return;
    await window.api.deleteGame(editing.id);
    games = games.filter((g) => g.id !== editing.id);
    toast(t('toast.deleted'), 'delete');
    closeModals();
    render();
  });
}

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------
function applyHashView() {
  const m = location.hash.match(/^#v=(\w+)/);
  if (m && VIEW_TITLE[m[1]]) selectView(m[1]);
}

// Espera a que carguen las imágenes visibles (con tope de tiempo desde fuera)
function preloadVisibleCovers() {
  const imgs = [...$('#listArea').querySelectorAll('img')];
  return Promise.all(
    imgs.map((im) =>
      im.complete
        ? Promise.resolve()
        : new Promise((res) => {
            im.addEventListener('load', res, { once: true });
            im.addEventListener('error', res, { once: true });
          })
    )
  );
}
function hideSplash() {
  const s = $('#splash');
  if (!s) return;
  s.classList.add('hide');
  setTimeout(() => s.remove(), 500);
}

window.addEventListener('DOMContentLoaded', async () => {
  loadSettings();
  wireEvents();
  window.api.appVersion().then((v) => { appVer = v; }).catch(() => {});
  games = await window.api.listGames();
  applyHashView();

  // Precargar datos de Inicio para que la primera pantalla aparezca lista
  if (currentView === 'home') {
    try {
      const r = await Promise.race([window.api.steamHome(), timeout(3000)]);
      if (r && r.ok && r.data) homeData.sp = r.data;
    } catch {
      /* sin conexión */
    }
  }

  render();
  await Promise.race([preloadVisibleCovers(), timeout(1800)]);
  await timeout(500); // tiempo mínimo de cortesía
  hideSplash();

  if (!localStorage.getItem('setupDone')) openSetup();

  backfillEnrichment();
});
