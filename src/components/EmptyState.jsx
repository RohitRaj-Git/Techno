import Icon from './Icon';

export default function EmptyState({ icon = 'info', title, description, action, className = '' }) {
  return (
    <div className={`empty ${className}`.trim()}>
      <div className="empty__icon">
        <Icon name={icon} size={40} />
      </div>
      <h2>{title}</h2>
      {description ? <p className="empty__desc">{description}</p> : null}
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}
