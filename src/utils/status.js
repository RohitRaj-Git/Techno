export const DOSE_STATUS = {
  PENDING: 'pending',
  TAKEN: 'taken',
  SNOOZED: 'snoozed',
  MISSED: 'missed', // always displayed as "Not confirmed"
  SKIPPED: 'skipped',
};

// icon + label together so status is never conveyed by color alone
export const STATUS_META = {
  pending: { icon: 'clock', labelKey: 'status.pending' },
  taken: { icon: 'check', labelKey: 'status.taken' },
  snoozed: { icon: 'moon', labelKey: 'status.snoozed' },
  missed: { icon: 'help', labelKey: 'status.missed' },
  skipped: { icon: 'skip', labelKey: 'status.skipped' },
};

export const ALLOWED_TRANSITIONS = {
  pending: ['taken', 'snoozed', 'skipped', 'missed'],
  snoozed: ['taken', 'snoozed', 'skipped', 'missed'],
  missed: ['taken'], // can still be confirmed late, which resolves the alert
  taken: [],
  skipped: ['taken'], // correction of a mistaken skip
};

export function normalizeStatus(status) {
  return STATUS_META[status] ? status : 'pending';
}

export function getStatusMeta(status) {
  return STATUS_META[normalizeStatus(status)];
}

export function canTransition(from, to) {
  return (ALLOWED_TRANSITIONS[from] || []).includes(to);
}

export function isResolved(status) {
  return status === 'taken' || status === 'skipped';
}
