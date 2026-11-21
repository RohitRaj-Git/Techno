import en from './en';

// To add Hindi/Punjabi later: create hi.js / pa.js with the same keys,
// register them below, and wrap the app in a LocaleProvider that re-renders
// on setLocale. Components do not need to change.
const dictionaries = { en };

let currentLocale = 'en';

export function getLocale() {
  return currentLocale;
}

export function setLocale(locale) {
  if (dictionaries[locale]) {
    currentLocale = locale;
  }
}

export function t(key, vars) {
  const dictionary = dictionaries[currentLocale] || en;
  let text = dictionary[key] ?? en[key];

  if (text === undefined) {
    if (import.meta.env.DEV) {
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
