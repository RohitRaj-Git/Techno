import Card from '../../components/Card';
import Banner from '../../components/Banner';
import Icon from '../../components/Icon';
import { t, getLocale } from '../../i18n';
import { loadStore } from '../../utils/mockStore';

export default function MedicineSafety() {
  const store = loadStore();
  const locale = getLocale();
  const isHi = locale === 'hi';
  const warnings = store.safetyWarnings;

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)' }}>{t('safety.title')}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {isHi
            ? 'आपकी वर्तमान पर्चियों में रासायनिक दोहराव और परस्पर प्रभाव की जांच'
            : 'Automated pre-screening for drug duplicate compounds and timing conflicts'}
        </p>
      </div>

      <Banner variant="info" title="Precautionary Notice">
        {t('safety.disclaimer')}
      </Banner>

      {/* SAFETY WARNING CARDS */}
      <div className="stack" style={{ gap: 'var(--space-4)' }}>
        {warnings.map((warn) => {
          const isWarning = warn.type === 'warning';
          const isSuccess = warn.type === 'success';

          return (
            <Card key={warn.id} tone={isWarning ? 'warning' : 'default'}>
              <div className="stack" style={{ gap: 'var(--space-3)' }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="row" style={{ gap: 'var(--space-2)' }}>
                    <Icon
                      name={isSuccess ? 'shield' : isWarning ? 'alert' : 'info'}
                      size={24}
                      style={{
                        color: isSuccess
                          ? 'var(--color-success-solid)'
                          : isWarning
                          ? 'var(--color-danger)'
                          : 'var(--color-primary)',
                      }}
                    />
                    <h2 style={{ fontSize: 'var(--fs-lg)', margin: 0 }}>
                      {isHi ? warn.titleHindi || warn.title : warn.title}
                    </h2>
                  </div>

                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      background: isSuccess ? '#dcfce7' : isWarning ? '#fef3c7' : 'var(--color-primary-soft)',
                      color: isSuccess ? '#166534' : isWarning ? '#92400e' : 'var(--color-primary-soft-text)',
                    }}
                  >
                    {warn.level}
                  </span>
                </div>

                <p style={{ fontSize: 'var(--fs-body)', color: 'var(--color-text)' }}>
                  {isHi ? warn.descriptionHindi || warn.description : warn.description}
                </p>

                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: 'var(--space-2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                  }}
                >
                  <Icon name="checkCircle" size={16} />
                  <span>Verified against WHO Model Lists of Essential Medicines standards</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* GENERAL PRECAUTIONS */}
      <Card title="Elderly Medication Guidelines">
        <ul className="stack" style={{ gap: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
          <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>•</span>
            <span>Always swallow blood pressure tablets with fresh water, not tea or milk.</span>
          </li>
          <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>•</span>
            <span>If a dose is missed by more than 4 hours, do not take a double dose at the next slot.</span>
          </li>
          <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>•</span>
            <span>Keep your Guardian informed whenever you feel lightheaded or nauseous.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
