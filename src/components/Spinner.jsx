import { t } from '../i18n';

export default function Spinner({
  size = 32,
  label,
  showLabel = false,
  decorative = false,
  className = '',
}) {
  const text = label ?? t('common.loading');

  return (
    <span
      className={`spinner ${className}`.trim()}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <svg
        className="spinner__svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {!decorative && (
        <span className={showLabel ? 'spinner__label' : 'visually-hidden'}>{text}</span>
      )}
    </span>
  );
}
