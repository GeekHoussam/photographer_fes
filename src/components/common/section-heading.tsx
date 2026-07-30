export function SectionHeading({
  eyebrow,
  title,
  description,
  className = "",
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={`max-w-5xl ${className}`}>
      <p className="eyebrow text-sand mb-6">{eyebrow}</p>
      <h2 id={id} className="balance display-section">
        {title}
      </h2>
      {description ? (
        <p className="mt-7 max-w-2xl text-base leading-8 text-current/60 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
