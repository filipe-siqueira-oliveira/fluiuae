export const CreditCardChip = () => (
  <svg width="42" height="32" viewBox="0 0 42 32" aria-hidden="true">
    <defs>
      <linearGradient id="credit_card_chip_gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F2D18B" />
        <stop offset="0.55" stopColor="#C99A45" />
        <stop offset="1" stopColor="#E7BE6B" />
      </linearGradient>
    </defs>
    <rect x="0.5" y="0.5" width="41" height="31" rx="7" fill="url(#credit_card_chip_gold)" />
    <path
      d="M15 1v9.5M27 1v9.5M15 31v-9.5M27 31v-9.5M1 16h9M32 16h9M10 10.5h22v11H10z"
      fill="none"
      stroke="rgba(92, 62, 16, 0.55)"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);
