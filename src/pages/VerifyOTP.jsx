import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { login as loginSession } from '../utils/auth';
import { switchRole } from '../utils/mockStore';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const meta = location.state || {};
  const phone = meta.phone || '+91 98765 43210';
  const role = meta.role || 'patient';
  const userName = meta.name || 'User';
  const userId = meta.userId || 'p_101';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  // Countdown for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();

      if (data.success) {
        setVerified(true);
        // Create session
        loginSession({ id: userId, name: userName, role, phone, verified: true });
        switchRole(role);
        setTimeout(() => {
          navigate(role === 'guardian' ? '/guardian/dashboard' : '/patient/dashboard', { replace: true });
        }, 1500);
      } else {
        setError(data.error || 'Invalid verification code');
        setLoading(false);
      }
    } catch {
      setError('Verification service unavailable. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendTimer(30);
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
    } catch {
      // silent — will still reset timer
    }
  };

  const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      {/* Left branding panel (desktop only) */}
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shield" size={24} />
            </div>
            <span style={{ fontSize: 'var(--fs-xl)', fontWeight: 800 }}>CareLoop</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.3, marginBottom: 'var(--space-4)' }}>
            Secure Verification
          </h1>
          <p style={{ opacity: 0.85, lineHeight: 1.7, maxWidth: '24rem' }}>
            We&apos;ve sent a 6-digit verification code to your registered phone number.
            This ensures only authorized users can access your medical records.
          </p>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="auth-trust-item">
              <Icon name="shield" size={18} />
              <span>256-bit encrypted verification</span>
            </div>
            <div className="auth-trust-item">
              <Icon name="clock" size={18} />
              <span>Code expires in 10 minutes</span>
            </div>
            <div className="auth-trust-item">
              <Icon name="checkCircle" size={18} />
              <span>HIPAA compliant authentication</span>
            </div>
          </div>
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

          {verified ? (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'var(--color-success-bg)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-5)',
                  animation: 'fadeInScale 0.4s ease',
                }}
              >
                <Icon name="checkCircle" size={40} style={{ color: 'var(--color-success-solid)' }} />
              </div>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>Verified Successfully!</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>Redirecting to your dashboard…</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                    padding: 'var(--space-1) var(--space-3)',
                    borderRadius: 'var(--radius-pill)', fontSize: 'var(--fs-xs)',
                    fontWeight: 700, background: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)', marginBottom: 'var(--space-4)',
                  }}
                >
                  <Icon name="shield" size={14} />
                  <span>Two-Factor Authentication</span>
                </div>
                <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-2)' }}>
                  Enter Verification Code
                </h1>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  We sent a 6-digit code to <strong>{maskedPhone}</strong>
                </p>
              </div>

              {/* OTP Input Boxes */}
              <div className="otp-input-group" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`otp-box ${digit ? 'otp-box--filled' : ''} ${error ? 'otp-box--error' : ''}`}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-danger)', fontSize: 'var(--fs-sm)', marginTop: 'var(--space-3)', fontWeight: 600 }}>
                  <Icon name="alert" size={16} />
                  <span>{error}</span>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onClick={handleVerify}
                style={{ marginTop: 'var(--space-5)' }}
              >
                Verify & Continue
              </Button>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-5)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
                {resendTimer > 0 ? (
                  <span>Resend code in <strong>{resendTimer}s</strong></span>
                ) : (
                  <button
                    onClick={handleResend}
                    style={{
                      background: 'none', border: 'none', color: 'var(--color-primary)',
                      fontWeight: 700, cursor: 'pointer', textDecoration: 'underline',
                      fontSize: 'inherit', fontFamily: 'inherit',
                    }}
                  >
                    Resend verification code
                  </button>
                )}
              </div>

              {/* Demo hint */}
              <div
                style={{
                  marginTop: 'var(--space-6)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-sm)',
                  background: '#fefce8',
                  border: '1px solid #fde68a',
                  fontSize: 'var(--fs-xs)',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-2)',
                }}
              >
                <Icon name="info" size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>Demo Mode:</strong> Use code <strong style={{ letterSpacing: '2px' }}>123456</strong> to verify.
                  In production, this would be sent via SMS.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
