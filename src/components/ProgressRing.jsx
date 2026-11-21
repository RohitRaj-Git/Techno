import { t } from '../i18n';

export default function ProgressRing({
  percent = 0,
  size = 140,
  strokeWidth = 14,
  label,
  caption,
  ariaLabel,
  className = '',
}) {
  const safe = Number.isFinite(percent) ? percent : 0;
  const clamped = Math.max(0, Math.min(100, Math.round(safe)));
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className={`ring ${className}`.trim()}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel ?? t('a11y.progress', { percent: clamped })}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
        <circle
          className="ring__track"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        {clamped > 0 && (
          <circle
            className="ring__value"
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </svg>
      <div className="ring__center" aria-hidden="true">
        <span className="ring__label">{label ?? `${clamped}%`}</span>
        {caption ? <span className="ring__caption">{caption}</span> : null}
      </div>
    </div>
  );
}
