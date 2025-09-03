// ================= i18n.js =================
// Lightweight i18n loader + DOM applier
// Usage:
//   import { initI18n, setLang, getLang, t } from '/assets/js/i18n.js'
//   initI18n(); // auto-detects + wires buttons with [data-set-lang]

const I18N_BASE_PATH = 'assets/i18n';
const I18N_STORAGE_KEY = 'patras_lang';


let CURRENT_LANG = 'en';
let DICT = {};

const dictGet = (obj, path) => path.split('.').reduce((acc, k) => (acc || {})[k], obj);

async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
}

async function loadDictionary(lang) {
  const url = `${I18N_BASE_PATH}/${lang}.json`;
  DICT = await fetchJSON(url);
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = dictGet(DICT, key);
    if (typeof val === 'string') el.innerHTML = val;
  });
  // Update language toggle aria state
  document.querySelectorAll('.lang button').forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.dataset.setLang === CURRENT_LANG));
  });
}

function persistLang(lang) {
  try { localStorage.setItem(I18N_STORAGE_KEY, lang); } catch {}
}

function browserDefaultLang() {
  return (navigator.language && navigator.language.toLowerCase().startsWith('el')) ? 'gr' : 'en';
}

function setDocumentLang(lang) {
  document.documentElement.lang = (lang === 'gr') ? 'el' : 'en';
}

export function getLang() { return CURRENT_LANG; }
export function t(path, fallback = '') { return dictGet(DICT, path) ?? fallback; }

export async function setLang(lang) {
  if (!lang || lang === CURRENT_LANG) return CURRENT_LANG;
  CURRENT_LANG = lang;
  setDocumentLang(lang);
  await loadDictionary(lang);
  applyTranslations();
  persistLang(lang);
  // Announce change so other modules (e.g., weather) can re-render labels
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  return CURRENT_LANG;
}

export async function initI18n() {
  // Determine initial language (persisted > browser default)
  const saved = (() => { try { return localStorage.getItem(I18N_STORAGE_KEY); } catch { return null; } })();
  CURRENT_LANG = saved || browserDefaultLang();
  setDocumentLang(CURRENT_LANG);
  await loadDictionary(CURRENT_LANG);
  applyTranslations();

  // Wire language switch
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.lang button');
    if (!btn) return;
    const targetLang = btn.dataset.setLang;
    await setLang(targetLang);
  });

  return CURRENT_LANG;
}
