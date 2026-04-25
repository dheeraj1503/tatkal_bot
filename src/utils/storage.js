/**
 * RailAssist – chrome.storage.local utility
 * Falls back to localStorage in non-extension contexts.
 */

const KEYS = {
  TICKETS: 'ra_tickets',
  DARK_MODE: 'ra_dark_mode',
  COLLAPSED: 'ra_collapsed',
};

async function get(key) {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      chrome.storage.local.get(key, (result) => resolve(result[key] ?? null));
    } else {
      try { resolve(JSON.parse(localStorage.getItem(key))); }
      catch { resolve(null); }
    }
  });
}

async function set(key, value) {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      chrome.storage.local.set({ [key]: value }, resolve);
    } else {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
      resolve();
    }
  });
}

export const getTickets    = ()      => get(KEYS.TICKETS);
export const saveTickets   = (v)     => set(KEYS.TICKETS, v);
export const getDarkMode   = ()      => get(KEYS.DARK_MODE);
export const saveDarkMode  = (v)     => set(KEYS.DARK_MODE, v);
export const getCollapsed  = ()      => get(KEYS.COLLAPSED);
export const saveCollapsed = (v)     => set(KEYS.COLLAPSED, v);
