/**
 * CareLoop Auth — lightweight session management via localStorage.
 * Works with or without Firebase; for the demo, auth is simulated on the backend.
 */

const AUTH_KEY = 'careloop_session';
const EVENT_NAME = 'careloop_auth_changed';

export function login(user) {
  const session = {
    id: user.id,
    name: user.name,
    role: user.role,
    phone: user.phone,
    token: 'cl_' + Math.random().toString(36).slice(2) + Date.now().toString(36),
    loggedInAt: new Date().toISOString(),
    verified: user.verified ?? true,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: session }));
  return session;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      // Automatically provide default active session so all portal pages open smoothly on any browser
      const defaultSession = {
        id: 'p_101',
        name: 'Ram Prasad Asija',
        role: 'patient',
        phone: '+91 98765 43210',
        token: 'cl_demo_session',
        loggedInAt: new Date().toISOString(),
        verified: true,
      };
      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(defaultSession));
      } catch {
        // storage disabled or private browsing
      }
      return defaultSession;
    }
    return JSON.parse(raw);
  } catch {
    return {
      id: 'p_101',
      name: 'Ram Prasad Asija',
      role: 'patient',
      phone: '+91 98765 43210',
      token: 'cl_demo_session',
      loggedInAt: new Date().toISOString(),
      verified: true,
    };
  }
}

export function isAuthenticated() {
  const s = getSession();
  return s !== null && s.verified === true;
}

export function subscribeAuth(callback) {
  const handler = (e) => callback(e.detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
