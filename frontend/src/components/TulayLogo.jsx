export default function TulayLogo({ variant = "full", theme = "light" }) {
  const compact = variant === "mark";

  return (
    <span className={`tulay-logo tulay-logo-${theme}${compact ? " tulay-logo-compact" : ""}`}>
      <svg
        className="tulay-logo-mark"
        viewBox="0 0 64 38"
        role="img"
        aria-label={compact ? "Project TULAY" : undefined}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 25C12 11 20 7 28 7c8 0 16 4 22 18" />
        <path d="M6 25h52" />
        <circle cx="6" cy="25" r="2.8" />
        <circle cx="58" cy="25" r="2.8" />
        <path d="M25 25c2.2-4.8 4.8-7.2 7-7.2s4.8 2.4 7 7.2" />
      </svg>
      {!compact && (
        <span className="tulay-logo-copy">
          <strong>Project TULAY</strong>
          <small>Bridge to Belonging</small>
        </span>
      )}
    </span>
  );
}
