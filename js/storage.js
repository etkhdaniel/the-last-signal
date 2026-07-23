import { normalizeState } from './state.js?v=3';

const KEY = 'the-last-signal-save-v2';

export function loadGame() {
  try { return normalizeState(JSON.parse(localStorage.getItem(KEY))); }
  catch { return normalizeState(null); }
}

export function saveGame(state) {
  const snapshot = { ...state, combat: null };
  localStorage.setItem(KEY, JSON.stringify(snapshot));
}

export function eraseGame() { localStorage.removeItem(KEY); }

export function exportGame(state) {
  return btoa(unescape(encodeURIComponent(JSON.stringify({ ...state, combat: null }))));
}

export function importGame(encoded) {
  const decoded = decodeURIComponent(escape(atob(encoded.trim())));
  return normalizeState(JSON.parse(decoded));
}
