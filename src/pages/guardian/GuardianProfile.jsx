import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import FormField from '../../components/FormField';
import { loadStore, saveStore, switchRole } from '../../utils/mockStore';
import { logout } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';

export default function GuardianProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [store] = useState(loadStore());

  const guardian = store.guardian;
  const [name, setName] = useState(guardian.name);
  const [phone, setPhone] = useState(guardian.phone);
  const [telegramHandle, setTelegramHandle] = useState(guardian.telegramHandle || '@aman_asija');
  const [threshold, setThreshold] = useState('30');

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...store,
      guardian: {
        ...store.guardian,
        name,
        phone,
        telegramHandle,
      },
    };
    saveStore(updated);
    toast.success('Guardian notification preferences updated!');
  };

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)', maxWidth: '42rem' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-2xl)' }}>Guardian Settings</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Manage your notification channels, Telegram link, and alert thresholds
        </p>
      </div>

      <Card title="Guardian Account Information">
        <form onSubmit={handleSave} className="stack" style={{ gap: 'var(--space-4)' }}>
          <FormField
            label="Full Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormField
            label="Phone Number"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <FormField
            label="Telegram Username / Handle"
            name="telegramHandle"
            value={telegramHandle}
            onChange={(e) => setTelegramHandle(e.target.value)}
            hint="Format: @username (receives unconfirmed dose alerts)"
          />

          <FormField
            label="Missed-Dose Delay Threshold"
            name="threshold"
            as="select"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            options={[
              { value: '15', label: '15 minutes past scheduled time' },
              { value: '30', label: '30 minutes past scheduled time (Recommended)' },
              { value: '45', label: '45 minutes past scheduled time' },
              { value: '60', label: '60 minutes past scheduled time' },
            ]}
          />

          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* QUICK SWITCH & EXIT */}
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Button
          variant="secondary"
          onClick={() => {
            switchRole('patient');
            navigate('/patient/dashboard');
          }}
        >
          Switch to Patient Portal
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
