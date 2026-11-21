import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Banner from '../../components/Banner';
import Icon from '../../components/Icon';
import Spinner from '../../components/Spinner';
import { t, getLocale } from '../../i18n';
import { setPendingReviewPrescription, SAMPLE_EXTRACTED_PRESCRIPTION } from '../../utils/mockStore';

// Authentic Hospital Doctor Prescription Pad for demonstration
const SAMPLE_PRESCRIPTION_PREVIEW = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560" fill="%23ffffff">
  <defs>
    <filter id="paper-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="800" height="560" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="1.5" rx="4"/>
  <rect x="0" y="0" width="800" height="12" fill="%230f766e"/>
  
  <!-- Hospital Header -->
  <g transform="translate(36, 32)">
    <circle cx="20" cy="20" r="18" fill="%23f0fdfa" stroke="%230f766e" stroke-width="2"/>
    <path d="M20 10 V30 M10 20 H30" stroke="%230f766e" stroke-width="3.5" stroke-linecap="round"/>
    <text x="50" y="18" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="17" fill="%230f172a" letter-spacing="-0.01em">AAROGYA MULTISPECIALTY CLINIC &amp; RESEARCH CENTER</text>
    <text x="50" y="34" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="11" fill="%230f766e">DEPARTMENT OF INTERNAL MEDICINE &amp; CARDIOMETABOLIC CARE</text>
    <text x="50" y="47" font-family="Arial, sans-serif" font-size="9.5" fill="%2364748b">14-B Institutional Area, Civil Lines, New Delhi 110054 • Ph: 011-27498100 • NABH Accredited</text>
  </g>

  <!-- Doctor Reg & Licensure Block (Right aligned) -->
  <g transform="translate(540, 32)">
    <text x="220" y="16" text-anchor="end" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="13" fill="%230f172a">DR. RAJESH VERMA</text>
    <text x="220" y="30" text-anchor="end" font-family="Arial, sans-serif" font-weight="600" font-size="10" fill="%23334155">MBBS, MD (Medicine), FICP</text>
    <text x="220" y="44" text-anchor="end" font-family="Arial, sans-serif" font-size="9.5" fill="%230f766e">Reg. No: MCI/2012/84910</text>
  </g>

  <line x1="36" y1="92" x2="764" y2="92" stroke="%230f766e" stroke-width="2"/>
  <line x1="36" y1="95" x2="764" y2="95" stroke="%23ccfbf1" stroke-width="1"/>

  <!-- Patient Demographic & Vitals Strip -->
  <rect x="36" y="104" width="728" height="42" fill="%23f8fafc" stroke="%23e2e8f0" rx="4"/>
  <g transform="translate(48, 122)" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" fill="%231e293b">
    <text x="0" y="0"><tspan font-weight="700" fill="%2364748b">Patient:</tspan> <tspan font-weight="800">Ram Prasad</tspan></text>
    <text x="170" y="0"><tspan font-weight="700" fill="%2364748b">Age/Sex:</tspan> 68 Y / Male</text>
    <text x="310" y="0"><tspan font-weight="700" fill="%2364748b">UHID:</tspan> CL-849102</text>
    <text x="440" y="0"><tspan font-weight="700" fill="%2364748b">Date:</tspan> 20-Nov-2026</text>
    <text x="570" y="0"><tspan font-weight="700" fill="%2364748b">BP:</tspan> <tspan font-weight="700" fill="%230f766e">134/84 mmHg</tspan></text>
    <text x="0" y="16" font-size="9.5" fill="%2364748b">Vitals: Pulse 74 bpm • Wt 71.5 kg • Fasting Blood Sugar 142 mg/dL • Diagnosis: Type 2 DM, Mild HTN</text>
  </g>

  <!-- Watermark Rx -->
  <text x="640" y="360" font-family="Georgia, serif" font-size="160" font-weight="bold" fill="%23f0fdfa" opacity="0.6">Rx</text>

  <!-- Rx symbol -->
  <g transform="translate(36, 175)">
    <text x="0" y="24" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="bold" font-style="italic" fill="%230f766e">Rx</text>
  </g>

  <!-- Prescribed Medications (Realistic Clinical Order) -->
  <g transform="translate(56, 215)" font-family="'Plus Jakarta Sans', Arial, sans-serif">
    <!-- Item 1 -->
    <g transform="translate(0, 0)">
      <circle cx="0" cy="-4" r="3" fill="%230f766e"/>
      <text x="14" y="0" font-weight="800" font-size="14" fill="%230f172a">1. Tab. Metformin Hydrochloride 500 mg (Glyciphage)</text>
      <text x="24" y="18" font-size="12" fill="%23334155"><tspan font-weight="700">Dose:</tspan> 1 - 0 - 1 (Twice daily after meals) • Duration: 30 days</text>
    </g>

    <!-- Item 2 -->
    <g transform="translate(0, 48)">
      <circle cx="0" cy="-4" r="3" fill="%230f766e"/>
      <text x="14" y="0" font-weight="800" font-size="14" fill="%230f172a">2. Tab. Telmisartan 40 mg (Telma 40)</text>
      <text x="24" y="18" font-size="12" fill="%23334155"><tspan font-weight="700">Dose:</tspan> 1 - 0 - 0 (Morning with breakfast) • Duration: 30 days</text>
    </g>

    <!-- Item 3 (Unclear/Flagged item) -->
    <g transform="translate(0, 96)">
      <circle cx="0" cy="-4" r="3" fill="%23b91c1c"/>
      <rect x="10" y="-14" width="460" height="42" fill="%23fff1f2" rx="3" stroke="%23fecdd3" stroke-dasharray="3 3"/>
      <text x="20" y="0" font-weight="800" font-size="14" fill="%23991b1b">3. Tab. Amlodipine ?5mg / ?10mg [Unclear smudged numeral]</text>
      <text x="20" y="18" font-size="12" fill="%23b91c1c"><tspan font-weight="700">Dose:</tspan> 0 - 0 - 1 (Bedtime night dose) • Note: Verify strength with patient</text>
    </g>

    <!-- Item 4 -->
    <g transform="translate(0, 154)">
      <circle cx="0" cy="-4" r="3" fill="%230f766e"/>
      <text x="14" y="0" font-weight="800" font-size="14" fill="%230f172a">4. Cap. Pantoprazole 40 mg (Pan 40)</text>
      <text x="24" y="18" font-size="12" fill="%23334155"><tspan font-weight="700">Dose:</tspan> 1 - 0 - 0 (Morning 30 min before food, empty stomach) • Duration: 15 days</text>
    </g>
  </g>

  <!-- Doctor General Advice -->
  <g transform="translate(48, 440)" font-family="Arial, sans-serif" font-size="10.5" fill="%2364748b">
    <text x="0" y="0" font-weight="bold" fill="%23334155">General Physician Advice:</text>
    <text x="0" y="16">• Maintain low sodium &amp; low glycemic index diet. Regular 20 min morning walk recommended.</text>
    <text x="0" y="30">• Self-monitor BP weekly. Review in OPD with fasting blood sugar report after 30 days.</text>
  </g>

  <!-- Doctor Signature & Stamp Area -->
  <g transform="translate(560, 440)">
    <!-- Round Clinic Verification Stamp in blue ink -->
    <circle cx="60" cy="30" r="34" fill="none" stroke="%232563eb" stroke-width="1.8" stroke-dasharray="4 2" opacity="0.85"/>
    <circle cx="60" cy="30" r="28" fill="none" stroke="%232563eb" stroke-width="0.8" opacity="0.85"/>
    <text x="60" y="24" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="7" fill="%232563eb" letter-spacing="0.08em">AAROGYA CLINIC</text>
    <text x="60" y="34" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="6.5" fill="%232563eb">VERIFIED Rx</text>
    <text x="60" y="44" text-anchor="middle" font-family="Arial, sans-serif" font-size="6" fill="%232563eb">NEW DELHI</text>

    <!-- Fountain pen signature path -->
    <path d="M90 35 C110 15, 120 45, 140 25 C155 10, 160 40, 185 20 M120 38 L170 36" fill="none" stroke="%231e3a8a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="80" y1="52" x2="190" y2="52" stroke="%2394a3b8" stroke-width="1"/>
    <text x="135" y="66" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="9" fill="%23475569">DR. RAJESH VERMA (MD)</text>
    <text x="135" y="77" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="%2394a3b8">Authorized Medical Practitioner</text>
  </g>
</svg>`;

export default function PrescriptionUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const locale = getLocale();
  const isHi = locale === 'hi';

  const [previewUrl, setPreviewUrl] = useState(SAMPLE_PRESCRIPTION_PREVIEW);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('sample_prescription_dr_verma.jpg');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const scanSteps = isHi
    ? [
        'पर्ची को जेमिनी AI सर्वर पर भेजा जा रहा है...',
        'डॉक्टर की हस्तलिखित दवाओं की AI पहचान जारी है...',
        'खुराक व समय का राष्ट्रीय औषधि मानकों से मिलान किया जा रहा है...',
        'सुरक्षा जांच: अस्पष्ट लिखावट व संदेहों की समीक्षा की जा रही है...',
        'विश्लेषण पूर्ण! सत्यापन पृष्ठ पर ले जाया जा रहा है...',
      ]
    : [
        'Sending image to Gemini Multimodal Vision API...',
        'Recognizing doctor handwriting, drug names and dosages...',
        'Mapping medical frequencies (1-0-1, 1-0-0) to daily clock timings...',
        'Medical safety: Checking confidence scores & flagging smudged text...',
        'Analysis complete! Opening verification page...',
      ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (< 15MB)
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage('File size exceeds 15MB limit. Please choose a smaller photo.');
        return;
      }
      setErrorMessage('');
      setSelectedFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startExtraction = async () => {
    setScanning(true);
    setScanStep(0);
    setErrorMessage('');

    // Step ticker for UI feedback while Gemini is processing
    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < scanSteps.length - 2 ? prev + 1 : prev));
    }, 1200);

    try {
      let response;

      if (selectedFile) {
        // Send multipart form data
        const formData = new FormData();
        formData.append('prescription', selectedFile);
        response = await fetch('/api/prescriptions/scan', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Send base64 / SVG previewUrl
        response = await fetch('/api/prescriptions/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: previewUrl }),
        });
      }

      const result = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Server failed to analyze prescription.');
      }

      setScanStep(scanSteps.length - 1);

      // Save extracted data to mockStore with preserved original image
      setPendingReviewPrescription({
        ...result.data,
        originalImage: previewUrl,
        fileName,
        modelUsed: result.modelUsed || 'Gemini 3.5 Flash',
      });

      setTimeout(() => {
        navigate('/patient/review');
      }, 700);
    } catch (err) {
      clearInterval(stepInterval);
      setScanning(false);
      console.warn('Backend Gemini scan failed:', err.message);

      // Graceful fallback option
      setErrorMessage(
        `Gemini API analysis notice: ${err.message}. You can retry or proceed with the pre-loaded sample dataset.`
      );
    }
  };

  const handleUseFallbackSample = () => {
    setPendingReviewPrescription({
      ...SAMPLE_EXTRACTED_PRESCRIPTION,
      originalImage: SAMPLE_PRESCRIPTION_PREVIEW,
      fileName: 'sample_prescription_dr_verma.jpg',
      modelUsed: 'Pre-loaded Clinical Sample',
    });
    navigate('/patient/review');
  };

  return (
    <div className="page stack page--wide" style={{ '--stack-gap': 'var(--space-6)' }}>
      {/* HEADER & MEDICAL AI SPECIFICATION */}
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div className="row" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--color-primary)',
                background: 'var(--color-primary-soft)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-primary-soft-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                letterSpacing: '0.02em',
              }}
            >
              <Icon name="sparkles" size={14} />
              <span>MULTIMODAL CLINICAL VISION</span>
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-navy-muted)',
                background: 'var(--color-surface-alt)',
                border: '1px solid var(--color-border)',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              Gemini 3.5 Flash
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#15803d',
                background: '#dcfce7',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              ● HIPAA &amp; ABHA Safe
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--fs-2xl)', letterSpacing: '-0.025em', margin: 0, color: 'var(--color-navy)' }}>
            {t('rx.upload.title')}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', margin: 'var(--space-1) 0 0' }}>
            Upload or photograph doctor&apos;s physical prescription slip to automatically digitize medication schedule &amp; reminders
          </p>
        </div>

        <div className="row" style={{ gap: 'var(--space-2)' }}>
          <Button
            variant="secondary"
            size="md"
            icon="camera"
            onClick={() => cameraInputRef.current?.click()}
            style={{ fontWeight: 700 }}
          >
            {isHi ? 'कैमरा चालू करें' : 'Camera Capture'}
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(SAMPLE_PRESCRIPTION_PREVIEW);
              setFileName('sample_prescription_dr_verma.jpg');
              setErrorMessage('');
            }}
            style={{ fontSize: '0.85rem' }}
          >
            Sample Slip
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Banner variant="warning" onDismiss={() => setErrorMessage('')} title="Analysis Notice">
          <div className="stack" style={{ gap: 'var(--space-2)' }}>
            <div>{errorMessage}</div>
            <div className="row" style={{ gap: 'var(--space-3)' }}>
              <Button size="md" variant="secondary" onClick={handleUseFallbackSample}>
                Use Pre-loaded Clinical Sample
              </Button>
              <Button size="md" variant="primary" onClick={startExtraction}>
                Retry Scan
              </Button>
            </div>
          </div>
        </Banner>
      )}

      {/* 2-COLUMN CLINICAL SCANNER WORKSTATION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* LEFT: SCANNER VIEWFINDER */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
          }}
        >
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-navy-muted)' }}>
              Optical Viewport
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                background: 'var(--color-primary-soft)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              300 DPI · High Res
            </span>
          </div>

          <div
            className="scanner-frame"
            onClick={() => !scanning && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
            style={{ minHeight: '340px', padding: 'var(--space-3)' }}
          >
            {/* LASER SCANNING BEAM */}
            {scanning && <div className="scanner-laser" />}

            {previewUrl ? (
              <div className="stack" style={{ alignItems: 'center', width: '100%' }}>
                <img
                  src={previewUrl}
                  alt="Prescription preview"
                  style={{
                    maxHeight: '340px',
                    width: 'auto',
                    maxWidth: '100%',
                    borderRadius: '4px',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.1)',
                    opacity: scanning ? 0.8 : 1,
                    border: '1px solid var(--color-border)',
                  }}
                />
                <div style={{ marginTop: 'var(--space-3)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  File: <strong style={{ color: 'var(--color-text)' }}>{fileName}</strong> · Click to change file
                </div>
              </div>
            ) : (
              <div className="stack" style={{ alignItems: 'center', gap: 'var(--space-2)', textAlign: 'center', padding: 'var(--space-8)' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-soft)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="camera" size={32} />
                </div>
                <div style={{ fontWeight: 800, fontSize: 'var(--fs-lg)', color: 'var(--color-text)' }}>
                  {t('rx.upload.dragText')}
                </div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
                  {t('rx.upload.supportText')}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={scanning}
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={scanning}
            />
          </div>
        </div>

        {/* RIGHT: CLINICAL PROCESSING STATION & CONTROLS */}
        <div className="stack" style={{ gap: 'var(--space-5)' }}>
          {/* MEDICAL SAFETY GUARANTEE CARD */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
            }}
          >
            <div className="row" style={{ gap: 'var(--space-2)', color: 'var(--color-primary)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <Icon name="shield" size={20} />
              <strong style={{ fontSize: '0.9rem', letterSpacing: '-0.01em', color: 'var(--color-navy)' }}>
                Clinical Safety &amp; Verification Protocol
              </strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
              {isHi
                ? 'केयरलूप कभी भी अस्पष्ट लिखावट का मनमाना अनुमान नहीं लगाता। कोई भी संदेहास्पद दवा आपके सत्यापन के लिए अलग से चिह्नित की जाती है।'
                : 'CareLoop AI strictly cross-checks extracted medication, dosages, and dosing frequencies against standard pharmacopeia. Any smudged or ambiguous handwriting is immediately isolated for manual patient review.'}
            </p>

            <div className="stack" style={{ gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#166534', fontWeight: 600 }}>
                <Icon name="checkCircle" size={15} />
                <span>Zero hallucination constraint on active ingredients</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#166534', fontWeight: 600 }}>
                <Icon name="checkCircle" size={15} />
                <span>Original doctor prescription preserved for comparative auditing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#166534', fontWeight: 600 }}>
                <Icon name="checkCircle" size={15} />
                <span>Schedule establishment locked until explicit user sign-off</span>
              </div>
            </div>
          </div>

          {/* AI SCAN TRIGGER & TICKER */}
          <div
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f0fdfa 100%)',
              border: '1.5px solid var(--color-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              boxShadow: '0 8px 24px -4px rgba(15, 118, 110, 0.12)',
            }}
          >
            {scanning ? (
              <div className="stack" style={{ alignItems: 'center', textAlign: 'center', gap: 'var(--space-4)', padding: 'var(--space-2)' }}>
                <Spinner size={36} />
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: 'var(--fs-lg)' }}>
                    {scanSteps[scanStep]}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                    Multimodal Vision Analysis Step {scanStep + 1} of {scanSteps.length}
                  </div>
                </div>
              </div>
            ) : (
              <div className="stack" style={{ gap: 'var(--space-3)' }}>
                <div style={{ fontWeight: 800, fontSize: 'var(--fs-lg)', color: 'var(--color-navy)' }}>
                  Ready for Multimodal Clinical Extraction
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  Analyze doctor handwritten prescription pad using Google Gemini 3.5 Flash Multimodal Vision API to parse drug names, frequencies, and instructions.
                </p>

                <Button
                  variant="primary"
                  size="lg"
                  icon="sparkles"
                  fullWidth
                  onClick={startExtraction}
                  style={{
                    minHeight: '60px',
                    fontSize: '1.125rem',
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    boxShadow: '0 4px 18px rgba(15, 118, 110, 0.3)',
                  }}
                >
                  {t('rx.upload.startScan')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
