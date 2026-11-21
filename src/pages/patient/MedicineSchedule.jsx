import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import StatusChip from '../../components/StatusChip';
import SpeechButton from '../../components/SpeechButton';
import Banner from '../../components/Banner';
import Icon from '../../components/Icon';
import { t, getLocale } from '../../i18n';
import { loadStore, markDoseStatus, subscribeStore } from '../../utils/mockStore';

export default function MedicineSchedule() {
  const [store, setStore] = useState(loadStore());
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('all'); // all | morning | afternoon | night
  const locale = getLocale();
  const isHi = locale === 'hi';

  useEffect(() => {
    const unsub = subscribeStore(setStore);
    return unsub;
  }, []);

  const doses = store.doses;

  const handleTaken = (doseId, name) => {
    markDoseStatus(doseId, 'taken');
    setToast(isHi ? `${name} ले ली गई! रिकॉर्ड सुरक्षित कर दिया गया है।` : `${name} confirmed taken!`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSnooze = (doseId, name) => {
    markDoseStatus(doseId, 'snoozed');
    setToast(isHi ? `${name} 15 मिनट बाद फिर याद दिलाई जाएगी।` : `${name} snoozed 15 min.`);
    setTimeout(() => setToast(''), 3000);
  };

  const filteredDoses = filter === 'all' ? doses : doses.filter((d) => d.slot === filter);
  const takenCount = doses.filter((d) => d.status === 'taken').length;

  const tabs = [
    { id: 'all', label: isHi ? 'सभी खुराकیں' : 'All Doses', count: doses.length },
    { id: 'morning', label: isHi ? 'सुबह' : 'Morning', count: doses.filter((d) => d.slot === 'morning').length },
    { id: 'afternoon', label: isHi ? 'दोपहर' : 'Afternoon', count: doses.filter((d) => d.slot === 'afternoon').length },
    { id: 'night', label: isHi ? 'रात' : 'Night', count: doses.filter((d) => d.slot === 'night').length },
  ];

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)' }}>
      {toast && (
        <Banner variant="success" onDismiss={() => setToast('')}>
          {toast}
        </Banner>
      )}

      {/* HEADER */}
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--fs-2xl)', letterSpacing: '-0.02em', margin: 0 }}>
            {isHi ? 'दवाओं का समय सारिणी' : 'Daily Medication Schedule'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', margin: 'var(--space-1) 0 0' }}>
            {isHi
              ? 'आज के समय अनुसार अपनी खुराक की पुष्टि करें'
              : 'Chronological timeline of daily doses with one-tap confirmation'}
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <span style={{ color: 'var(--color-success-solid)' }}>● {takenCount} of {doses.length} completed</span>
        </div>
      </div>

      {/* SEGMENTED FILTER PILL TABS */}
      <div
        style={{
          display: 'inline-flex',
          padding: '4px',
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--color-border)',
          gap: '4px',
          maxWidth: '100%',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isActive ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-pill)',
                  background: isActive ? 'var(--color-primary-soft)' : 'rgba(0, 0, 0, 0.05)',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* CHRONOLOGICAL TIMELINE */}
      <div className="stack" style={{ gap: 'var(--space-4)' }}>
        {filteredDoses.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-10) var(--space-4)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--color-text-muted)',
            }}
          >
            No medicines scheduled for this time slot.
          </div>
        ) : (
          filteredDoses.map((dose) => {
            const isTaken = dose.status === 'taken';
            const isMissed = dose.status === 'missed';

            return (
              <div
                key={dose.id}
                className={`dose-card ${
                  isTaken ? 'dose-card--taken' : isMissed ? 'dose-card--missed' : 'dose-card--highlight'
                }`}
                style={{
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {/* Header row: Time + Status chip + Audio */}
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="row" style={{ gap: 'var(--space-2)' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#ffffff',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        boxShadow: 'var(--shadow-xs)',
                      }}
                    >
                      <Icon name="clock" size={16} style={{ color: 'var(--color-primary)' }} />
                      <span>{isHi ? dose.timeHindi || dose.scheduledTime : dose.scheduledTime}</span>
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                      ({dose.slot})
                    </span>
                    <StatusChip status={dose.status} />
                  </div>

                  <SpeechButton medicine={dose} lang={locale} />
                </div>

                {/* Body: Drug info and actions */}
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, margin: 0, letterSpacing: '-0.015em' }}>
                      {isHi ? dose.nameHindi || dose.name : dose.name}
                    </h2>
                    <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 800, color: 'var(--color-primary)', marginTop: '2px' }}>
                      {isHi ? dose.dosageHindi || dose.dosage : dose.dosage}
                    </div>
                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                      💡 {isHi ? dose.instructionsHindi || dose.instructions : dose.instructions}
                    </div>
                    {isTaken && dose.takenAt && (
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--color-success-solid)',
                          fontWeight: 700,
                          marginTop: 'var(--space-2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Icon name="checkCircle" size={15} />
                        <span>Confirmed taken at {dose.takenAt}</span>
                      </div>
                    )}
                  </div>

                  {/* ACTION CONTROLS */}
                  {!isTaken ? (
                    <div className="row" style={{ gap: 'var(--space-2)', width: '100%', maxWidth: '320px' }}>
                      <Button
                        variant="success"
                        size="lg"
                        icon="check"
                        style={{ flex: 2, minHeight: '52px', fontWeight: 700 }}
                        onClick={() => handleTaken(dose.id, dose.name)}
                      >
                        {t('patient.takenBtn')}
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        icon="moon"
                        style={{ flex: 1, minHeight: '52px', fontWeight: 700 }}
                        onClick={() => handleSnooze(dose.id, dose.name)}
                      >
                        15m
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => markDoseStatus(dose.id, 'pending')}
                      style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
                    >
                      Undo
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
