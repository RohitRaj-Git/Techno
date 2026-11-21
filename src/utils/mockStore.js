/**
 * CareLoop Mock Store & LocalStorage Persistence
 * Provides realistic healthcare data for Patient & Guardian workflows.
 */

const STORAGE_KEY = 'careloop_data_v2';
const EVENT_NAME = 'careloop_store_updated';

export const INITIAL_PATIENT = {
  id: 'p_101',
  name: 'Ram Prasad Asija',
  nickname: 'Papa',
  age: 68,
  phone: '+91 98765 43210',
  preferredLanguage: 'hi',
  role: 'patient',
  linkCode: 'CARE-7892',
  guardian: {
    id: 'g_201',
    name: 'Aman Asija',
    relationship: 'Son',
    phone: '+91 98111 22334',
    telegramHandle: '@aman_asija',
    telegramLinked: true,
  },
};

export const INITIAL_GUARDIAN = {
  id: 'g_201',
  name: 'Aman Asija',
  phone: '+91 98111 22334',
  relationship: 'Son',
  role: 'guardian',
  telegramLinked: true,
  telegramChatId: 'tg_8841920',
  telegramHandle: '@aman_asija',
  patient: {
    id: 'p_101',
    name: 'Ram Prasad Asija',
    nickname: 'Papa',
    age: 68,
    phone: '+91 98765 43210',
    preferredLanguage: 'hi',
    conditionSummary: 'Type 2 Diabetes & Mild Hypertension',
  },
};

export const SAMPLE_EXTRACTED_PRESCRIPTION = {
  id: 'rx_demo_01',
  doctorName: 'Dr. Rajesh Verma (MD, Medicine)',
  clinicName: 'Aarogya Healthcare & Diabetes Centre',
  date: '2026-11-18',
  medicines: [
    {
      id: 'med_1',
      name: 'Metformin Hydrochloride',
      nameHindi: 'मेटफॉर्मिन हाइड्रोक्लोराइड',
      dosage: '500 mg',
      dosageHindi: '५०० मिलीग्राम',
      frequency: 'Twice daily (Morning & Night)',
      frequencyHindi: 'दिन में दो बार (सुबह और रात)',
      scheduledTimes: ['08:00 AM', '08:00 PM'],
      duration: '30 days',
      instructions: 'Take with or immediately after food with plenty of water.',
      instructionsHindi: 'खाने के तुरंत बाद पर्याप्त पानी के साथ लें।',
      confidence: 'high',
      uncertain: false,
    },
    {
      id: 'med_2',
      name: 'Telmisartan Tablets',
      nameHindi: 'टेल्मिसार्टन टैबलेट',
      dosage: '40 mg',
      dosageHindi: '४० मिलीग्राम',
      frequency: 'Once daily (Morning)',
      frequencyHindi: 'दिन में एक बार (सुबह)',
      scheduledTimes: ['08:00 AM'],
      duration: '30 days',
      instructions: 'For blood pressure. Take consistently every morning.',
      instructionsHindi: 'ब्लड प्रेशर के लिए। हर सुबह एक ही समय पर लें।',
      confidence: 'high',
      uncertain: false,
    },
    {
      id: 'med_3',
      name: 'Amlodipine Besylate',
      nameHindi: 'एम्लोडिपिन बेसाइलेट',
      dosage: '5 mg',
      dosageHindi: '५ मिलीग्राम',
      frequency: 'Once daily (Evening)',
      frequencyHindi: 'दिन में एक बार (शाम को)',
      scheduledTimes: ['08:00 PM'],
      duration: '30 days',
      instructions: 'Take after dinner. Do not skip without consulting doctor.',
      instructionsHindi: 'रात के खाने के बाद लें। डॉक्टर की सलाह के बिना न छोड़ें।',
      confidence: 'uncertain',
      uncertain: true,
      flagReason: 'Handwriting smudged between 5mg and 10mg. Verified by patient.',
    },
    {
      id: 'med_4',
      name: 'Pantoprazole Gastro-resistant',
      nameHindi: 'पैंटोप्राजोल',
      dosage: '40 mg',
      dosageHindi: '४० मिलीग्राम',
      frequency: 'Once daily (Morning empty stomach)',
      frequencyHindi: 'दिन में एक बार (सुबह खाली पेट)',
      scheduledTimes: ['07:30 AM'],
      duration: '15 days',
      instructions: 'Take 30 minutes before morning tea or breakfast.',
      instructionsHindi: 'सुबह नाश्ते या चाय से आधा घंटा पहले लें।',
      confidence: 'high',
      uncertain: false,
    },
  ],
};

export const INITIAL_TODAY_DOSES = [
  {
    id: 'dose_01',
    medicineId: 'med_4',
    name: 'Pantoprazole',
    nameHindi: 'पैंटोप्राजोल',
    dosage: '40 mg',
    dosageHindi: '४० मि.ग्रा.',
    slot: 'morning',
    scheduledTime: '07:30 AM',
    timeHindi: 'सुबह 7:30 बजे',
    instructions: 'Take 30 minutes before breakfast.',
    instructionsHindi: 'नाश्ते से आधा घंटा पहले खाली पेट लें।',
    status: 'taken',
    takenAt: '07:35 AM',
  },
  {
    id: 'dose_02',
    medicineId: 'med_1',
    name: 'Metformin',
    nameHindi: 'मेटफॉर्मिन',
    dosage: '500 mg',
    dosageHindi: '५०० मि.ग्रा.',
    slot: 'morning',
    scheduledTime: '08:00 AM',
    timeHindi: 'सुबह 8:00 बजे',
    instructions: 'Take immediately after morning breakfast.',
    instructionsHindi: 'सुबह नाश्ते के तुरंत बाद पानी से लें।',
    status: 'taken',
    takenAt: '08:12 AM',
  },
  {
    id: 'dose_03',
    medicineId: 'med_2',
    name: 'Telmisartan',
    nameHindi: 'टेल्मिसार्टन',
    dosage: '40 mg',
    dosageHindi: '४० मि.ग्रा.',
    slot: 'morning',
    scheduledTime: '08:00 AM',
    timeHindi: 'सुबह 8:00 बजे',
    instructions: 'Take with morning medicines for blood pressure.',
    instructionsHindi: 'ब्लड प्रेशर की दवा, सुबह के समय लें।',
    status: 'taken',
    takenAt: '08:15 AM',
  },
  {
    id: 'dose_04',
    medicineId: 'med_1',
    name: 'Metformin',
    nameHindi: 'मेटफॉर्मिन',
    dosage: '500 mg',
    dosageHindi: '५०० मि.ग्रा.',
    slot: 'night',
    scheduledTime: '08:00 PM',
    timeHindi: 'रात 8:00 बजे',
    instructions: 'Take after dinner.',
    instructionsHindi: 'रात के खाने के बाद लें।',
    status: 'pending',
  },
  {
    id: 'dose_05',
    medicineId: 'med_3',
    name: 'Amlodipine',
    nameHindi: 'एम्लोडिपिन',
    dosage: '5 mg',
    dosageHindi: '५ मि.ग्रा.',
    slot: 'night',
    scheduledTime: '08:00 PM',
    timeHindi: 'रात 8:00 बजे',
    instructions: 'Take after dinner. Essential for night BP balance.',
    instructionsHindi: 'रात के खाने के बाद लें। बीपी नियंत्रण हेतु जरूरी।',
    status: 'pending',
  },
];

export const INITIAL_ALERTS = [
  {
    id: 'alt_01',
    type: 'missed_dose',
    patientName: 'Papa (Ram Prasad)',
    medicineName: 'Amlodipine 5 mg',
    scheduledTime: '08:00 PM',
    timestamp: 'Yesterday at 08:35 PM',
    status: 'resolved',
    resolvedAt: '08:42 PM',
    message: 'Papa hasn\'t confirmed his 8 PM dose (Amlodipine 5 mg). Please check on him.',
  },
  {
    id: 'alt_02',
    type: 'link_confirmed',
    patientName: 'Papa (Ram Prasad)',
    timestamp: '3 days ago',
    status: 'read',
    message: 'CareLoop guardian link active. You will receive Telegram alerts if any scheduled dose is delayed past 30 minutes.',
  },
];

export const INITIAL_SAFETY_WARNINGS = [
  {
    id: 'safe_01',
    level: 'precaution',
    title: 'Duplicate Ingredient Safety Check',
    titleHindi: 'समान घटक सुरक्षा जांच',
    description: 'No duplicate chemical compounds detected across active prescriptions.',
    descriptionHindi: 'आपकी सक्रिय दवाओं में कोई दोहराव वाला तत्व नहीं पाया गया।',
    type: 'success',
  },
  {
    id: 'safe_02',
    level: 'information',
    title: 'Dual Antihypertensive Regimen',
    titleHindi: 'रक्तचाप की दोहरी दवा की सूचना',
    description: 'Telmisartan (morning) & Amlodipine (evening) are both prescribed for blood pressure regulation. This combination is standard practice. Never stop or double either tablet without medical consultation.',
    descriptionHindi: 'टेल्मिसार्टन (सुबह) और एम्लोडिपिन (शाम) दोनों बीपी के लिए हैं। डॉक्टर की सलाह के बिना खुराक न बदलें।',
    type: 'info',
  },
  {
    id: 'safe_03',
    level: 'caution',
    title: 'Timing Separation: Antacid vs Meals',
    titleHindi: 'खाली पेट दवा का समय',
    description: 'Pantoprazole 40mg works best when taken at least 30 minutes prior to morning food or warm beverages.',
    descriptionHindi: 'पैंटोप्राजोल को सुबह नाश्ता करने से ३० मिनट पहले ही लें।',
    type: 'warning',
  },
];

export const INITIAL_HISTORY_LOGS = [
  { date: 'Today', total: 5, taken: 3, missed: 0, pending: 2, adherence: 100 },
  { date: 'Yesterday', total: 5, taken: 5, missed: 0, pending: 0, adherence: 100 },
  { date: '2 days ago', total: 5, taken: 4, missed: 1, pending: 0, adherence: 80 },
  { date: '3 days ago', total: 5, taken: 5, missed: 0, pending: 0, adherence: 100 },
  { date: '4 days ago', total: 5, taken: 5, missed: 0, pending: 0, adherence: 100 },
  { date: '5 days ago', total: 5, taken: 4, missed: 1, pending: 0, adherence: 80 },
  { date: '6 days ago', total: 5, taken: 5, missed: 0, pending: 0, adherence: 100 },
];

function getInitialState() {
  return {
    currentUser: INITIAL_PATIENT,
    patient: INITIAL_PATIENT,
    guardian: INITIAL_GUARDIAN,
    doses: INITIAL_TODAY_DOSES,
    prescriptions: [SAMPLE_EXTRACTED_PRESCRIPTION],
    alerts: INITIAL_ALERTS,
    safetyWarnings: INITIAL_SAFETY_WARNINGS,
    history: INITIAL_HISTORY_LOGS,
    telegramStatus: {
      botName: '@CareLoopAlertBot',
      connected: true,
      lastPing: 'Connected and active',
      chatId: '984102931',
    },
    appLanguage: 'en', // 'en' | 'hi'
  };
}

export function loadStore() {
  if (typeof window === 'undefined') return getInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const init = getInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load store, resetting:', err);
    const fallback = getInitialState();
    return fallback;
  }
}

export function saveStore(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }));
  } catch (err) {
    console.error('Failed to save store:', err);
  }
}

export function resetStore() {
  const init = getInitialState();
  saveStore(init);
  return init;
}

export function subscribeStore(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => callback(e.detail);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

// Action helpers
export function switchRole(role) {
  const state = loadStore();
  if (role === 'guardian') {
    state.currentUser = state.guardian;
  } else {
    state.currentUser = state.patient;
  }
  saveStore(state);
  return state;
}

export function updateLanguage(lang) {
  const state = loadStore();
  state.appLanguage = lang;
  if (state.currentUser && state.currentUser.role === 'patient') {
    state.patient.preferredLanguage = lang;
  }
  saveStore(state);
  return state;
}

export function markDoseStatus(doseId, status, extra = {}) {
  const state = loadStore();
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  state.doses = state.doses.map((d) => {
    if (d.id === doseId) {
      const updated = { ...d, status, ...extra };
      if (status === 'taken') {
        updated.takenAt = nowTime;
      }
      return updated;
    }
    return d;
  });

  // If a missed alert was active for this dose, mark it resolved
  if (status === 'taken') {
    state.alerts = state.alerts.map((a) => {
      if (a.medicineName && state.doses.find((d) => d.id === doseId)?.name.includes(a.medicineName.split(' ')[0])) {
        return { ...a, status: 'resolved', resolvedAt: nowTime };
      }
      return a;
    });
  }

  saveStore(state);
  return state;
}

export function simulateMissedDoseAlert(medicineName = 'Amlodipine 5 mg', scheduledTime = '08:00 PM') {
  const state = loadStore();
  const newAlert = {
    id: `alt_${Date.now()}`,
    type: 'missed_dose',
    patientName: 'Papa (Ram Prasad)',
    medicineName,
    scheduledTime,
    timestamp: 'Just now (Simulated >30m overdue)',
    status: 'unconfirmed',
    message: `Papa hasn't confirmed his ${scheduledTime} dose (${medicineName}). Please check on him.`,
  };

  // Also flag the dose as 'missed' in today's doses if present
  state.doses = state.doses.map((d) => {
    if (d.name.toLowerCase().includes('amlodipine') || d.name.toLowerCase().includes(medicineName.toLowerCase().split(' ')[0])) {
      return { ...d, status: 'missed' };
    }
    return d;
  });

  state.alerts = [newAlert, ...state.alerts];
  saveStore(state);
  return newAlert;
}

export function setPendingReviewPrescription(prescription) {
  const state = loadStore();
  state.pendingReviewPrescription = prescription;
  saveStore(state);
  return state;
}

export function getPendingReviewPrescription() {
  const state = loadStore();
  return state.pendingReviewPrescription || SAMPLE_EXTRACTED_PRESCRIPTION;
}

export function addConfirmedPrescription(newMedicines, prescriptionMeta = {}) {
  const state = loadStore();
  const newDoses = [];

  newMedicines.forEach((med, idx) => {
    (med.scheduledTimes || ['08:00 AM']).forEach((time, tIdx) => {
      const slot = time.includes('AM') ? 'morning' : time.includes('02:') ? 'afternoon' : 'night';
      newDoses.push({
        id: `dose_new_${Date.now()}_${idx}_${tIdx}`,
        medicineId: med.id,
        name: med.name,
        nameHindi: med.nameHindi || med.name,
        dosage: med.dosage,
        dosageHindi: med.dosageHindi || med.dosage,
        slot,
        scheduledTime: time,
        timeHindi: time.replace('AM', 'सुबह').replace('PM', 'शाम/रात'),
        instructions: med.instructions || 'Take as advised with water.',
        instructionsHindi: med.instructionsHindi || 'सलाह अनुसार पानी से लें।',
        status: 'pending',
      });
    });
  });

  // Also record this prescription in state.prescriptions
  const newRxRecord = {
    id: prescriptionMeta.id || `rx_${Date.now()}`,
    doctorName: prescriptionMeta.doctorName || 'Dr. Verified Prescription',
    clinicName: prescriptionMeta.clinicName || 'CareLoop Verified Clinic',
    date: prescriptionMeta.date || new Date().toISOString().split('T')[0],
    image: prescriptionMeta.image || null,
    medicines: newMedicines,
    status: 'confirmed',
    modelUsed: prescriptionMeta.modelUsed || 'gemini-3.5-flash',
  };

  state.prescriptions = [newRxRecord, ...state.prescriptions];
  state.doses = [...state.doses, ...newDoses];
  state.pendingReviewPrescription = null; // Clear pending after confirmation
  saveStore(state);
  return state;
}

export function calculateAdherence(doses = []) {
  if (!doses || doses.length === 0) return 100;
  const takenCount = doses.filter((d) => d.status === 'taken').length;
  const missedCount = doses.filter((d) => d.status === 'missed').length;
  const passedDoses = takenCount + missedCount;
  if (passedDoses === 0) return 100;
  return Math.round((takenCount / passedDoses) * 100);
}
