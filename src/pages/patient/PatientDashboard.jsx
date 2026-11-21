import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import ProgressRing from '../../components/ProgressRing';
import StatusChip from '../../components/StatusChip';
import SpeechButton from '../../components/SpeechButton';
import Icon from '../../components/Icon';
import Banner from '../../components/Banner';
import { t, getLocale } from '../../i18n';
import { loadStore, markDoseStatus, subscribeStore, calculateAdherence } from '../../utils/mockStore';
import { useToast } from '../../context/ToastContext';

export default function PatientDashboard() {
  const toast = useToast();
  const [store, setStore] = useState(loadStore());
  const [localToast, setLocalToast] = useState('');
  const locale = getLocale();
  const isHi = locale === 'hi';

  useEffect(() => {
    const unsub = subscribeStore(setStore);
    return unsub;
  }, []);

  const patient = store.patient;
  const doses = store.doses;

  // Find next pending or snoozed dose
  const nextDose = doses.find((d) => d.status === 'pending' || d.status === 'snoozed') || doses[0];
  const adherence = calculateAdherence(doses);
  const takenCount = doses.filter((d) => d.status === 'taken').length;

  const handleMarkTaken = (doseId, medName) => {
    markDoseStatus(doseId, 'taken');
    const msg = isHi ? `${medName} ले ली गई! रिकॉर्ड सुरक्षित कर दिया गया है।` : `✓ ${medName} confirmed taken! Adherence score updated.`;
    setLocalToast(msg);
    toast.success(msg);
    setTimeout(() => setLocalToast(''), 4000);
  };

  const handleSnooze = (doseId, medName) => {
    markDoseStatus(doseId, 'snoozed');
    const msg = isHi ? `${medName} 15 मिनट के लिए स्थगित की गई।` : `${medName} snoozed for 15 minutes.`;
    setLocalToast(msg);
    toast.info(msg);
    setTimeout(() => setLocalToast(''), 4000);
  };

  const [todayDateStr] = useState(() =>
    new Date().toLocaleDateString(isHi ? 'hi-IN' : 'en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  );

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)' }}>
      {localToast && (
        <Banner variant="success" onDismiss={() => setLocalToast('')}>
          {localToast}
        </Banner>
      )}

      {/* CLINICAL PATIENT PROFILE & STATUS HEADER */}
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
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #0d655f 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
                boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
              }}
            >
              RP
            </div>
            <div>
              <div className="row" style={{ gap: 'var(--space-2)', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: 'var(--color-navy)' }}>
                  {patient.name} ({patient.nickname})
                </h1>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    background: 'var(--color-primary-soft)',
                    border: '1px solid var(--color-primary-soft-border)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  UHID: CL-849102
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Age: <strong>{patient.age}y / Male</strong> · Conditions: <strong>Type 2 Diabetes, Mild HTN</strong> · Attending: <strong>Dr. Rajesh Verma (MD)</strong>
              </div>
            </div>
          </div>

          <div className="row" style={{ gap: 'var(--space-2)' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                background: 'var(--color-primary-soft)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-primary-soft-border)',
              }}
            >
              📅 {todayDateStr}
            </span>

            <Link to="/patient/upload" className="btn btn--primary" style={{ textDecoration: 'none', fontWeight: 700 }}>
              <Icon name="camera" size={17} />
              <span>{t('patient.scanCta')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* HERO NEXT DOSE ACTION STATION (Accessible for Elderly Patients) */}
      {nextDose && (
        <div
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f0fdfa 100%)',
            border: '1.5px solid var(--color-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            boxShadow: '0 8px 24px -4px rgba(15, 118, 110, 0.12), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle decorative background watermarks */}
          <div
            style={{
              position: 'absolute',
              right: '-15px',
              bottom: '-25px',
              opacity: 0.06,
              color: 'var(--color-primary)',
              pointerEvents: 'none',
            }}
          >
            <Icon name="pill" size={180} />
          </div>

          <div className="stack" style={{ gap: 'var(--space-4)', position: 'relative', zIndex: 1 }}>
            {/* Top row: Slot pill + Status + Audio listen */}
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="row" style={{ gap: 'var(--space-2)' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                    background: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <Icon name="clock" size={16} style={{ color: 'var(--color-primary)' }} />
                  <span>{isHi ? nextDose.timeHindi || nextDose.scheduledTime : nextDose.scheduledTime}</span>
                </span>
                <StatusChip status={nextDose.status} />
              </div>

              {/* Text-to-Speech Pill */}
              <SpeechButton medicine={nextDose} lang={locale} />
            </div>

            {/* Dose Details */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                {isHi ? 'अगली निर्धारित खुराक' : 'Next Scheduled Medication'}
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                  fontWeight: 800,
                  color: 'var(--color-text)',
                  letterSpacing: '-0.025em',
                  margin: 'var(--space-1) 0 0',
                }}
              >
                {isHi ? nextDose.nameHindi || nextDose.name : nextDose.name}
              </h2>
              <div
                style={{
                  display: 'inline-block',
                  fontSize: 'var(--fs-lg)',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  background: 'var(--color-primary-soft)',
                  border: '1px solid var(--color-primary-soft-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.25rem 0.75rem',
                  marginTop: 'var(--space-2)',
                }}
              >
                {isHi ? nextDose.dosageHindi || nextDose.dosage : nextDose.dosage}
              </div>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--fs-body)',
                  margin: 'var(--space-2) 0 0',
                  lineHeight: 1.5,
                }}
              >
                💡 {isHi ? nextDose.instructionsHindi || nextDose.instructions : nextDose.instructions}
              </p>
            </div>

            {/* ACTION BUTTONS (Large 64px - 72px tactile targets for seniors) */}
            {nextDose.status !== 'taken' ? (
              <div className="stack" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <Button
                  variant="success"
                  size="lg"
                  icon="check"
                  fullWidth
                  onClick={() => handleMarkTaken(nextDose.id, nextDose.name)}
                  style={{
                    fontSize: '1.25rem',
                    minHeight: '68px',
                    boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)',
                  }}
                >
                  {t('patient.takenBtn')}
                </Button>

                <div className="row" style={{ gap: 'var(--space-3)' }}>
                  <Button
                    variant="secondary"
                    size="md"
                    icon="moon"
                    style={{ flex: 1, minHeight: '48px', fontWeight: 700 }}
                    onClick={() => handleSnooze(nextDose.id, nextDose.name)}
                  >
                    {t('patient.snoozeBtn')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    icon="skip"
                    style={{ flex: 1, minHeight: '48px', fontWeight: 600 }}
                    onClick={() => markDoseStatus(nextDose.id, 'skipped')}
                  >
                    Skip Dose
                  </Button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'var(--status-taken-bg)',
                  border: '1px solid var(--status-taken-border)',
                  color: 'var(--status-taken-fg)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  fontWeight: 700,
                  fontSize: 'var(--fs-body)',
                }}
              >
                <Icon name="checkCircle" size={26} />
                <div>
                  <div>
                    {isHi ? `दवा ली जा चुकी है (${nextDose.takenAt || 'समय पर'})` : `Dose confirmed taken (${nextDose.takenAt || 'on time'})`}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-success-text)', marginTop: '2px' }}>
                    Great job staying consistent with your daily regimen!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADHERENCE & GUARDIAN OVERSIGHT SPLIT ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
        {/* ADHERENCE SUMMARY */}
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
          <ProgressRing percent={adherence} caption="adherence" size={115} />
          <div className="stack" style={{ gap: 'var(--space-1)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              {t('patient.todayProgress')}
            </div>
            <div style={{ fontSize: 'var(--fs-3xl)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
              {takenCount} <span style={{ fontSize: 'var(--fs-lg)', color: 'var(--color-text-muted)', fontWeight: 600 }}>/ {doses.length}</span>
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
              {isHi ? 'खुराकें पूरी हुईं' : 'doses taken today'}
            </div>
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-success-solid)',
                fontWeight: 700,
                marginTop: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Icon name="checkCircle" size={15} />
              <span>{adherence}% regimen on track</span>
            </div>
          </div>
        </div>

        {/* CONNECTED GUARDIAN OVERSIGHT */}
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
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="row" style={{ gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: '#f5f3ff',
                  color: '#6d28d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  border: '1px solid #ddd6fe',
                }}
              >
                AA
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Family Guardian
                </div>
                <div style={{ fontWeight: 800, fontSize: 'var(--fs-lg)' }}>{patient.guardian?.name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  {patient.guardian?.relationship} • {patient.guardian?.phone}
                </div>
              </div>
            </div>

            <a
              href={`tel:${patient.guardian?.phone}`}
              className="btn btn--secondary"
              style={{
                textDecoration: 'none',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <Icon name="phone" size={14} />
              <span>Call</span>
            </a>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: '0.8125rem',
              color: '#15803d',
              background: '#dcfce7',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
          >
            <Icon name="checkCircle" size={15} />
            <span>Telegram Bot connected for emergency missed-dose alerts</span>
          </div>
        </div>
      </div>

      {/* TODAY'S MEDICINE TIMELINE */}
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
              {t('patient.todaySchedule')}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Chronological schedule of all active doses for today
            </div>
          </div>

          <Link
            to="/patient/schedule"
            style={{
              fontSize: 'var(--fs-sm)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Full Schedule Details</span>
            <span>→</span>
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
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                    }}
                  >
                    <Icon name="clock" size={16} style={{ color: 'var(--color-text-muted)' }} />
                    <span>{isHi ? dose.timeHindi || dose.scheduledTime : dose.scheduledTime}</span>
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                    • {dose.slot}
                  </span>
                </div>

                <div className="row" style={{ gap: 'var(--space-2)' }}>
                  <StatusChip status={dose.status} size="sm" />
                  <SpeechButton medicine={dose} lang={locale} />
                </div>
              </div>

              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                    {isHi ? dose.nameHindi || dose.name : dose.name}
                  </h3>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.95rem', marginTop: '2px' }}>
                    {isHi ? dose.dosageHindi || dose.dosage : dose.dosage}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {isHi ? dose.instructionsHindi || dose.instructions : dose.instructions}
                  </div>
                </div>

                {dose.status !== 'taken' ? (
                  <Button
                    variant="success"
                    size="md"
                    icon="check"
                    onClick={() => handleMarkTaken(dose.id, dose.name)}
                    style={{ minHeight: '44px', paddingInline: '1.25rem' }}
                  >
                    {t('patient.takenBtn')}
                  </Button>
                ) : (
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
                    <span>{dose.takenAt ? `Taken at ${dose.takenAt}` : 'Taken'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
