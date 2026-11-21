import Icon from './Icon';
import { t } from '../i18n';
import { getStatusMeta, normalizeStatus } from '../utils/status';

// Always renders icon + text label, never color alone.
export default function StatusChip({ status, size = 'md', className = '' }) {
  const key = normalizeStatus(status);
  const meta = getStatusMeta(key);

  return (
    <span className={`chip chip--${key} chip--${size} ${className}`.trim()}>
      <Icon name={meta.icon} size={size === 'sm' ? 16 : 20} />
      <span>{t(meta.labelKey)}</span>
    </span>
  );
}
