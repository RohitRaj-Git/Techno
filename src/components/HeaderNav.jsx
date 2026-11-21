import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { getLocale, setLocale, subscribeLocale } from '../i18n';
import { loadStore, subscribeStore, switchRole, updateLanguage, resetStore } from '../utils/mockStore';
import { getSession, logout, subscribeAuth } from '../utils/auth';
import { useToast } from '../context/ToastContext';

export default function HeaderNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [, setStore] = useState(loadStore());
  const [locale, setLocalLocale] = useState(getLocale());
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    const unsubStore = subscribeStore(setStore);
    const unsubLocale = subscribeLocale(setLocalLocale);
    const unsubAuth = subscribeAuth(setSession);
    return () => {
      unsubStore();
      unsubLocale();
      unsubAuth();
    };
  }, []);

  const isPatientRoute = location.pathname.startsWith('/patient');
  const isGuardianRoute = location.pathname.startsWith('/guardian');
  const currentRole = isGuardianRoute ? 'guardian' : 'patient';

  const handleLanguageToggle = () => {
    const nextLocale = locale === 'en' ? 'hi' : 'en';
    setLocale(nextLocale);
    updateLanguage(nextLocale);
    toast.info(nextLocale === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है' : 'Language switched to English');
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const handleReset = () => {
    if (window.confirm('Reset CareLoop demonstration data to default state?')) {
      resetStore();
      toast.info('Demonstration data reset to initial state');
      window.location.reload();
    }
  };

  return (
    <header className="header-nav">
      <div className="row" style={{ gap: 'var(--space-4)', alignItems: 'center' }}>
        <Link to="/" className="header-brand" style={{ textDecoration: 'none' }}>
          <div className="header-brand-icon">
            <Icon name="heart" size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.025em', color: 'var(--color-navy)', lineHeight: 1.1 }}>
              CareLoop <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>Health</span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-subtle)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Clinical Regimen System
            </div>
          </div>
        </Link>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-primary-soft)',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-primary-soft-border)',
            letterSpacing: '0.02em',
          }}
          className="header-badge-hide-mobile"
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span>Aarogya Clinic Network · Dr. Verma</span>
        </span>
      </div>

      <div className="header-actions">
        {/* Role Segmented Portal Toggle */}
        {(isPatientRoute || isGuardianRoute) && (
          <div
            style={{
              display: 'inline-flex',
              padding: '3px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-surface-alt)',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (currentRole !== 'patient') {
                  switchRole('patient');
                  navigate('/patient/dashboard');
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: currentRole === 'patient' ? '#ffffff' : 'transparent',
                color: currentRole === 'patient' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: currentRole === 'patient' ? 800 : 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: currentRole === 'patient' ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Icon name="user" size={14} />
              <span>Patient</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentRole !== 'guardian') {
                  switchRole('guardian');
                  navigate('/guardian/dashboard');
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: currentRole === 'guardian' ? '#ffffff' : 'transparent',
                color: currentRole === 'guardian' ? '#6d28d9' : 'var(--color-text-muted)',
                fontWeight: currentRole === 'guardian' ? 800 : 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: currentRole === 'guardian' ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Icon name="users" size={14} />
              <span>Guardian</span>
            </button>
          </div>
        )}

        {/* Language selector segmented control */}
        <button
          type="button"
          className="lang-toggle-btn"
          onClick={handleLanguageToggle}
          title="Switch language (English / हिंदी)"
        >
          <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
            {locale === 'en' ? 'हि' : 'EN'}
          </span>
          <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>
            {locale === 'en' ? 'हिंदी' : 'English'}
          </span>
        </button>

        {/* Session Auth Status */}
        {session ? (
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn--ghost"
            style={{
              minHeight: 'auto',
              padding: '0.35rem 0.65rem',
              fontSize: '0.8125rem',
              color: 'var(--color-danger-text)',
              background: 'var(--color-danger-bg)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(225, 29, 72, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Sign out from session"
          >
            <Icon name="logout" size={14} />
            <span className="header-badge-hide-mobile">Sign Out</span>
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              background: 'var(--color-primary-soft)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-primary-soft-border)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Icon name="user" size={14} />
            <span>Sign In</span>
          </Link>
        )}

        {/* Demo reset button */}
        <button
          type="button"
          onClick={handleReset}
          className="btn btn--ghost"
          style={{
            minHeight: 'auto',
            padding: 'var(--space-1) var(--space-2)',
            fontSize: '0.8rem',
            color: 'var(--color-text-subtle)',
          }}
          title="Reset demonstration data"
        >
          <Icon name="refresh" size={15} />
          <span className="visually-hidden">Reset</span>
        </button>
      </div>
    </header>
  );
}
