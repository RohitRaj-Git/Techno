import { useId, useState } from 'react';
import Icon from './Icon';
import { t } from '../i18n';

/**
 * as: 'input' (default) | 'select' | 'textarea'
 * For custom controls pass a function as children:
 *   <FormField label="X" name="x">{({ id, describedBy, invalid }) => <input id={id} ... />}</FormField>
 * Uses aria-required (not the native required attribute) so browser-native English
 * validation bubbles never appear; forms validate themselves via the `error` prop.
 */
export default function FormField({
  label,
  name,
  type = 'text',
  as = 'input',
  value,
  onChange,
  error,
  hint,
  required = false,
  optional = false,
  options = [],
  disabled = false,
  rows = 4,
  children,
  ...rest
}) {
  const reactId = useId();
  const id = `${name ?? 'field'}-${reactId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const [showPassword, setShowPassword] = useState(false);

  const controlProps = {
    id,
    name,
    value,
    onChange,
    disabled,
    className: 'field__control',
    'aria-required': required || undefined,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    ...rest,
  };

  let control;
  if (typeof children === 'function') {
    control = children({ id, describedBy, invalid: Boolean(error) });
  } else if (as === 'select') {
    control = (
      <select {...controlProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  } else if (as === 'textarea') {
    control = <textarea rows={rows} {...controlProps} />;
  } else if (type === 'password') {
    control = (
      <div className="field__password">
        <input type={showPassword ? 'text' : 'password'} {...controlProps} />
        <button
          type="button"
          className="field__toggle"
          onClick={() => setShowPassword((current) => !current)}
          aria-pressed={showPassword}
        >
          <Icon name={showPassword ? 'eyeOff' : 'eye'} size={20} />
          <span>{showPassword ? t('common.hidePassword') : t('common.showPassword')}</span>
        </button>
      </div>
    );
  } else {
    control = <input type={type} {...controlProps} />;
  }

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
        {required ? (
          <span className="field__flag"> ({t('common.required')})</span>
        ) : optional ? (
          <span className="field__flag"> ({t('common.optional')})</span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      ) : null}
      {control}
      {error ? (
        <p id={errorId} className="field__error" role="alert">
          <Icon name="alert" size={20} />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
