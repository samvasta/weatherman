import { createIcon } from "../createIcon";

export const NormalIcon = createIcon({
  displayName: "DistributionNormal",
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
          <stop stop-color="currentColor" stopOpacity={0.4} offset="0" />
          <stop stop-color="currentColor" stop-opacity="0" offset="1" />
        </linearGradient>
      </defs>
      <path
        d="m12 7c-4 0-2 11-12 11v3h24v-3c-10 0-8-11-12-11z"
        fill="url(#linearGradient3956)"
      />
      <path
        d="m0 18c10 0 8-11 12-11s2 11 12 11"
        fill="none"
        stroke="currentColor"
      />
    </>
  ),
});
