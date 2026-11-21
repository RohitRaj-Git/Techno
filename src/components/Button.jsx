import { Link } from 'react-router-dom';
import Icon from './Icon';
import Spinner from './Spinner';

/**
 * variant: primary | secondary | success | danger | ghost
 * size: md (56px min) | lg (72px min, for main dose actions)
 * Pass `to` for in-app navigation or `href` for external/tel: links.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  disabled = false,
  type = 'button',
  to,
  href,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full',
    loading && 'btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || loading;
  const iconSize = size === 'lg' ? 28 : 24;

  const content = (
    <>
      {loading ? <Spinner size={iconSize - 2} decorative /> : icon ? <Icon name={icon} size={iconSize} /> : null}
      <span className="btn__label">{children}</span>
    </>
  );

  if (to && !isDisabled) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href && !isDisabled) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
}
