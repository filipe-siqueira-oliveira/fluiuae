import { FlowIllustration as Svg } from "./auth_layout_styles";

export const FlowIllustration = () => (
  <Svg viewBox="0 0 600 260" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="auth_flow_area_fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7FD6A8" stopOpacity="0.14" />
        <stop offset="1" stopColor="#7FD6A8" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      data-area
      d="M0 210 C 70 205, 110 170, 170 168 S 280 120, 340 110 S 450 70, 520 52 S 580 40, 600 34 L 600 260 L 0 260 Z"
      fill="url(#auth_flow_area_fade)"
    />
    <path
      data-line="income"
      pathLength={1}
      d="M0 210 C 70 205, 110 170, 170 168 S 280 120, 340 110 S 450 70, 520 52 S 580 40, 600 34"
      fill="none"
      stroke="#7FD6A8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      data-line="expense"
      pathLength={1}
      d="M0 236 C 80 232, 130 214, 190 212 S 300 190, 360 184 S 470 160, 540 150 S 585 144, 600 142"
      fill="none"
      stroke="rgba(242, 164, 120, 0.8)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="520" cy="52" r="6" fill="#7FD6A8" stroke="#0A3B28" strokeWidth="3" />
    <circle cx="540" cy="150" r="5" fill="#F2A478" stroke="#0A3B28" strokeWidth="3" />
  </Svg>
);
