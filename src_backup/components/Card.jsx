/**
 * tone: default | highlight | warning
 * headingLevel: keep the document outline correct (default h2)
 */
export default function Card({
  as: Tag = 'section',
  tone = 'default',
  title,
  headingLevel = 2,
  action,
  className = '',
  children,
  ...rest
}) {
  const Heading = `h${headingLevel}`;

  return (
    <Tag className={`card card--${tone} ${className}`.trim()} {...rest}>
      {(title || action) && (
        <header className="card__header">
          {title ? <Heading className="card__title">{title}</Heading> : <span />}
          {action}
        </header>
      )}
      {children}
    </Tag>
  );
}
