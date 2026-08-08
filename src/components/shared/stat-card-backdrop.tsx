export function StatCardBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      fill="none"
      className="pointer-events-none absolute -bottom-5 -end-5 h-28 w-28 text-primary opacity-10"
    >
      <path
        d="M30 96 L30 72 M50 96 L50 52 M70 96 L70 62 M90 96 L90 40"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M30 72 L50 52 L70 62 L90 40 L108 46"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="108" cy="46" r="3" fill="currentColor" />
    </svg>
  );
}
