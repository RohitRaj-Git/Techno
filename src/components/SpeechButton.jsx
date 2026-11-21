import { useEffect, useState } from 'react';
import Icon from './Icon';
import { speechService, speakMedicineInstructions } from '../utils/speech';
import { getLocale, t } from '../i18n';

export default function SpeechButton({ medicine, lang = null, label = null, className = '' }) {
  const [speaking, setSpeaking] = useState(false);
  const currentLang = lang || getLocale();

  useEffect(() => {
    const unsubscribe = speechService.subscribe(({ speaking: isSpeaking }) => {
      setSpeaking(isSpeaking);
    });
    return unsubscribe;
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    if (speaking) {
      speechService.stop();
      setSpeaking(false);
    } else {
      speakMedicineInstructions(medicine, currentLang, () => {
        setSpeaking(false);
      });
      setSpeaking(true);
    }
  };

  return (
    <button
      type="button"
      className={`speech-btn ${speaking ? 'speech-btn--active' : ''} ${className}`.trim()}
      onClick={handleClick}
      aria-label={speaking ? t('common.stop') : t('common.listen')}
      title={speaking ? t('common.stop') : `${t('common.listen')} (${currentLang === 'hi' ? 'हिंदी' : 'English'})`}
    >
      <Icon name={speaking ? 'volumeX' : 'volume'} size={20} />
      <span>{label || (speaking ? t('common.stop') : currentLang === 'hi' ? 'सुनें' : 'Listen')}</span>
    </button>
  );
}
