import { createIcon } from "../createIcon";

export const AsymmetricNormalIcon = createIcon({
  displayName: "DistributionAsymmetricNormal",
  viewBox: "0 0 24 20",
  path: (
    <>
      <defs>
        <linearGradient
          id="linearGradient3956"
          x1="18"
          x2="18"
          y1="10"
          y2="24"
          gradientTransform="translate(-6,-3)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" stopOpacity={0.4} offset="0" />
          <stop stopColor="currentColor" stopOpacity="0" offset="1" />
        </linearGradient>
      </defs>
      <path
        d="m6 7c-2 0-1 11-6 11 v3 h24 v-3 c-12 0-16-11-18-11z"
        fill="url(#linearGradient3956)"
      />
      <path
        d="m0 18c5 0 4-11 6-11s2 11 24 11"
        fill="none"
        stroke="currentColor"
      />
    </>
  ),
});
