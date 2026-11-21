import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import Icon from '../components/Icon';
import BackToTop from '../components/BackToTop';

import { loadStore } from '../utils/mockStore';

const patientNavItems = [
  { to: '/patient/dashboard', icon: 'home', labelKey: 'nav.patient.home' },
  { to: '/patient/upload', icon: 'camera', labelKey: 'nav.patient.scan' },
  { to: '/patient/schedule', icon: 'pill', labelKey: 'nav.patient.medicines' },
  { to: '/patient/history', icon: 'calendar', labelKey: 'nav.patient.history' },
  { to: '/patient/safety', icon: 'shield', labelKey: 'nav.patient.safety' },
  { to: '/patient/profile', icon: 'user', labelKey: 'nav.patient.profile' },
];

export default function PatientLayout() {
  const store = loadStore();
  const patient = store.patient;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderNav />

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Desktop Sidebar */}
        <Sidebar
          items={patientNavItems}
          header={
            <div className="stack" style={{ gap: 'var(--space-3)' }}>
              <div className="row" style={{ gap: 'var(--space-2)', alignItems: 'center' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #0d655f 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(15, 118, 110, 0.25)',
                  }}
                >
                  <Icon name="heart" size={18} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--color-primary)' }}>
                  CareLoop
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary-soft-border)',
                  }}
                >
                  PATIENT
                </span>
              </div>

              {/* Patient Profile Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-alt)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 5px rgba(15, 118, 110, 0.2)',
                  }}
                >
                  RP
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {patient.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Age {patient.age} • Regimen Active
                  </div>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="stack" style={{ gap: 'var(--space-2)', width: '100%' }}>
              <Link
                to="/guardian/dashboard"
                className="btn btn--secondary"
                style={{ width: '100%', fontSize: '0.85rem', justifyContent: 'flex-start', padding: '0.5rem 0.75rem' }}
              >
                <Icon name="users" size={16} />
                <span>Switch to Guardian</span>
              </Link>
              <Link
                to="/"
                className="btn btn--ghost"
                style={{ width: '100%', fontSize: '0.8125rem', justifyContent: 'flex-start', padding: '0.4rem 0.75rem', color: 'var(--color-text-muted)' }}
              >
                <Icon name="logout" size={15} />
                <span>Exit Demo</span>
              </Link>
            </div>
          }
        />

        {/* Main Content Area */}
        <main
          className="has-bottom-nav has-bottom-nav--mobile-only has-sidebar"
          style={{ flex: 1, width: '100%' }}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav items={patientNavItems} hideOnDesktop />
      <BackToTop />
    </div>
  );
}
