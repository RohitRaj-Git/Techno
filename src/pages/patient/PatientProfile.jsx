import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import Icon from '../../components/Icon';
import { getLocale, setLocale } from '../../i18n';
import { loadStore, saveStore, updateLanguage, switchRole } from '../../utils/mockStore';
import { logout } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';

export default function PatientProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [store] = useState(loadStore());
  const [copied, setCopied] = useState(false);

  const patient = store.patient;
  const locale = getLocale();
  const isHi = locale === 'hi';

  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState(patient.age);
  const [phone, setPhone] = useState(patient.phone);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...store,
      patient: {
        ...store.patient,
        name,
        age: Number(age),
        phone,
      },
    };
    saveStore(updated);
    toast.success('Profile details updated successfully!');
  };

  const handleCopyLinkCode = () => {
    navigator.clipboard?.writeText(patient.linkCode || 'CARE-7892');
    setCopied(true);
    toast.success('Link code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLanguageChange = (newLang) => {
    setLocale(newLang);
    updateLanguage(newLang);
    toast.info(newLang === 'hi' ? 'भाषा बदलकर हिंदी कर दी गई है' : 'Language switched to English');
  };

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)', maxWidth: '42rem' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)' }}>
          {isHi ? 'मरीज प्रोफ़ाइल एवं सेटिंग्स' : 'Patient Profile & Settings'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Manage your personal details, language preferences, and family link
        </p>
      </div>

      {/* GUARDIAN LINK CODE BANNER */}
      <Card tone="highlight" title="Your Family Linking Code">
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
            Share this code with your son, daughter, or caregiver so they can monitor your adherence remotely.
          </p>

          <div className="row" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
            <div
              style={{
                fontSize: 'var(--fs-2xl)',
                fontWeight: 800,
                letterSpacing: '2px',
                background: 'var(--color-surface)',
                border: '2px dashed var(--color-primary)',
                padding: 'var(--space-2) var(--space-5)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-primary)',
              }}
            >
              {patient.linkCode || 'CARE-7892'}
            </div>

            <Button
              variant="secondary"
              size="md"
              icon={copied ? 'check' : 'plus'}
              onClick={handleCopyLinkCode}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
        </div>
      </Card>

      {/* CONNECTED GUARDIAN DETAILS */}
      <Card title="Connected Guardian Details">
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <div className="row" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
            <div className="feature-icon-wrapper" style={{ width: '48px', height: '48px', background: '#f3e8ff', color: '#581c87' }}>
              <Icon name="users" size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--fs-lg)' }}>{patient.guardian?.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Relationship: <strong>{patient.guardian?.relationship}</strong> • Phone: {patient.guardian?.phone}
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#dcfce7',
              color: '#166534',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <Icon name="telegram" size={18} />
            <span>
              Telegram Notifications Active: <strong>{patient.guardian?.telegramHandle}</strong>
            </span>
          </div>
        </div>
      </Card>

      {/* PROFILE DETAILS FORM */}
      <Card title="Personal Details">
        <form onSubmit={handleSaveProfile} className="stack" style={{ gap: 'var(--space-4)' }}>
          <FormField
            label="Full Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-3)' }}>
            <FormField
              label="Age"
              name="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <FormField
              label="Phone Number"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="stack" style={{ gap: 'var(--space-2)' }}>
            <label style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>
              Spoken Voice Guidance Language
            </label>
            <div className="row" style={{ gap: 'var(--space-3)' }}>
              <Button
                variant={locale === 'hi' ? 'primary' : 'secondary'}
                size="md"
                onClick={() => handleLanguageChange('hi')}
              >
                हिंदी (Hindi)
              </Button>
              <Button
                variant={locale === 'en' ? 'primary' : 'secondary'}
                size="md"
                onClick={() => handleLanguageChange('en')}
              >
                English
              </Button>
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* QUICK SWITCH OR LOGOUT */}
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Button
          variant="secondary"
          onClick={() => {
            switchRole('guardian');
            navigate('/guardian/dashboard');
          }}
        >
          Switch to Guardian View
        </Button>

        <Button
          variant="ghost"
          icon="logout"
          onClick={() => {
            logout();
            toast.success('Signed out successfully');
            navigate('/login');
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
