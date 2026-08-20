/** Small geometric mark — three converging strokes, standing in for
 *  plan / retrieve / verify converging into one synthesized answer. */
export default function LogoMark({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 15L10 3L17 15"
        stroke="var(--color-amber-500)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 15L10 8.5L13.5 15"
        stroke="var(--color-ink-300)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="15" r="1.4" fill="var(--color-amber-500)" />
    </svg>
  );
}
