import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Banner from '../../components/Banner';
import Icon from '../../components/Icon';
import FormField from '../../components/FormField';
import Modal from '../../components/Modal';
import { loadStore, subscribeStore, simulateMissedDoseAlert, markDoseStatus } from '../../utils/mockStore';
import { useToast } from '../../context/ToastContext';

const PRESETS = [
  { med: 'Amlodipine 5 mg', time: '8:00 PM', label: 'Evening BP Dose (>30m late)' },
  { med: 'Metformin 500 mg', time: '8:00 AM', label: 'Morning Diabetes (45m late)' },
  { med: 'Telmisartan 40 mg', time: '8:00 AM', label: 'Morning Antihypertensive (Overdue)' },
];

export default function TelegramSimulation() {
  const toast = useToast();
  const [store, setStore] = useState(loadStore());
  const [customMed, setCustomMed] = useState('Amlodipine 5 mg');
  const [customTime, setCustomTime] = useState('8:00 PM');
  const [pingEffect, setPingEffect] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  // Live Telegram Bot settings
  const [botToken, setBotToken] = useState(localStorage.getItem('careloop_tg_token') || '');
  const [chatId, setChatId] = useState(localStorage.getItem('careloop_tg_chat_id') || '');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const unsub = subscribeStore(setStore);
    return unsub;
  }, []);

  const guardian = store.guardian;
  const patient = store.patient;
  const alerts = store.alerts;
  const telegramStatus = store.telegramStatus;

  const handleSimulate = async () => {
    simulateMissedDoseAlert(customMed, customTime);
    setPingEffect(true);
    setTimeout(() => setPingEffect(false), 1500);

    const alertMessage = `${patient.nickname || patient.name} has not confirmed his ${customTime} dose (${customMed}). Please check on him.`;

    try {
      const res = await fetch('/api/telegram/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: alertMessage,
          chatId: chatId || undefined,
          botToken: botToken || undefined,
        }),
      });
      const data = await res.json();
      if (data.liveDispatched) {
        toast.success(`Live Telegram alert sent to Chat ID ${data.deliveredTo}!`);
        setDispatchStatus({
          type: 'success',
          text: `✓ Live Telegram alert sent directly to Chat ID ${data.deliveredTo}!`,
        });
      } else {
        toast.info('Simulated alert dispatched to Telegram feed preview.');
        setDispatchStatus({
          type: 'info',
          text: `Simulated alert logged. To receive live push notifications on your phone, configure your Bot Token in "Live Bot Setup".`,
        });
      }
    } catch {
      toast.info('Alert logged locally in simulation mode.');
      setDispatchStatus({
        type: 'info',
        text: 'Alert logged locally in simulation mode.',
      });
    }

    setTimeout(() => setDispatchStatus(null), 6000);
  };

  const handleTestConnection = async () => {
    if (!botToken.trim()) {
      setTestResult({ success: false, error: 'Please enter a Bot Token first.' });
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/telegram/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: botToken.trim(),
          chatId: chatId.trim() || undefined,
        }),
      });
      const data = await res.json();
      setTestResult(data);
      if (data.success && data.chatVerified) {
        toast.success('Live connection confirmed! Test message sent to your Telegram.');
      } else if (data.success && data.botVerified) {
        toast.info(`Bot verified as ${data.botName}. Add Chat ID to test message delivery.`);
      } else {
        toast.error(data.error || 'Connection failed.');
      }
    } catch {
      setTestResult({ success: false, error: 'Could not connect to backend test service.' });
      toast.error('Connection test failed.');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveConfig = () => {
    localStorage.setItem('careloop_tg_token', botToken.trim());
    localStorage.setItem('careloop_tg_chat_id', chatId.trim());
    setIsConfigModalOpen(false);
    toast.success('Telegram Bot credentials saved successfully!');
  };

  const handleResolveAlert = (alertId, medicineName) => {
    // Find matching dose and mark taken
    const dose = store.doses.find(
      (d) => medicineName && d.name.toLowerCase().includes(medicineName.toLowerCase().split(' ')[0])
    );
    if (dose) {
      markDoseStatus(dose.id, 'taken');
    }
    toast.success('Dose confirmed as taken! Alert resolved.');
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'active') return a.status !== 'resolved';
    if (filter === 'resolved') return a.status === 'resolved';
    return true;
  });

  return (
    <div className="page stack" style={{ '--stack-gap': 'var(--space-6)', maxWidth: '52rem' }}>
      <div>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 'var(--fs-2xl)' }}>Telegram Notification Center</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
              Real-time automated alerts for unconfirmed family medication doses.
            </p>
          </div>
          <Button
            variant="secondary"
            size="md"
            icon="settings"
            onClick={() => {
              setTestResult(null);
              setIsConfigModalOpen(true);
            }}
          >
            Live Bot Setup
          </Button>
        </div>
      </div>

      {dispatchStatus && (
        <Banner variant={dispatchStatus.type}>
          {dispatchStatus.text}
        </Banner>
      )}

      {/* TELEGRAM CONNECTION STATUS & TRIGGER PANEL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
        {/* CONNECTION STATUS */}
        <Card title="Bot Connection Status">
          <div className="stack" style={{ gap: 'var(--space-3)' }}>
            <div className="row" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                }}
              >
                <Icon name="telegram" size={26} />
              </div>
              <div>
                <strong style={{ fontSize: 'var(--fs-lg)' }}>
                  {botToken ? (testResult?.botName || '@CareLoopAlertBot') : telegramStatus.botName}
                </strong>
                <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px #16a34a' }} />
                  {botToken && chatId ? `Live Connected (Chat ID: ${chatId})` : `Connected to ${guardian.telegramHandle}`}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--color-surface-alt)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Monitored Patient:</span>
                <strong>{patient.name} ({patient.nickname})</strong>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Trigger Threshold:</span>
                <strong>&gt; 30 min overdue</strong>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Delivery Target:</span>
                <strong>{guardian.phone}</strong>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Mode:</span>
                <span style={{ fontWeight: 700, color: botToken && chatId ? '#059669' : '#0284c7' }}>
                  {botToken && chatId ? '● Live Push Mode' : '● Simulation + Local Log'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* SIMULATE MISSED DOSE TRIGGER */}
        <Card tone="highlight" title="Trigger Medication Alert">
          <div className="stack" style={{ gap: 'var(--space-3)' }}>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
              Choose a quick scenario or customize the medicine and time:
            </p>

            {/* Quick Scenario Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
              {PRESETS.map((p) => (
                <button
                  key={p.med}
                  type="button"
                  onClick={() => {
                    setCustomMed(p.med);
                    setCustomTime(p.time);
                  }}
                  style={{
                    fontSize: 'var(--fs-xs)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)',
                    background: customMed === p.med ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                    color: customMed === p.med ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: customMed === p.med ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-2)' }}>
              <FormField
                label="Medicine"
                name="customMed"
                value={customMed}
                onChange={(e) => setCustomMed(e.target.value)}
              />
              <FormField
                label="Time"
                name="customTime"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </div>

            <Button
              variant="danger"
              size="lg"
              icon="send"
              fullWidth
              onClick={handleSimulate}
              style={{
                boxShadow: pingEffect ? '0 0 0 6px rgba(225, 29, 72, 0.4)' : 'none',
                transition: 'all 0.3s',
              }}
            >
              Dispatch Missed Dose Alert
            </Button>
          </div>
        </Card>
      </div>

      {/* TELEGRAM CLIENT MOCK PREVIEW */}
      <div className="stack" style={{ gap: 'var(--space-3)', alignItems: 'center' }}>
        <h2 style={{ fontSize: 'var(--fs-xl)' }}>Live Telegram Feed Preview</h2>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Real-time preview of Guardian phone screen receiving CareLoop automated bot dispatch:
        </p>

        <div className="telegram-card" style={{ width: '100%', maxWidth: '460px' }}>
          {/* TELEGRAM APP HEADER */}
          <div className="tg-header">
            <div className="tg-bot-avatar">CL</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>CareLoop Bot</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>bot • automated medication guardian</div>
            </div>
            <Icon name="bell" size={20} />
          </div>

          {/* TELEGRAM CHAT BODY */}
          <div className="tg-body" style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {/* INITIAL WELCOME MESSAGE */}
            <div className="tg-bubble">
              <div>
                <strong>CareLoop Bot</strong>
              </div>
              <div>
                👋 Family alert channel connected for <strong>{patient.name}</strong>. If any scheduled dose remains unconfirmed 30 minutes after time, you will receive an alert here with direct action buttons.
              </div>
              <div className="tg-time">10:00 AM ✓✓</div>
            </div>

            {/* DYNAMIC MISSED DOSE ALERTS */}
            {alerts
              .filter((a) => a.type === 'missed_dose')
              .map((alert) => (
                <div key={alert.id} className="tg-bubble tg-bubble--alert">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b91c1c', fontWeight: 800 }}>
                    <Icon name="alert" size={16} />
                    <span>⚠️ Unconfirmed Dose Alert</span>
                  </div>
                  <div style={{ marginTop: '4px', fontWeight: 600 }}>
                    {alert.message}
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#475569' }}>
                    Status: {alert.status === 'resolved' ? '✓ Resolved late by Papa' : '❗ Action advised: Call Papa'}
                  </div>

                  {/* Interactive Action Buttons inside telegram preview */}
                  {alert.status !== 'resolved' && (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                      <button
                        type="button"
                        onClick={() => handleResolveAlert(alert.id, alert.medicineName)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          background: '#059669',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Mark Dose Taken
                      </button>
                      <a
                        href={`tel:${patient.phone}`}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: 'var(--color-navy)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Icon name="phone" size={12} />
                        <span>Call</span>
                      </a>
                    </div>
                  )}

                  <div className="tg-time">{alert.timestamp} ✓✓</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ALERT LOG HISTORY */}
      <Card title="Alert History & Dispatch Log">
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          {/* Filter Pills */}
          <div className="row" style={{ gap: 'var(--space-2)' }}>
            {['all', 'active', 'resolved'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-border)',
                  background: filter === f ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: filter === f ? '#ffffff' : 'var(--color-text-muted)',
                  fontSize: 'var(--fs-xs)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {f} ({alerts.filter((a) => (f === 'active' ? a.status !== 'resolved' : f === 'resolved' ? a.status === 'resolved' : true)).length})
              </button>
            ))}
          </div>

          {filteredAlerts.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', padding: 'var(--space-4) 0', textAlign: 'center' }}>
              No alerts match the selected filter.
            </p>
          ) : (
            filteredAlerts.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  fontSize: 'var(--fs-sm)',
                }}
              >
                <div className="stack" style={{ gap: '2px' }}>
                  <strong>{item.message}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Dispatched to: {guardian.name} ({guardian.telegramHandle}) • {item.timestamp}
                  </div>
                </div>

                <div className="row" style={{ gap: 'var(--space-2)', alignItems: 'center' }}>
                  {item.status !== 'resolved' && item.type === 'missed_dose' && (
                    <button
                      type="button"
                      onClick={() => handleResolveAlert(item.id, item.medicineName)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid #bbf7d0',
                        background: '#f0fdf4',
                        color: '#166534',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Resolve
                    </button>
                  )}
                  <span
                    style={{
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: item.status === 'resolved' ? '#dcfce7' : '#fee2e2',
                      color: item.status === 'resolved' ? '#15803d' : '#b91c1c',
                    }}
                  >
                    {item.status === 'resolved' ? 'Resolved' : 'Active Alert'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* LIVE TELEGRAM BOT CONFIGURATION MODAL */}
      <Modal
        open={isConfigModalOpen}
        title="Live Telegram Bot Configuration"
        onClose={() => setIsConfigModalOpen(false)}
        footer={
          <div className="row" style={{ justifyContent: 'space-between', width: '100%' }}>
            <Button
              variant="secondary"
              size="md"
              loading={testingConnection}
              onClick={handleTestConnection}
              icon="send"
            >
              Test Connection
            </Button>
            <div className="row" style={{ gap: 'var(--space-2)' }}>
              <Button variant="ghost" onClick={() => setIsConfigModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveConfig}>
                Save Credentials
              </Button>
            </div>
          </div>
        }
      >
        <div className="stack" style={{ gap: 'var(--space-3)' }}>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
            Connect a live Telegram bot to receive real push alerts directly on your smartphone whenever a medication dose is delayed:
          </p>

          {/* Setup Guide Cards */}
          <div
            style={{
              background: 'var(--color-surface-alt)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--fs-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <strong>Quick Setup Instructions:</strong>
            <div>1. Open Telegram and message <strong>@BotFather</strong></div>
            <div>2. Send <code>/newbot</code>, choose a name, and copy the <strong>HTTP API Token</strong></div>
            <div>3. Message <strong>@userinfobot</strong> or <strong>@getidsbot</strong> to find your numeric <strong>Chat ID</strong></div>
            <div>4. Paste both below and click <strong>Test Connection</strong> to receive a live verification ping!</div>
          </div>

          {testResult && (
            <Banner variant={testResult.success ? 'success' : 'error'}>
              {testResult.message || testResult.error}
            </Banner>
          )}

          <FormField
            label="Telegram Bot Token"
            name="botToken"
            value={botToken}
            onChange={(e) => {
              setBotToken(e.target.value);
              setTestResult(null);
            }}
            hint="Format: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
          />

          <FormField
            label="Your Telegram Chat ID"
            name="chatId"
            value={chatId}
            onChange={(e) => {
              setChatId(e.target.value);
              setTestResult(null);
            }}
            hint="Your personal numeric Telegram user/chat ID (e.g. 984102931)"
          />
        </div>
      </Modal>
    </div>
  );
}
