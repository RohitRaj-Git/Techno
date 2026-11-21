import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Button from '../components/Button';
import FormField from '../components/FormField';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      {/* Left branding panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={24} />
            </div>
            <span style={{ fontSize: 'var(--fs-xl)', fontWeight: 800 }}>CareLoop</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.3, marginBottom: 'var(--space-4)' }}>
            Account Recovery
          </h1>
          <p style={{ opacity: 0.85, lineHeight: 1.7, maxWidth: '24rem' }}>
            Don&apos;t worry — we&apos;ll help you regain access. Enter your registered phone number
            and we&apos;ll send a password reset link via SMS.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {/* Mobile logo */}
          <div className="auth-mobile-logo">
            <Icon name="heart" size={28} style={{ color: 'var(--color-primary)' }} />
            <span>CareLoop</span>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'var(--color-success-bg)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-5)',
                }}
              >
                <Icon name="send" size={36} style={{ color: 'var(--color-success-solid)' }} />
              </div>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>Reset Link Sent!</h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                We&apos;ve sent a password reset link to your registered phone number.
                Check your SMS inbox and follow the instructions.
              </p>
              <Button variant="primary" to="/login" icon="arrowRight">
                Back to Sign In
              </Button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-pill)', fontSize: 'var(--fs-xs)',
                    fontWeight: 700, background: '#fef3c7', color: '#92400e',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  <Icon name="help" size={14} />
                  <span>Password Recovery</span>
                </div>
                <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-2)' }}>
                  Forgot your password?
                </h1>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Enter the phone number associated with your CareLoop account
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <FormField
                  label="Registered Phone Number"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  hint="Enter the phone number used during registration"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon="send"
                >
                  Send Reset Link
                </Button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-5)', fontSize: 'var(--fs-sm)' }}>
                <Link
                  to="/login"
                  style={{ color: 'var(--color-text-muted)', textDecoration: 'underline', fontWeight: 600 }}
                >
                  ← Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
