import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import Icon from '../../components/Icon';
import SpeechButton from '../../components/SpeechButton';
import { t, getLocale } from '../../i18n';
import { getPendingReviewPrescription, addConfirmedPrescription } from '../../utils/mockStore';

export default function PrescriptionReview() {
  const navigate = useNavigate();
  const locale = getLocale();
  const isHi = locale === 'hi';

  const pendingData = getPendingReviewPrescription();
  const [medicines, setMedicines] = useState(pendingData.medicines || []);
  const [editingMed, setEditingMed] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmedAll, setIsConfirmedAll] = useState(false);
  const [showOriginalImage, setShowOriginalImage] = useState(true);

  // Form edit states
  const [editName, setEditName] = useState('');
  const [editDosage, setEditDosage] = useState('');
  const [editFrequency, setEditFrequency] = useState('');
  const [editInstructions, setEditInstructions] = useState('');

  const handleOpenEdit = (med) => {
    setEditingMed(med);
    setEditName(med.name);
    setEditDosage(med.dosage);
    setEditFrequency(med.frequency);
    setEditInstructions(med.instructions);
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingMed) return;
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === editingMed.id
          ? {
              ...m,
              name: editName,
              dosage: editDosage,
              frequency: editFrequency,
              instructions: editInstructions,
              uncertain: false,
              flagReason: 'Verified and manually corrected by user',
            }
          : m
      )
    );
    setIsModalOpen(false);
    setEditingMed(null);
  };

  const handleConfirmAndSchedule = () => {
    // Add confirmed prescription to active store schedule
    addConfirmedPrescription(medicines, {
      doctorName: pendingData.doctorName || 'Dr. Verified Physician',
      clinicName: pendingData.clinicName || 'CareLoop Verified Clinic',
      date: pendingData.date || new Date().toISOString().split('T')[0],
      image: pendingData.originalImage || null,
      modelUsed: pendingData.modelUsed || 'Gemini Multimodal Vision',
    });
    setIsConfirmedAll(true);
    setTimeout(() => {
      navigate('/patient/schedule');
    }, 800);
  };

  const uncertainCount = medicines.filter((m) => m.uncertain).length;

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)', maxWidth: '48rem' }}>
      <div>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="row" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  background: 'var(--color-primary-soft)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-primary-soft-border)',
                }}
              >
                Verification Station
              </span>
              {pendingData.modelUsed && (
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    background: 'var(--color-surface-alt)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  {pendingData.modelUsed}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 'var(--fs-2xl)', letterSpacing: '-0.02em', margin: 0 }}>
              {t('rx.review.title')}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', margin: 'var(--space-1) 0 0' }}>
              {pendingData.doctorName ? `${pendingData.doctorName} • ${pendingData.clinicName || ''}` : 'Review and verify extracted medication details'}
            </p>
          </div>

          <Button
            variant="ghost"
            size="md"
            style={{ fontSize: '0.85rem' }}
            onClick={() => setShowOriginalImage((prev) => !prev)}
          >
            <Icon name={showOriginalImage ? 'eyeOff' : 'eye'} size={18} />
            <span>{showOriginalImage ? 'Hide Slip' : 'Show Slip'}</span>
          </Button>
        </div>
      </div>

      {uncertainCount > 0 ? (
        <div
          style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ color: '#d97706', marginTop: '2px' }}>
            <Icon name="alert" size={20} />
          </div>
          <div style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>
            <strong>Manual Verification Required ({uncertainCount} Flagged Item):</strong>{' '}
            {t('rx.review.flagNotice')}
          </div>
        </div>
      ) : (
        <div
          style={{
            background: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ color: '#059669', marginTop: '2px' }}>
            <Icon name="checkCircle" size={20} />
          </div>
          <div style={{ fontSize: '0.85rem', color: '#065f46', lineHeight: 1.5 }}>
            <strong>High-Confidence AI Extraction:</strong> All extracted medicines have passed clinical validation guidelines.
          </div>
        </div>
      )}

      {/* ORIGINAL PRESCRIPTION COMPARISON VIEW */}
      {pendingData.originalImage && showOriginalImage && (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
            Original Doctor Prescription Slip
          </div>
          <div
            style={{
              background: 'var(--color-surface-alt)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <img
              src={pendingData.originalImage}
              alt="Original prescription"
              style={{
                maxHeight: '260px',
                width: 'auto',
                margin: '0 auto',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-sm)',
              }}
            />
          </div>
        </div>
      )}

      {/* EXTRACTED MEDICINE CARDS */}
      <div className="stack" style={{ gap: 'var(--space-4)' }}>
        {medicines.map((med, idx) => (
          <div
            key={med.id || idx}
            style={{
              background: '#ffffff',
              border: `1.5px solid ${med.uncertain ? '#fde68a' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              boxShadow: med.uncertain ? '0 4px 12px rgba(217, 119, 6, 0.08)' : 'var(--shadow-sm)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div className="stack" style={{ gap: 'var(--space-3)' }}>
              {/* Card top bar */}
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 800, margin: 0 }}>
                  {idx + 1}. {isHi ? med.nameHindi || med.name : med.name}
                </h3>

                <div className="row" style={{ gap: 'var(--space-2)' }}>
                  {med.uncertain ? (
                    <span className="flag-badge">
                      <Icon name="alert" size={15} />
                      <span>Check Handwriting</span>
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--color-success-solid)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'var(--status-taken-bg)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-pill)',
                      }}
                    >
                      <Icon name="checkCircle" size={14} />
                      <span>High Confidence</span>
                    </span>
                  )}
                  <SpeechButton medicine={med} lang={locale} />
                </div>
              </div>

              {med.uncertain && med.flagReason && (
                <div
                  style={{
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  ⚠️ Flagged for your review: {med.flagReason}
                </div>
              )}

              {/* Grid of properties */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 'var(--space-3)',
                  background: 'var(--color-surface-alt)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Dosage</div>
                  <strong style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                    {isHi ? med.dosageHindi || med.dosage : med.dosage}
                  </strong>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Frequency</div>
                  <strong style={{ fontSize: '0.95rem' }}>{isHi ? med.frequencyHindi || med.frequency : med.frequency}</strong>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Schedule Timing</div>
                  <strong style={{ fontSize: '0.95rem' }}>{med.scheduledTimes?.join(', ') || '08:00 AM'}</strong>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Duration</div>
                  <strong style={{ fontSize: '0.95rem' }}>{med.duration}</strong>
                </div>
              </div>

              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-1)' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  💡 {isHi ? med.instructionsHindi || med.instructions : med.instructions}
                </div>

                <Button
                  variant="secondary"
                  size="md"
                  icon="edit"
                  onClick={() => handleOpenEdit(med)}
                  style={{ minHeight: '38px', paddingInline: '1rem' }}
                >
                  {t('common.edit')}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MEDICAL DISCLAIMER */}
      <div
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
          background: 'var(--color-surface)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          lineHeight: 1.5,
        }}
      >
        <strong>Safety Notice:</strong> {pendingData.disclaimer || 'CareLoop AI extraction is designed to assist elderly patients and family guardians with schedule management and is not a medical diagnosis. Never alter doctor prescribed dosages without direct medical consultation.'}
      </div>

      {/* CONFIRMATION ACTION STATION */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
          border: '1.5px solid var(--color-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          boxShadow: '0 6px 20px rgba(15, 118, 110, 0.12)',
        }}
      >
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <div style={{ fontWeight: 800, fontSize: 'var(--fs-xl)', color: 'var(--color-text)' }}>
            Establish Daily Medication Routine
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
            Confirming will establish your morning, afternoon, and night dosage reminders, configure audio pronunciations, and connect real-time Telegram adherence alerts.
          </p>

          <Button
            variant="success"
            size="lg"
            icon="checkCircle"
            fullWidth
            loading={isConfirmedAll}
            onClick={handleConfirmAndSchedule}
            style={{
              fontSize: '1.25rem',
              minHeight: '64px',
              boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
            }}
          >
            {t('rx.review.confirmBtn')}
          </Button>
        </div>
      </div>

      {/* EDIT MODAL */}
      <Modal
        open={isModalOpen}
        title={t('rx.review.editMedicine')}
        onClose={() => setIsModalOpen(false)}
        footer={
          <div className="row" style={{ justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              {t('common.save')}
            </Button>
          </div>
        }
      >
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <FormField
            label="Medicine Name"
            name="editName"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <FormField
            label="Dosage (Strength)"
            name="editDosage"
            value={editDosage}
            onChange={(e) => setEditDosage(e.target.value)}
            hint="e.g. 500 mg or 5 mg"
          />

          <FormField
            label="Frequency"
            name="editFrequency"
            value={editFrequency}
            onChange={(e) => setEditFrequency(e.target.value)}
            hint="e.g. Twice daily, Once daily"
          />

          <FormField
            label="Special Instructions"
            name="editInstructions"
            as="textarea"
            rows={3}
            value={editInstructions}
            onChange={(e) => setEditInstructions(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
