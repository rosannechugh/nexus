/**
 * Deliberately minimal formatter for assistant answers — paragraphs,
 * bullet/numbered lists, and **bold** — without pulling in a markdown
 * dependency for what the backend actually returns (plain prose with
 * occasional light structure).
 */
function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-medium text-ink-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export default function MarkdownLite({ content }) {
  if (!content) return null;

  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter((l) => l.trim() !== "");
        const isBulletList = lines.every((l) => /^[-*]\s+/.test(l.trim()));
        const isNumberedList = lines.every((l) => /^\d+[.)]\s+/.test(l.trim()));

        if (isBulletList) {
          return (
            <ul
              key={blockIndex}
              className="list-disc space-y-1.5 pl-5 marker:text-ink-700"
            >
              {lines.map((line, i) => (
                <li key={i} className="text-ink-300">
                  {renderInline(line.replace(/^[-*]\s+/, ""), `${blockIndex}-${i}`)}
                </li>
              ))}
            </ul>
          );
        }

        if (isNumberedList) {
          return (
            <ol
              key={blockIndex}
              className="list-decimal space-y-1.5 pl-5 marker:text-ink-700"
            >
              {lines.map((line, i) => (
                <li key={i} className="text-ink-300">
                  {renderInline(
                    line.replace(/^\d+[.)]\s+/, ""),
                    `${blockIndex}-${i}`
                  )}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={blockIndex} className="leading-relaxed text-ink-300">
            {lines.map((line, i) => (
              <span key={i}>
                {renderInline(line, `${blockIndex}-${i}`)}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
