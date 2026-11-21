import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { t } from '../i18n';

/**
 * items: [{ to, icon, labelKey, end? }]
 * hideOnDesktop: hide at >=1024px (used with Sidebar in the caregiver layout)
 */
export default function BottomNav({ items, hideOnDesktop = false, className = '' }) {
  const classes = ['bottom-nav', hideOnDesktop && 'bottom-nav--mobile-only', className]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={classes} aria-label={t('nav.main')}>
      <ul className="bottom-nav__list">
        {items.map((item) => (
          <li key={item.to} className="bottom-nav__item">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) => `bottom-nav__link${isActive ? ' is-active' : ''}`}
            >
              <Icon name={item.icon} size={28} />
              <span className="bottom-nav__label">{t(item.labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
