interface LogoProps {
  className?: string;
}

/** IRMA Al-Ittihad mark — octagram star with a crescent core. */
export function Logo({ className = "h-10 w-10" }: LogoProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="irma-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="60%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Octagram star (two overlapping squares) */}
      <path
        d="M32 3 L45.6 10.4 L53.6 24 L53.6 40 L45.6 53.6 L32 61 L18.4 53.6 L10.4 40 L10.4 24 L18.4 10.4 Z"
        fill="none"
        stroke="url(#irma-logo-gradient)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M32 8 L48 32 L32 56 L16 32 Z"
        fill="none"
        stroke="url(#irma-logo-gradient)"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.65"
      />
      {/* Crescent */}
      <path
        d="M40.5 26.5a10.5 10.5 0 1 1-11.2-13.8 8.6 8.6 0 1 0 11.2 13.8Z"
        fill="#D97706"
      />
      {/* Small star */}
      <path
        d="M42.5 15.5l1.3 2.9 2.9 1.3-2.9 1.3-1.3 2.9-1.3-2.9-2.9-1.3 2.9-1.3Z"
        fill="#10B981"
      />
    </svg>
  );
}
