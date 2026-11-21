import Card from '../../components/Card';
import Button from '../../components/Button';
import { loadStore } from '../../utils/mockStore';

export default function PatientDetails() {
  const store = loadStore();
  const patient = store.patient;
  const prescriptions = store.prescriptions;

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)', maxWidth: '45rem' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)' }}>Patient Dossier</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Medical information and prescriptions for {patient.name} ({patient.nickname})
        </p>
      </div>

      {/* CORE PROFILE CARD */}
      <Card title="Patient Profile">
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'var(--space-3)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Full Name</div>
              <strong>{patient.name}</strong>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Age & Gender</div>
              <strong>{patient.age} years / Male</strong>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Phone</div>
              <strong>{patient.phone}</strong>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Spoken Language</div>
              <strong>Hindi (हिंदी) & English</strong>
            </div>
          </div>

          <div
            style={{
              background: 'var(--color-surface-alt)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              marginTop: 'var(--space-2)',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Chronic Conditions</div>
            <strong style={{ color: 'var(--color-primary)' }}>
              Type 2 Diabetes Mellitus, Mild Essential Hypertension
            </strong>
          </div>
        </div>
      </Card>

      {/* ACTIVE PRESCRIPTION HISTORY */}
      <Card title="Verified Prescriptions on File">
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                background: 'var(--color-surface)',
              }}
            >
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--fs-lg)', margin: 0 }}>{rx.doctorName}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {rx.clinicName} • Date: {rx.date}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: '#dcfce7',
                    color: '#166534',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  ✓ Active Schedule Generated
                </span>
              </div>

              <div style={{ marginTop: 'var(--space-3)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                  Medicines ({rx.medicines.length}):
                </div>
                <ul className="stack" style={{ gap: 'var(--space-1)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {rx.medicines.map((m) => (
                    <li key={m.id} className="row" style={{ gap: 'var(--space-2)' }}>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>•</span>
                      <strong>{m.name} ({m.dosage})</strong> — {m.frequency}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* EMERGENCY CONTACT & CALL */}
      <Card tone="highlight">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800 }}>Need to check on Papa right now?</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Direct telephone connection to {patient.phone}
            </div>
          </div>

          <Button variant="primary" icon="phone" href={`tel:${patient.phone}`}>
            Call {patient.nickname}
          </Button>
        </div>
      </Card>
    </div>
  );
}
