import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        padding: 'var(--space-6)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
        {/* Large 404 badge */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary-soft) 0%, #ccfbf1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-6)',
          }}
        >
          <Icon name="help" size={44} style={{ color: 'var(--color-primary)' }} />
        </div>

        <h1 style={{ fontSize: 'var(--fs-4xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
          404
        </h1>
        <h2 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-3)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to your dashboard.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
          <Button variant="primary" size="lg" icon="home" to="/patient/dashboard">
            Go to Dashboard
          </Button>
          <Link
            to="/"
            style={{
              fontSize: 'var(--fs-sm)',
              color: 'var(--color-text-muted)',
              textDecoration: 'underline',
            }}
          >
            Return to Home
          </Link>
        </div>

        <div
          style={{
            marginTop: 'var(--space-8)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-border)',
            fontSize: 'var(--fs-xs)',
            color: 'var(--color-text-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <Icon name="heart" size={14} />
          <span>CareLoop Health · Clinical Regimen System</span>
        </div>
      </div>
    </div>
  );
}
