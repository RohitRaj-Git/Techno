import Icon from './Icon';
import { t } from '../i18n';

const ICON_BY_VARIANT = {
  info: 'info',
  success: 'checkCircle',
  warning: 'alert',
  error: 'alert',
  demo: 'info',
};

/**
 * variant: info | success | warning | error | demo
 * "demo" is the dashed banner used whenever mock data is on screen.
 */
export default function Banner({
  variant = 'info',
  title,
  children,
  action,
  onDismiss,
  className = '',
}) {
  const role = variant === 'error' ? 'alert' : 'status';

  return (
    <div className={`banner banner--${variant} ${className}`.trim()} role={role}>
      <Icon name={ICON_BY_VARIANT[variant] ?? 'info'} size={28} />
      <div className="banner__body">
        {title ? <p className="banner__title">{title}</p> : null}
        {children ? <div className="banner__text">{children}</div> : null}
        {action ? <div className="banner__action">{action}</div> : null}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="banner__dismiss"
          onClick={onDismiss}
          aria-label={t('common.dismiss')}
        >
          <Icon name="close" size={24} />
        </button>
      )}
    </div>
  );
}
