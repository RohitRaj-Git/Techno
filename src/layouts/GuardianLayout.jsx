import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import HeaderNav from '../components/HeaderNav';
import Icon from '../components/Icon';
import BackToTop from '../components/BackToTop';

import { loadStore } from '../utils/mockStore';

const guardianNavItems = [
  { to: '/guardian/dashboard', icon: 'home', labelKey: 'nav.caregiver.dashboard' },
  { to: '/guardian/monitoring', icon: 'activity', labelKey: 'nav.caregiver.monitoring' },
  { to: '/guardian/telegram', icon: 'telegram', labelKey: 'nav.caregiver.alerts' },
  { to: '/guardian/patient', icon: 'users', labelKey: 'nav.caregiver.patient' },
  { to: '/guardian/profile', icon: 'settings', labelKey: 'nav.caregiver.profile' },
];

export default function GuardianLayout() {
  const store = loadStore();
  const guardian = store.guardian;
  const patient = store.patient;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderNav />

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Desktop Sidebar */}
        <Sidebar
          items={guardianNavItems}
          header={
            <div className="stack" style={{ gap: 'var(--space-3)' }}>
              <div className="row" style={{ gap: 'var(--space-2)', alignItems: 'center' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(109, 40, 217, 0.25)',
                  }}
                >
                  <Icon name="heart" size={18} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--color-navy)' }}>
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
                    background: '#f5f3ff',
                    color: '#6d28d9',
                    border: '1px solid #ddd6fe',
                  }}
                >
                  GUARDIAN
                </span>
              </div>

              {/* Guardian & Patient Link Card */}
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
                    background: '#6d28d9',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 5px rgba(109, 40, 217, 0.2)',
                  }}
                >
                  AA
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {guardian.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Monitoring: <strong>{patient.nickname}</strong>
                  </div>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="stack" style={{ gap: 'var(--space-2)', width: '100%' }}>
              <Link
                to="/patient/dashboard"
                className="btn btn--secondary"
                style={{ width: '100%', fontSize: '0.85rem', justifyContent: 'flex-start', padding: '0.5rem 0.75rem' }}
              >
                <Icon name="user" size={16} />
                <span>Switch to Patient</span>
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
      <BottomNav items={guardianNavItems} hideOnDesktop />
      <BackToTop />
    </div>
  );
}
