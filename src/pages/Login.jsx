import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import FormField from '../components/FormField';
import Icon from '../components/Icon';
import { switchRole } from '../utils/mockStore';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'guardian' ? 'guardian' : 'patient';

  const [role, setRole] = useState(defaultRole);
  const [phone, setPhone] = useState(defaultRole === 'guardian' ? '+91 98111 22334' : '+91 98765 43210');
  const [password, setPassword] = useState('careloop123');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    setPhone(newRole === 'guardian' ? '+91 98111 22334' : '+91 98765 43210');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) { setError('Please enter your phone number.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), password, role }),
      });
      const data = await res.json();

      if (data.success) {
        // Send OTP for verification
        await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phone.trim() }),
        });
        switchRole(role);
        navigate('/verify', {
          state: {
            phone: phone.trim(),
            role,
            name: data.user?.name || (role === 'patient' ? 'Ram Prasad Asija' : 'Aman Asija'),
            userId: data.user?.id || (role === 'patient' ? 'p_101' : 'g_201'),
          },
        });
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      // Fallback: still navigate (backend might be unreachable)
      switchRole(role);
      navigate('/verify', {
        state: {
          phone: phone.trim(),
          role,
          name: role === 'patient' ? 'Ram Prasad Asija' : 'Aman Asija',
          userId: role === 'patient' ? 'p_101' : 'g_201',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      {/* ─── Left branding panel (desktop) ─── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={24} />
            </div>
            <span style={{ fontSize: 'var(--fs-xl)', fontWeight: 800 }}>CareLoop</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.3, marginBottom: 'var(--space-4)' }}>
            Medication Safety,<br />For Every Generation.
          </h1>
          <p style={{ opacity: 0.85, lineHeight: 1.7, maxWidth: '24rem' }}>
            AI-powered prescription scanning, elderly-friendly reminders,
            and real-time guardian alerts — all in one secure platform.
          </p>

          {/* Trust badges */}
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="auth-trust-item">
              <Icon name="shield" size={18} />
              <span>HIPAA & ABHA Compliant</span>
            </div>
            <div className="auth-trust-item">
              <Icon name="checkCircle" size={18} />
              <span>Gemini AI Prescription Analysis</span>
            </div>
            <div className="auth-trust-item">
              <Icon name="telegram" size={18} />
              <span>Real-time Telegram Alerts</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>99.4%</div>
              <div style={{ opacity: 0.75, fontSize: 'var(--fs-xs)' }}>Scan Accuracy</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>50k+</div>
              <div style={{ opacity: 0.75, fontSize: 'var(--fs-xs)' }}>Patients Served</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800 }}>24/7</div>
              <div style={{ opacity: 0.75, fontSize: 'var(--fs-xs)' }}>Guardian Alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right form panel ─── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          {/* Mobile logo */}
          <div className="auth-mobile-logo">
            <Icon name="heart" size={28} style={{ color: 'var(--color-primary)' }} />
            <span>CareLoop</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-pill)', fontSize: 'var(--fs-xs)',
                fontWeight: 700, background: 'var(--color-primary-soft)',
                color: 'var(--color-primary)', marginBottom: 'var(--space-4)',
              }}
            >
              <Icon name="user" size={14} />
              <span>Secure Access</span>
            </div>
            <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-2)' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Sign in to continue to your CareLoop dashboard
            </p>
          </div>

          {/* Role toggle */}
          <div className="auth-role-toggle">
            <button
              type="button"
              onClick={() => handleRoleChange('patient')}
              className={`auth-role-btn ${role === 'patient' ? 'auth-role-btn--active' : ''}`}
            >
              <Icon name="user" size={16} />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('guardian')}
              className={`auth-role-btn ${role === 'guardian' ? 'auth-role-btn--active auth-role-btn--guardian' : ''}`}
            >
              <Icon name="users" size={16} />
              <span>Guardian</span>
            </button>
          </div>

          {/* Demo account hint */}
          <div
            style={{
              background: role === 'patient' ? 'var(--color-primary-soft)' : '#f5f3ff',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-xs)',
              color: role === 'patient' ? 'var(--color-primary)' : '#6d28d9',
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <Icon name="info" size={14} />
            <span>
              Demo: <strong>{role === 'patient' ? 'Ram Prasad (Patient)' : 'Aman Asija (Guardian)'}</strong> · Pre-filled credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {error && (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-danger-bg)',
                  color: 'var(--color-danger)',
                  fontSize: 'var(--fs-sm)', fontWeight: 600,
                }}
              >
                <Icon name="alert" size={16} />
                <span>{error}</span>
              </div>
            )}

            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              hint="Registered phone number"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Remember + Forgot row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant={role === 'guardian' ? 'secondary' : 'primary'}
              size="lg"
              fullWidth
              loading={loading}
              icon="arrowRight"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>New to CareLoop?</span>
          </div>

          <Button
            variant="ghost"
            fullWidth
            to={`/signup?role=${role}`}
            icon="plus"
            style={{ border: '1px solid var(--color-border)' }}
          >
            Create {role === 'guardian' ? 'Guardian' : 'Patient'} Account
          </Button>

          {/* Footer */}
          <div style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--fs-xs)', color: 'var(--color-text-subtle)' }}>
            <p>By signing in, you agree to our <a href="#" style={{ textDecoration: 'underline' }}>Terms of Service</a> & <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
