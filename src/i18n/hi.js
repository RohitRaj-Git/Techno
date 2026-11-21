// Hindi translation dictionary for CareLoop
const hi = {
  'app.name': 'केयरलूप (CareLoop)',
  'app.tagline': 'स्पष्ट पर्चियां। समय पर दवाएं। परिवार का जुड़ाव।',

  // Common
  'common.required': 'अनिवार्य',
  'common.optional': 'वैकल्पिक',
  'common.loading': 'लोड हो रहा है…',
  'common.close': 'बंद करें',
  'common.dismiss': 'हटाएं',
  'common.cancel': 'रद्द करें',
  'common.save': 'सुरक्षित करें',
  'common.back': 'पीछे जाएं',
  'common.retry': 'पुनः प्रयास करें',
  'common.confirm': 'पुष्टि करें',
  'common.edit': 'बदलें',
  'common.delete': 'हटाएं',
  'common.showPassword': 'देखें',
  'common.hidePassword': 'छिपाएं',
  'common.listen': 'सुनें',
  'common.stop': 'रोकें',
  'common.role': 'भूमिका',
  'common.patient': 'मरीज (Patient)',
  'common.guardian': 'अभिभावक (Guardian)',
  'common.logout': 'लॉग आउट',
  'common.switchRole': 'भूमिका बदलें',

  // Accessibility
  'a11y.progress': '{percent} प्रतिशत दवा पूर्ण',

  // Dose status
  'status.pending': 'बाकी है',
  'status.taken': 'ले ली',
  'status.snoozed': '15 मिनट बाद',
  'status.missed': 'पुष्टि नहीं हुई',
  'status.skipped': 'छोड़ी गई',

  // Navigation
  'nav.main': 'मुख्य मेन्यू',
  'nav.home': 'होम',
  'nav.patient.home': 'डैशबोर्ड',
  'nav.patient.scan': 'पर्ची स्कैन करें',
  'nav.patient.medicines': 'दवाओं का समय',
  'nav.patient.history': 'पिछला रिकॉर्ड',
  'nav.patient.safety': 'दवा सुरक्षा',
  'nav.patient.profile': 'प्रोफ़ाइल',

  'nav.caregiver.dashboard': 'डैशबोर्ड',
  'nav.caregiver.monitoring': 'दवा निगरानी',
  'nav.caregiver.alerts': 'टेलीग्राम अलर्ट',
  'nav.caregiver.patient': 'मरीज विवरण',
  'nav.caregiver.profile': 'सेटिंग्स',

  // Landing page
  'landing.hero.title': 'डॉक्टर की पर्ची समझना अब आसान',
  'landing.hero.subtitle': 'बुजुर्गों और ग्रामीण मरीजों के लिए विशेष रूप से डिज़ाइन किया गया ऐप। हस्तलिखित पर्चियों को पढ़े, हिंदी और अंग्रेजी में बोलकर बताए, और खुराक छूटने पर परिवार को तुरंत टेलीग्राम अलर्ट भेजे।',
  'landing.cta.patient': 'मरीज पोर्टल खोलें',
  'landing.cta.guardian': 'अभिभावक पोर्टल खोलें',
  'landing.demoNotice': 'इंटरएक्टिव फ्रंटएंड प्रदर्शन (डेमो डेटा)',

  // Patient Dashboard
  'patient.nextDose': 'अगली दवा का समय',
  'patient.takenBtn': 'दवा ले ली',
  'patient.snoozeBtn': '15 मिनट बाद याद दिलाएं',
  'patient.todayProgress': 'आज की दवाओं की स्थिति',
  'patient.todaySchedule': 'आज का पूरा टाइम-टेबल',
  'patient.audioGuidance': 'आवाज में सुनें (हिंदी / English)',
  'patient.scanCta': 'नई पर्ची स्कैन करें',
  'patient.scanDesc': 'फोटो खींचें या पर्ची अपलोड करें, दवाएं अपने आप जुड़ेंगी।',

  // Prescription Upload & Review
  'rx.upload.title': 'पर्ची स्कैनर',
  'rx.upload.subtitle': 'डॉक्टर की पर्ची अपलोड करें, AI लिखावट पढ़कर दवाएं निकालेगा।',
  'rx.upload.dragText': 'पर्ची की फोटो चुनने के लिए यहां टैप करें',
  'rx.upload.supportText': 'JPG, PNG, PDF या पर्चे की साफ फोटो स्वीकार्य',
  'rx.upload.startScan': 'दवाएं पढ़ना शुरू करें',
  'rx.review.title': 'पर्ची की जांच और पुष्टि',
  'rx.review.flagNotice': 'सुरक्षा चेतावनी: कुछ अस्पष्ट लिखावट को चिह्नित किया गया है। कृपया समय और खुराक जांचकर पुष्टि करें।',
  'rx.review.confirmBtn': 'पुष्टि करें और शेड्यूल में जोड़ें',
  'rx.review.editMedicine': 'दवा विवरण सुधारें',

  // Guardian Portal
  'guardian.dashboard.title': 'पारिवारिक देखभाल डैशबोर्ड',
  'guardian.patientCard.title': 'मरीज विवरण',
  'guardian.adherenceRate': 'नियमितता प्रतिशत',
  'guardian.todayStatus': 'आज की खुराक स्थिति',
  'guardian.telegram.title': 'टेलीग्राम अलर्ट सुविधा',
  'guardian.telegram.desc': 'दवा के समय के ३० मिनट बाद भी खुराक न लेने पर सीधे टेलीग्राम संदेश प्राप्त करें।',
  'guardian.telegram.simulateBtn': 'छूटी हुई दवा का अलर्ट सिमुलेट करें',
  'guardian.recentAlerts': 'सूचनाएं और अलर्ट इतिहास',

  // Safety
  'safety.title': 'दवा सुरक्षा व इंटरैक्शन जांच',
  'safety.disclaimer': 'यह जानकारी केवल सावधानी के लिए है। डॉक्टर की सलाह के बिना खुराक कभी न बदलें।',

  // Honesty banner
  'demo.banner': 'इंटरएक्टिव स्वास्थ्य सेवा डेमो • लाइव मॉक डेटा सक्रिय',
};

export default hi;
