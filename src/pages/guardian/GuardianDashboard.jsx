import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import ProgressRing from '../../components/ProgressRing';
import StatusChip from '../../components/StatusChip';
import Banner from '../../components/Banner';
import Icon from '../../components/Icon';
import { loadStore, subscribeStore, calculateAdherence, simulateMissedDoseAlert } from '../../utils/mockStore';
import { useToast } from '../../context/ToastContext';

export default function GuardianDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [store, setStore] = useState(loadStore());
  const [alertToast, setAlertToast] = useState('');

  useEffect(() => {
    const unsub = subscribeStore(setStore);
    return unsub;
  }, []);

  const patient = store.patient;
  const doses = store.doses;
  const alerts = store.alerts;
  const adherence = calculateAdherence(doses);

  const takenCount = doses.filter((d) => d.status === 'taken').length;
  const pendingCount = doses.filter((d) => d.status === 'pending').length;
  const missedCount = doses.filter((d) => d.status === 'missed').length;

  const handleSimulateAlert = () => {
    simulateMissedDoseAlert('Amlodipine 5 mg', '08:00 PM');
    const msg = 'Simulated 30-min missed dose alert generated for Telegram!';
    setAlertToast(msg);
    toast.warning(msg);
    setTimeout(() => setAlertToast(''), 4000);
  };

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)' }}>
      {alertToast && (
        <Banner variant="warning" onDismiss={() => setAlertToast('')}>
          {alertToast}
        </Banner>
      )}

      {/* EXECUTIVE CLINICAL GUARDIAN PROFILE HEADER */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-5) var(--space-6)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div className="row" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
                boxShadow: '0 2px 8px rgba(109, 40, 217, 0.25)',
              }}
            >
              AA
            </div>
            <div>
              <div className="row" style={{ gap: 'var(--space-2)', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: 'var(--color-navy)' }}>
                  Aman Asija
                </h1>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#6d28d9',
                    background: '#f5f3ff',
                    border: '1px solid #ddd6fe',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  Family Proxy &amp; Guardian
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#15803d',
                    background: '#dcfce7',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  ● Telegram Sync Active
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Monitoring Regimen for: <strong>{patient.name} ({patient.nickname})</strong> · 68y / Male · Primary Doctor: <strong>Dr. Rajesh Verma (MD)</strong>
              </div>
            </div>
          </div>

          <div className="row" style={{ gap: 'var(--space-2)' }}>
            <Button
              variant="secondary"
              size="md"
              icon="sparkles"
              onClick={handleSimulateAlert}
              style={{ fontWeight: 700 }}
            >
              Simulate Missed Dose
            </Button>
            <Button
              variant="primary"
              size="md"
              icon="telegram"
              onClick={() => navigate('/guardian/telegram')}
              style={{
                background: 'linear-gradient(135deg, #2aabee 0%, #0284c7 100%)',
                borderColor: '#0284c7',
                fontWeight: 700,
              }}
            >
              Telegram Live Bot
            </Button>
          </div>
        </div>
      </div>

      {/* CRITICAL MISSED DOSE WARNING BANNER */}
      {missedCount > 0 && (
        <div
          style={{
            background: 'linear-gradient(90deg, #fff1f2 0%, #ffe4e6 100%)',
            border: '1.5px solid #fecdd3',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
          }}
        >
          <div className="row" style={{ gap: 'var(--space-3)' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e11d48',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="alert" size={22} />
            </div>
            <div>
              <strong style={{ color: '#9f1239', fontSize: 'var(--fs-body)' }}>
                Attention: {missedCount} Unconfirmed Evening Dose Reported
              </strong>
              <div style={{ fontSize: '0.875rem', color: '#be123c', marginTop: '2px' }}>
                Papa has not confirmed his scheduled medication within 30 minutes. Automated Telegram alert sent.
              </div>
            </div>
          </div>

          <a
            href={`tel:${patient.phone}`}
            className="btn btn--danger"
            style={{ textDecoration: 'none', padding: '0.5rem 1.25rem', fontWeight: 700 }}
          >
            <Icon name="phone" size={16} />
            <span>Call Papa Now ({patient.phone})</span>
          </a>
        </div>
      )}

      {/* EXECUTIVE VITALS GRID (3 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
        {/* 1. ADHERENCE RATE RING */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-5)',
          }}
        >
          <ProgressRing percent={adherence} size={115} caption="adherence" />
          <div className="stack" style={{ gap: 'var(--space-1)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Today&apos;s Adherence
            </div>
            <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--color-text)' }}>
              {takenCount} of {doses.length} <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--color-text-muted)' }}>taken</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: adherence >= 80 ? 'var(--color-success-solid)' : '#ca8a04', fontWeight: 700 }}>
              {adherence >= 80 ? '✓ High routine consistency' : '⚠️ Unconfirmed doses pending'}
            </div>
          </div>
        </div>

        {/* 2. DOSE STATUS BREAKDOWN */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Daily Schedule Status
            </div>
            <div className="row" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <div
                style={{
                  flex: 1,
                  background: 'var(--status-taken-bg)',
                  border: '1px solid var(--status-taken-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-2) var(--space-3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-taken-fg)' }}>{takenCount}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-taken-fg)' }}>TAKEN</div>
              </div>

              <div
                style={{
                  flex: 1,
                  background: 'var(--status-pending-bg)',
                  border: '1px solid var(--status-pending-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-2) var(--space-3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-pending-fg)' }}>{pendingCount}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-pending-fg)' }}>PENDING</div>
              </div>

              <div
                style={{
                  flex: 1,
                  background: missedCount > 0 ? '#fff1f2' : 'var(--color-surface-alt)',
                  border: `1px solid ${missedCount > 0 ? '#fecdd3' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-2) var(--space-3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: missedCount > 0 ? '#e11d48' : 'var(--color-text-muted)' }}>
                  {missedCount}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: missedCount > 0 ? '#e11d48' : 'var(--color-text-muted)' }}>
                  MISSED
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Next scheduled confirmation: <strong>08:00 PM (Night)</strong>
          </div>
        </div>

        {/* 3. PATIENT & PHYSICIAN PROFILE SUMMARY */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Clinical Context
            </div>
            <div style={{ fontWeight: 800, fontSize: 'var(--fs-lg)', color: 'var(--color-text)', marginTop: '2px' }}>
              Type 2 Diabetes & Hypertension
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Dr. Rajesh Verma • MCI/2012/84910
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-success-solid)', fontWeight: 600 }}>
              ✓ Prescriptions up-to-date
            </span>
            <Link
              to="/guardian/patient"
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                textDecoration: 'none',
              }}
            >
              Patient File →
            </Link>
          </div>
        </div>
      </div>

      {/* TODAY'S MEDICINE CONFIRMATION AUDIT TRAIL */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Medication Schedule & Confirmation Audit
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Real-time patient adherence records with confirmation timestamps
            </div>
          </div>

          <Link
            to="/guardian/monitoring"
            style={{
              fontSize: 'var(--fs-sm)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            Live Monitor View →
          </Link>
        </div>

        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          {doses.map((dose) => (
            <div
              key={dose.id}
              className={`dose-card ${
                dose.status === 'taken'
                  ? 'dose-card--taken'
                  : dose.status === 'missed'
                  ? 'dose-card--missed'
                  : 'dose-card--highlight'
              }`}
            >
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="row" style={{ gap: 'var(--space-2)' }}>
                  <Icon name="clock" size={18} style={{ color: 'var(--color-text-muted)' }} />
                  <strong style={{ fontSize: 'var(--fs-sm)' }}>{dose.scheduledTime}</strong>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    ({dose.slot})
                  </span>
                </div>

                <StatusChip status={dose.status} size="sm" />
              </div>

              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 800, margin: 0 }}>{dose.name}</h3>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.95rem', marginTop: '2px' }}>
                    {dose.dosage}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {dose.instructions}
                  </div>
                </div>

                {dose.status === 'taken' ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--color-success-solid)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      background: 'var(--status-taken-bg)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    <Icon name="checkCircle" size={16} />
                    <span>Confirmed taken {dose.takenAt ? `at ${dose.takenAt}` : 'on schedule'}</span>
                  </div>
                ) : dose.status === 'missed' ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--color-danger)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      background: '#fff1f2',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid #fecdd3',
                    }}
                  >
                    <Icon name="alert" size={16} />
                    <span>Unconfirmed (&gt;30m delay)</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    Scheduled for upcoming slot
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TELEGRAM SAFETY NOTIFICATION AUDIT */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Recent Notification Audit Feed
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Synchronized with @CareLoopGuardianBot on Telegram
            </div>
          </div>

          <Link
            to="/guardian/telegram"
            style={{
              fontSize: 'var(--fs-sm)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            Launch Interactive Bot Simulator →
          </Link>
        </div>

        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          {alerts.slice(0, 3).map((alt) => (
            <div
              key={alt.id}
              style={{
                display: 'flex',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                background: alt.status === 'unconfirmed' ? '#fff1f2' : 'var(--color-surface-alt)',
                border: `1px solid ${alt.status === 'unconfirmed' ? '#fecdd3' : 'var(--color-border)'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ color: alt.status === 'unconfirmed' ? '#e11d48' : '#0284c7', marginTop: '2px' }}>
                <Icon name={alt.status === 'unconfirmed' ? 'alert' : 'telegram'} size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.9rem', color: alt.status === 'unconfirmed' ? '#9f1239' : 'inherit' }}>
                    {alt.type === 'missed_dose' ? 'Missed Dose Urgent Alert' : 'System Adherence Update'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {alt.timestamp}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', margin: 'var(--space-1) 0 0', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  {alt.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
