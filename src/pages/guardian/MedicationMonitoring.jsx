import { useState } from 'react';
import Card from '../../components/Card';
import StatusChip from '../../components/StatusChip';
import Icon from '../../components/Icon';
import Banner from '../../components/Banner';
import { loadStore } from '../../utils/mockStore';

export default function MedicationMonitoring() {
  const store = loadStore();
  const [filter, setFilter] = useState('all');

  const patient = store.patient;
  const doses = store.doses;

  const filtered = filter === 'all' ? doses : doses.filter((d) => d.status === filter);

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)' }}>Medication Monitoring</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Detailed compliance tracking for {patient.name} ({patient.nickname})
        </p>
      </div>

      <Banner variant="info">
        Real-time tracking of taken and pending doses. Timestamps reflect patient confirmation logs.
      </Banner>

      {/* FILTER BUTTONS */}
      <div className="row" style={{ gap: 'var(--space-2)' }}>
        {[
          { id: 'all', label: `All (${doses.length})` },
          { id: 'taken', label: `Taken (${doses.filter((d) => d.status === 'taken').length})` },
          { id: 'pending', label: `Pending (${doses.filter((d) => d.status === 'pending').length})` },
          { id: 'missed', label: `Not Confirmed (${doses.filter((d) => d.status === 'missed').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              background: filter === tab.id ? 'var(--color-primary)' : 'var(--color-surface)',
              color: filter === tab.id ? 'var(--color-on-primary)' : 'var(--color-text)',
              fontWeight: 700,
              fontSize: 'var(--fs-sm)',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MEDICATION LOG CARDS */}
      <div className="stack" style={{ gap: 'var(--space-3)' }}>
        {filtered.map((dose) => (
          <Card key={dose.id}>
            <div className="stack" style={{ gap: 'var(--space-2)' }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="row" style={{ gap: 'var(--space-2)' }}>
                  <Icon name="clock" size={18} style={{ color: 'var(--color-text-muted)' }} />
                  <strong>{dose.scheduledTime}</strong>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    ({dose.slot})
                  </span>
                </div>
                <StatusChip status={dose.status} />
              </div>

              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--fs-lg)', margin: 0 }}>{dose.name}</h3>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {dose.dosage}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {dose.instructions}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {dose.status === 'taken' ? (
                    <div style={{ color: 'var(--color-success-solid)', fontWeight: 700, fontSize: '0.9rem' }}>
                      ✓ Confirmed at {dose.takenAt || '08:12 AM'}
                    </div>
                  ) : dose.status === 'missed' ? (
                    <div style={{ color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.9rem' }}>
                      ⚠️ Alert Triggered (&gt;30m)
                    </div>
                  ) : (
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      Pending patient action
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
