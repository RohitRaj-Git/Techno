import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import FormField from '../components/FormField';
import Icon from '../components/Icon';
import { switchRole, loadStore, saveStore } from '../utils/mockStore';

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'guardian' ? 'guardian' : 'patient';

  const [role, setRole] = useState(defaultRole);

  // Patient fields
  const [patientName, setPatientName] = useState('Ram Prasad Asija');
  const [patientAge, setPatientAge] = useState('68');
  const [patientPhone, setPatientPhone] = useState('+91 98765 43210');
  const [preferredLang, setPreferredLang] = useState('hi');

  // Guardian fields
  const [guardianName, setGuardianName] = useState('Aman Asija');
  const [guardianPhone, setGuardianPhone] = useState('+91 98111 22334');
  const [relationship, setRelationship] = useState('Child');
  const [linkCode, setLinkCode] = useState('CARE-7892');

  const [password, setPassword] = useState('careloop123');
  const [confirmPassword, setConfirmPassword] = useState('careloop123');
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'patient') {
      if (!patientName.trim() || !patientAge || !patientPhone.trim() || !password) {
        setError('Please fill in all required fields.');
        return;
      }
    } else {
      if (!guardianName.trim() || !guardianPhone.trim() || !password) {
        setError('Please fill in all required fields.');
        return;
      }
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agree) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    try {
      const phone = role === 'patient' ? patientPhone.trim() : guardianPhone.trim();
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: role === 'patient' ? patientName : guardianName,
          phone,
          password,
          age: role === 'patient' ? Number(patientAge) : undefined,
          preferredLang: role === 'patient' ? preferredLang : undefined,
          relationship: role === 'guardian' ? relationship : undefined,
          linkCode: role === 'guardian' ? linkCode : undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        // Update local store
        const store = loadStore();
        if (role === 'patient') {
          store.patient = { ...store.patient, name: patientName, age: Number(patientAge), phone: patientPhone, preferredLanguage: preferredLang };
          store.currentUser = store.patient;
        } else {
          store.guardian = { ...store.guardian, name: guardianName, phone: guardianPhone, relationship };
          store.currentUser = store.guardian;
        }
        saveStore(store);
        switchRole(role);

        // Send OTP
        await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        });

        navigate('/verify', {
          state: {
            phone,
            role,
            name: role === 'patient' ? patientName : guardianName,
            userId: data.user?.id || (role === 'patient' ? 'p_101' : 'g_201'),
          },
        });
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      // Fallback
      const store = loadStore();
      if (role === 'patient') {
        store.patient = { ...store.patient, name: patientName, age: Number(patientAge), phone: patientPhone, preferredLanguage: preferredLang };
        store.currentUser = store.patient;
      } else {
        store.guardian = { ...store.guardian, name: guardianName, phone: guardianPhone, relationship };
        store.currentUser = store.guardian;
      }
      saveStore(store);
      switchRole(role);

      navigate('/verify', {
        state: {
          phone: role === 'patient' ? patientPhone.trim() : guardianPhone.trim(),
          role,
          name: role === 'patient' ? patientName : guardianName,
          userId: role === 'patient' ? 'p_101' : 'g_201',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      {/* ─── Left branding panel ─── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={24} />
            </div>
            <span style={{ fontSize: 'var(--fs-xl)', fontWeight: 800 }}>CareLoop</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.3, marginBottom: 'var(--space-4)' }}>
            Join the CareLoop<br />Health Network
          </h1>
          <p style={{ opacity: 0.85, lineHeight: 1.7, maxWidth: '24rem' }}>
            Create your account in under 2 minutes. Connect with your family,
            scan prescriptions with AI, and never miss a dose again.
          </p>

          <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="auth-trust-item">
              <Icon name="checkCircle" size={18} />
              <span>Free for patients & families</span>
            </div>
            <div className="auth-trust-item">
              <Icon name="shield" size={18} />
              <span>No credit card required</span>
            </div>
            <div className="auth-trust-item">
              <Icon name="users" size={18} />
              <span>Link guardian in one step</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right form panel ─── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner" style={{ maxWidth: '28rem' }}>
          {/* Mobile logo */}
          <div className="auth-mobile-logo">
            <Icon name="heart" size={28} style={{ color: 'var(--color-primary)' }} />
            <span>CareLoop</span>
          </div>

          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-pill)', fontSize: 'var(--fs-xs)',
                fontWeight: 700, background: '#ecfdf5', color: '#059669',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Icon name="plus" size={14} />
              <span>New Registration</span>
            </div>
            <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-2)' }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Select your role and fill in the details below
            </p>
          </div>

          {/* Role toggle */}
          <div className="auth-role-toggle">
            <button
              type="button"
              onClick={() => { setRole('patient'); setError(''); }}
              className={`auth-role-btn ${role === 'patient' ? 'auth-role-btn--active' : ''}`}
            >
              <Icon name="user" size={16} />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('guardian'); setError(''); }}
              className={`auth-role-btn ${role === 'guardian' ? 'auth-role-btn--active auth-role-btn--guardian' : ''}`}
            >
              <Icon name="users" size={16} />
              <span>Guardian</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', fontSize: 'var(--fs-sm)', fontWeight: 600 }}>
                <Icon name="alert" size={16} />
                <span>{error}</span>
              </div>
            )}

            {role === 'patient' ? (
              <>
                <FormField label="Full Name" name="patientName" required value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-3)' }}>
                  <FormField label="Age" name="age" type="number" required value={patientAge} onChange={(e) => setPatientAge(e.target.value)} />
                  <FormField label="Phone Number" name="patientPhone" type="tel" required value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} />
                </div>
                <FormField
                  label="Preferred Language"
                  name="preferredLang"
                  as="select"
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  options={[
                    { value: 'hi', label: 'Hindi (हिंदी)' },
                    { value: 'en', label: 'English' },
                  ]}
                />
              </>
            ) : (
              <>
                <FormField label="Guardian Full Name" name="guardianName" required value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <FormField label="Phone Number" name="guardianPhone" type="tel" required value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
                  <FormField
                    label="Relationship"
                    name="relationship"
                    as="select"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    options={[
                      { value: 'Child', label: 'Child (Son/Daughter)' },
                      { value: 'Spouse', label: 'Spouse' },
                      { value: 'Parent', label: 'Parent' },
                      { value: 'Other', label: 'Caregiver / Other' },
                    ]}
                  />
                </div>
                <FormField label="Patient Link Code" name="linkCode" value={linkCode} onChange={(e) => setLinkCode(e.target.value)} hint="Ask the patient for their code (demo: CARE-7892)" />
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <FormField label="Password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <FormField label="Confirm Password" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            {/* Terms checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', marginTop: 2 }}
              />
              <span>
                I agree to the <a href="#" style={{ textDecoration: 'underline', fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ textDecoration: 'underline', fontWeight: 600 }}>Privacy Policy</a>
              </span>
            </label>

            <Button
              type="submit"
              variant={role === 'guardian' ? 'secondary' : 'primary'}
              size="lg"
              fullWidth
              loading={loading}
              icon="arrowRight"
            >
              Create Account
            </Button>
          </form>

          <div className="auth-divider">
            <span>Already registered?</span>
          </div>

          <Button
            variant="ghost"
            fullWidth
            to={`/login?role=${role}`}
            icon="arrowRight"
            style={{ border: '1px solid var(--color-border)' }}
          >
            Sign In Instead
          </Button>
        </div>
      </div>
    </div>
  );
}
