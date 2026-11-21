import { useState } from 'react';
import Button from '../../components/Button';
import ProgressRing from '../../components/ProgressRing';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import { getLocale } from '../../i18n';
import { loadStore } from '../../utils/mockStore';

export default function MedicineHistory() {
  const store = loadStore();
  const locale = getLocale();
  const isHi = locale === 'hi';
  const history = store.history;
  const patient = store.patient;
  const doses = store.doses;

  const [selectedDay, setSelectedDay] = useState(history[0]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [generatedDate] = useState(() => new Date().toLocaleDateString());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)' }}>
      {/* HEADER */}
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--fs-2xl)', letterSpacing: '-0.02em', margin: 0 }}>
            {isHi ? 'दवाओं का पुराना रिकॉर्ड' : 'Medication History & Adherence'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', margin: 'var(--space-1) 0 0' }}>
            {isHi
              ? 'पिछले 7 दिनों में ली गई और छूटी हुई दवाओं का विवरण'
              : 'Review your 7-day adherence record and export clinical summaries'}
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon="chart"
          onClick={() => setIsReportOpen(true)}
          style={{ fontWeight: 700 }}
        >
          {isHi ? 'डॉक्टर रिपोर्ट बनाएं' : 'Export Doctor Report'}
        </Button>
      </div>

      {/* 7-DAY SUMMARY GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
        {/* WEEKLY ADHERENCE RING */}
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
          <ProgressRing percent={94} size={115} caption="weekly" />
          <div className="stack" style={{ gap: 'var(--space-1)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              7-Day Adherence Score
            </div>
            <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
              33 / 35 <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', fontWeight: 600 }}>doses</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-success-solid)', fontWeight: 700 }}>
              ✓ 94% on-time consistency
            </div>
          </div>
        </div>

        {/* GUARDIAN CHECK-IN RECORD */}
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
            <div className="row" style={{ gap: 'var(--space-2)', color: 'var(--color-primary)', alignItems: 'center' }}>
              <Icon name="telegram" size={20} />
              <strong style={{ fontSize: 'var(--fs-sm)' }}>Guardian Telegram Sync Active</strong>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 'var(--space-2) 0 0', lineHeight: 1.5 }}>
              Only 1 automated missed-dose alert was triggered over the last 7 days, which was safely confirmed within 7 minutes.
            </p>
          </div>

          <div
            style={{
              fontSize: '0.8125rem',
              color: '#166534',
              background: '#dcfce7',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
          >
            ✓ Family peace-of-mind score: 98%
          </div>
        </div>
      </div>

      {/* DAILY LOG LIST */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Daily Breakdown & Adherence Log
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Click any day to review dosage completion details
          </div>
        </div>

        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          {history.map((day, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedDay(day)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedDay(day)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${selectedDay?.date === day.date ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: selectedDay?.date === day.date ? 'var(--color-primary-soft)' : '#ffffff',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div className="row" style={{ gap: 'var(--space-3)' }}>
                <Icon
                  name="calendar"
                  size={18}
                  style={{ color: selectedDay?.date === day.date ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                />
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{day.date}</strong>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                    {day.taken} taken • {day.pending || 0} pending • {day.missed} unconfirmed
                  </div>
                </div>
              </div>

              <div className="row" style={{ gap: 'var(--space-3)' }}>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: day.adherence === 100 ? 'var(--color-success-solid)' : '#ca8a04',
                  }}
                >
                  {day.adherence}%
                </span>
                <Icon name="chevronRight" size={16} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOCTOR CLINICAL ADHERENCE REPORT MODAL */}
      <Modal
        open={isReportOpen}
        title="Clinical Adherence Summary Report"
        onClose={() => setIsReportOpen(false)}
        footer={
          <div className="row" style={{ justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Certified for Primary Physician & Cardiology Review
            </span>
            <div className="row" style={{ gap: 'var(--space-2)' }}>
              <Button variant="ghost" onClick={() => setIsReportOpen(false)}>
                Close
              </Button>
              <Button variant="primary" icon="check" onClick={handlePrint}>
                Print / Save PDF
              </Button>
            </div>
          </div>
        }
      >
        <div className="stack" style={{ gap: 'var(--space-4)', color: '#1e293b' }}>
          {/* REPORT HEADER */}
          <div style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: 'var(--space-3)' }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.4rem' }}>
                  CareLoop Clinical Adherence Record
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Patient ID: {patient.id} • Generated: {generatedDate}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                <strong>Adherence Score: 94%</strong>
                <div style={{ color: '#16a34a' }}>● Reliable Regimen</div>
              </div>
            </div>
          </div>

          {/* PATIENT DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', fontSize: '0.9rem', background: '#f8fafc', padding: 'var(--space-3)', borderRadius: '6px' }}>
            <div><strong>Patient Name:</strong> {patient.name} ({patient.nickname})</div>
            <div><strong>Age / Gender:</strong> {patient.age} yrs / Male</div>
            <div><strong>Primary Diagnoses:</strong> Type 2 Diabetes, Mild Hypertension</div>
            <div><strong>Guardian Contact:</strong> {patient.guardian?.name} ({patient.guardian?.phone})</div>
          </div>

          {/* ACTIVE REGIMEN TABLE */}
          <div>
            <strong style={{ fontSize: '0.95rem' }}>Active Prescribed Regimen:</strong>
            <div style={{ marginTop: 'var(--space-2)', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 12px' }}>Medicine</th>
                    <th style={{ padding: '8px 12px' }}>Dosage</th>
                    <th style={{ padding: '8px 12px' }}>Frequency</th>
                    <th style={{ padding: '8px 12px' }}>Timing</th>
                  </tr>
                </thead>
                <tbody>
                  {doses.map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{d.name}</td>
                      <td style={{ padding: '8px 12px' }}>{d.dosage}</td>
                      <td style={{ padding: '8px 12px' }}>{d.instructions}</td>
                      <td style={{ padding: '8px 12px' }}>{d.scheduledTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CLINICIAN NOTES & SIGNATURE AREA */}
          <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              <div><strong>Physician Remarks:</strong></div>
              <div style={{ minHeight: '40px', borderBottom: '1px solid #cbd5e1', marginTop: '6px' }}></div>
            </div>
            <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>
              <div style={{ height: '36px' }}></div>
              <div style={{ borderTop: '1px solid #64748b', paddingTop: '4px' }}>Doctor Signature & Stamp</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
