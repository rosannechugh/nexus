/** Consistent section wrapper for the Settings page — one heading style,
 *  one spacing rhythm, reused by Account/Security/Application/Danger. */
export default function SettingsSection({ eyebrow, title, description, children }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-700">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 font-display text-base font-medium tracking-tight text-ink-100">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
