// All user-facing strings live here. Flat keys so translators can work line by line.
// Use {name} placeholders for variables: t('key', { name: 'Asha' }).
const en = {
  'app.name': 'CareLoop',

  // Common
  'common.required': 'required',
  'common.optional': 'optional',
  'common.loading': 'Loading…',
  'common.close': 'Close',
  'common.dismiss': 'Dismiss',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.back': 'Back',
  'common.retry': 'Try again',
  'common.showPassword': 'Show',
  'common.hidePassword': 'Hide',

  // Accessibility
  'a11y.progress': '{percent} percent',

  // Dose status. "missed" is deliberately worded "Not confirmed":
  // it must never imply the patient did not take the medicine.
  'status.pending': 'Pending',
  'status.taken': 'Taken',
  'status.snoozed': 'Snoozed',
  'status.missed': 'Not confirmed',
  'status.skipped': 'Skipped',

  // Navigation
  'nav.main': 'Main navigation',
  'nav.patient.home': 'Home',
  'nav.patient.scan': 'Scan',
  'nav.patient.medicines': 'Medicines',
  'nav.caregiver.dashboard': 'Dashboard',
  'nav.caregiver.alerts': 'Alerts',
  'nav.caregiver.activity': 'Activity',

  // Honesty banner: shown whenever mock reader data is displayed
  'demo.banner': 'Demo data - AI not connected yet',
};

export default en;
