import { Link, useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import Button from '../components/Button';
import Card from '../components/Card';
import Banner from '../components/Banner';
import Icon from '../components/Icon';
import SpeechButton from '../components/SpeechButton';
import { t } from '../i18n';
import { switchRole, loadStore } from '../utils/mockStore';
import { login } from '../utils/auth';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleEnterPatient = () => {
    const store = loadStore();
    login({ ...store.patient, role: 'patient', verified: true });
    switchRole('patient');
    navigate('/patient/dashboard');
  };

  const handleEnterGuardian = () => {
    const store = loadStore();
    login({ ...store.guardian, role: 'guardian', verified: true });
    switchRole('guardian');
    navigate('/guardian/dashboard');
  };

  const sampleDemoMed = {
    name: 'Metformin Hydrochloride',
    nameHindi: 'मेटफॉर्मिन हाइड्रोक्लोराइड',
    dosage: '500 mg',
    dosageHindi: '५०० मिलीग्राम',
    scheduledTime: '08:00 AM',
    timeHindi: 'सुबह 8 बजे',
    instructions: 'Take immediately after morning breakfast with water.',
    instructionsHindi: 'सुबह नाश्ते के तुरंत बाद पानी से लें।',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <HeaderNav />

      {/* Top Banner */}
      <Banner variant="demo" className="page--wide" style={{ margin: 'var(--space-2) auto 0' }}>
        {t('demo.banner')}
      </Banner>

      <main className="page page--wide stack" style={{ '--stack-gap': 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
        {/* HERO SECTION */}
        <section className="landing-hero stack" style={{ '--stack-gap': 'var(--space-5)', alignItems: 'center' }}>
          <div className="hero-pill">
            <Icon name="sparkles" size={16} />
            <span>AI-Powered Prescription & Adherence Ecosystem</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', maxWidth: '48rem', margin: '0 auto', color: 'var(--color-text)' }}>
            {t('landing.hero.title')}
          </h1>

          <p style={{ fontSize: 'var(--fs-lg)', maxWidth: '42rem', margin: '0 auto', color: 'var(--color-text-muted)' }}>
            {t('landing.hero.subtitle')}
          </p>

          <div className="row" style={{ justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
            <Button
              size="lg"
              variant="primary"
              icon="user"
              onClick={handleEnterPatient}
              style={{ minWidth: '220px' }}
            >
              {t('landing.cta.patient')}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              icon="users"
              onClick={handleEnterGuardian}
              style={{ minWidth: '220px' }}
            >
              {t('landing.cta.guardian')}
            </Button>
          </div>

          <div className="row" style={{ justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.95rem' }}>
            <span>Already have an account?</span>
            <Link to="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>Sign In</Link>
            <span>•</span>
            <Link to="/signup" style={{ fontWeight: 700, textDecoration: 'underline' }}>Register Free</Link>
          </div>
        </section>

        {/* INTERACTIVE AUDIO PREVIEW BANNER */}
        <Card tone="highlight">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div className="stack" style={{ gap: 'var(--space-1)', flex: 1 }}>
              <div className="row" style={{ gap: 'var(--space-2)', color: 'var(--color-primary)' }}>
                <Icon name="volume" size={22} />
                <span style={{ fontWeight: 800 }}>Try Audio Guidance (हिंदी / English)</span>
              </div>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
                Sample dose: Metformin 500mg • Press button to test browser speech synthesis:
              </p>
            </div>
            <div className="row" style={{ gap: 'var(--space-3)' }}>
              <SpeechButton medicine={sampleDemoMed} lang="hi" label="हिंदी में सुनें" />
              <SpeechButton medicine={sampleDemoMed} lang="en" label="Listen in English" />
            </div>
          </div>
        </Card>

        {/* HOW CARELOOP WORKS */}
        <section className="stack" style={{ '--stack-gap': 'var(--space-6)' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>How CareLoop Works</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
              From complex prescription slips to automated dosage reminders and family peace of mind.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Icon name="camera" size={26} />
              </div>
              <h3>1. Scan Prescription</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
                Patient or caregiver snaps a photo of the handwritten prescription. The system extracts medicine names, dosages, and frequencies with confidence flags.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Icon name="checkCircle" size={26} />
              </div>
              <h3>2. Verify & Clarify</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
                Unclear handwriting is never guessed. Uncertain dosages are flagged for explicit confirmation before any dose is scheduled.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Icon name="volume" size={26} />
              </div>
              <h3>3. Elderly-Friendly Audio</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
                Patients listen to dosage instructions in their native language with large 72px touch targets to confirm doses as &quot;Taken&quot;.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Icon name="telegram" size={26} />
              </div>
              <h3>4. Telegram Guardian Alerts</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
                If a scheduled dose is not confirmed within 30 minutes, an automated notification is sent to the guardian&apos;s Telegram to check in.
              </p>
            </div>
          </div>
        </section>

        {/* PATIENT VS GUARDIAN BENEFITS */}
        <section className="stack" style={{ '--stack-gap': 'var(--space-6)' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>Designed for Two Generations</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
              A distraction-free, large-text UI for patients, combined with an informative tracking suite for guardians.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            {/* Patient Card */}
            <Card>
              <div className="stack" style={{ gap: 'var(--space-4)' }}>
                <div className="row" style={{ gap: 'var(--space-3)' }}>
                  <div className="feature-icon-wrapper">
                    <Icon name="user" size={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>For Patients</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Elderly & Rural Accessibility</span>
                  </div>
                </div>

                <ul className="stack" style={{ gap: 'var(--space-3)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
                  <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <Icon name="check" size={18} style={{ color: 'var(--color-success-solid)', flexShrink: 0, marginTop: '2px' }} />
                    <span>Large readable typography with high-contrast buttons</span>
                  </li>
                  <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <Icon name="check" size={18} style={{ color: 'var(--color-success-solid)', flexShrink: 0, marginTop: '2px' }} />
                    <span>One-tap Hindi & English voice playback for all instructions</span>
                  </li>
                  <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <Icon name="check" size={18} style={{ color: 'var(--color-success-solid)', flexShrink: 0, marginTop: '2px' }} />
                    <span>Single-button &quot;Taken&quot; or &quot;Snooze&quot; confirmation without confusing options</span>
                  </li>
                  <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <Icon name="check" size={18} style={{ color: 'var(--color-success-solid)', flexShrink: 0, marginTop: '2px' }} />
                    <span>Zero ads, distractions, or complicated health jargon</span>
                  </li>
                </ul>

                <Button variant="primary" fullWidth onClick={handleEnterPatient}>
                  Launch Patient Experience
                </Button>
              </div>
            </Card>

            {/* Guardian Card */}
            <Card>
              <div className="stack" style={{ gap: 'var(--space-4)' }}>
                <div className="row" style={{ gap: 'var(--space-3)' }}>
                  <div className="feature-icon-wrapper" style={{ background: '#f3e8ff', color: '#581c87' }}>
                    <Icon name="users" size={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>For Guardians</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Remote Adherence Monitoring</span>
                  </div>
                </div>

                <ul className="stack" style={{ gap: 'var(--space-3)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
                  <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <Icon name="check" size={18} style={{ color: 'var(--color-success-solid)', flexShrink: 0, marginTop: '2px' }} />
                    <span>Live adherence score & daily taken/pending breakdown</span>
                  </li>
                  <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <Icon name="check" size={18} style={{ color: 'var(--color-success-solid)', flexShrink: 0, marginTop: '2px' }} />
                    <span>Simulated Telegram bot alerts for unconfirmed doses (&gt;30m)</span>
                  </li>
                  <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <Icon name="check" size={18} style={{ color: 'var(--color-success-solid)', flexShrink: 0, marginTop: '2px' }} />
                    <span>Complete medication timeline & 7-day adherence history</span>
                  </li>
                  <li className="row" style={{ gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <Icon name="check" size={18} style={{ color: 'var(--color-success-solid)', flexShrink: 0, marginTop: '2px' }} />
                    <span>Safety checks: duplicate ingredient and interaction alerts</span>
                  </li>
                </ul>

                <Button variant="secondary" fullWidth onClick={handleEnterGuardian}>
                  Launch Guardian Experience
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          <div className="stack" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
            <div className="row" style={{ gap: 'var(--space-2)', color: 'var(--color-primary)', fontWeight: 800 }}>
              <Icon name="heart" size={20} />
              <span>CareLoop Healthcare Systems</span>
            </div>
            <p>
              Precautionary health technology demonstration. Speech synthesis and Telegram alerts run locally via client-side simulation.
            </p>
            <p style={{ fontSize: '0.8rem' }}>
              © 2026 CareLoop. Designed for accessibility, compliance, and compassionate eldercare.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
