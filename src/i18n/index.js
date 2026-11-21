import en from './en';
import hi from './hi';

const dictionaries = { en, hi };

let currentLocale = 'en';
const listeners = new Set();

export function getLocale() {
  return currentLocale;
}

export function setLocale(locale) {
  if (dictionaries[locale]) {
    currentLocale = locale;
    listeners.forEach((fn) => fn(currentLocale));
  }
}

export function subscribeLocale(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function t(key, vars) {
  const dictionary = dictionaries[currentLocale] || en;
  let text = dictionary[key] ?? en[key];

  if (text === undefined) {
    if (import.meta.env?.DEV) {
      console.warn(`[i18n] Missing translation key: ${key}`);
    }
    return key;
  }

  if (vars) {
    text = text.replace(/\{(\w+)\}/g, (match, name) =>
      Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
    );
  }

  return text;
}
