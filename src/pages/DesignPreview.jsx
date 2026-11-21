import { useState } from 'react';
import Banner from '../components/Banner';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import FormField from '../components/FormField';
import Modal from '../components/Modal';
import ProgressRing from '../components/ProgressRing';
import Sidebar from '../components/Sidebar';
import Spinner from '../components/Spinner';
import StatusChip from '../components/StatusChip';
import { t } from '../i18n';
import { DOSE_STATUS } from '../utils/status';

// TEMPORARY: hard-coded strings are fine here because this file is deleted in Stage 2.

const patientNav = [
  { to: '/', icon: 'home', labelKey: 'nav.patient.home', end: true },
  { to: '/patient/scan', icon: 'camera', labelKey: 'nav.patient.scan' },
  { to: '/patient/medicines', icon: 'pill', labelKey: 'nav.patient.medicines' },
];

const caregiverNav = [
  { to: '/', icon: 'home', labelKey: 'nav.caregiver.dashboard', end: true },
  { to: '/caregiver/alerts', icon: 'alert', labelKey: 'nav.caregiver.alerts' },
  { to: '/caregiver/activity', icon: 'activity', labelKey: 'nav.caregiver.activity' },
];

export default function DesignPreview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(72);
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);

  function fakeLoad() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <>
      <Sidebar items={caregiverNav} />

      <main className="has-bottom-nav has-bottom-nav--mobile-only has-sidebar">
        <div className="page stack" style={{ '--stack-gap': 'var(--space-6)' }}>
          <h1>CareLoop design system</h1>

          <Banner variant="demo">{t('demo.banner')}</Banner>
          {bannerVisible && (
            <Banner variant="info" title="Dismissible banner" onDismiss={() => setBannerVisible(false)}>
              Tap the X to dismiss.
            </Banner>
          )}
          <Banner variant="success" title="Success">Medicine added to your schedule.</Banner>
          <Banner variant="warning" title="Please check">Some details need your review.</Banner>
          <Banner variant="error" title="Could not read the photo">Try a clearer picture.</Banner>

          <Card title="Status chips">
            <div className="row">
              {Object.values(DOSE_STATUS).map((status) => (
                <StatusChip key={status} status={status} />
              ))}
            </div>
          </Card>

          <Card tone="highlight" title="Next medicine">
            <div className="stack">
              <p>Metformin 500 mg at 8:00 AM</p>
              <Button variant="success" size="lg" icon="check" fullWidth>Taken</Button>
              <Button variant="secondary" size="lg" icon="moon" fullWidth>Snooze</Button>
              <Button variant="ghost" size="lg" icon="skip" fullWidth>Skip</Button>
            </div>
          </Card>

          <Card title="Buttons">
            <div className="row">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger" icon="trash">Delete</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
              <Button loading={loading} onClick={fakeLoad}>Load 2s</Button>
              <Button href="tel:+910000000000" icon="phone">Call</Button>
            </div>
          </Card>

          <Card title="Progress ring">
            <div className="row" style={{ '--row-gap': 'var(--space-6)' }}>
              <ProgressRing percent={percent} caption="adherence" />
              <FormField label="Ring value" name="ring">
                {({ id }) => (
                  <input
                    id={id}
                    type="range"
                    min="0"
                    max="100"
                    value={percent}
                    onChange={(event) => setPercent(Number(event.target.value))}
                  />
                )}
              </FormField>
            </div>
          </Card>

          <Card title="Form fields">
            <div className="stack">
              <FormField
                label="Full name"
                name="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setTouched(true)}
                error={touched && !name.trim() ? 'Please enter your name.' : undefined}
                hint="As it appears on your prescription."
                autoComplete="name"
              />
              <FormField label="Password" name="password" type="password" required autoComplete="new-password" />
              <FormField
                label="Frequency"
                name="frequency"
                as="select"
                options={[
                  { value: 'once', label: 'Once a day' },
                  { value: 'twice', label: 'Twice a day' },
                ]}
              />
              <FormField label="Notes" name="notes" as="textarea" optional />
            </div>
          </Card>

          <Card tone="warning" title="Warning card">
            <p>Check this medicine name before adding it.</p>
          </Card>

          <Card title="Empty state and spinner">
            <EmptyState
              icon="pill"
              title="No medicines yet"
              description="Scan a prescription to get started."
              action={<Button icon="camera">Scan prescription</Button>}
            />
            <Spinner showLabel />
          </Card>

          <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
        </div>
      </main>

      <Modal
        open={modalOpen}
        title="Delete this medicine?"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="danger" icon="trash" onClick={() => setModalOpen(false)}>Delete</Button>
          </>
        }
      >
        <p>This removes it from your schedule.</p>
      </Modal>

      <BottomNav items={patientNav} hideOnDesktop />
    </>
  );
}
