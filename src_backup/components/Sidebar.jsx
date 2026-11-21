import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { t } from '../i18n';

/**
 * Desktop-only (>=1024px) navigation. Hidden by CSS below that width.
 * items: [{ to, icon, labelKey, end? }]
 * header / footer: optional nodes (footer is typically user name + logout)
 */
export default function Sidebar({ items, header, footer }) {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        {header ?? (
          <span className="sidebar__brand">
            <Icon name="heart" size={28} />
            {t('app.name')}
          </span>
        )}
      </div>

      <nav className="sidebar__nav" aria-label={t('nav.main')}>
        <ul>
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
              >
                <Icon name={item.icon} size={24} />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {footer ? <div className="sidebar__footer">{footer}</div> : null}
    </div>
  );
}
