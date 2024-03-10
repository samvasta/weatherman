import { createIcon } from "../createIcon";

export const ConstantIcon = createIcon({
  displayName: "DistributionConstant",
  viewBox: "0 0 24 20",
  path: (
    <>
      <defs>
        <linearGradient
          id="linearGradient3153"
          x1="13"
          x2="13"
          y1="13"
          y2="21"
          gradientUnits="userSpaceOnUse"
          opacity={0.1}
        >
          <stop stop-color="currentColor" stopOpacity={0.4} offset="0" />
          <stop stop-color="currentColor" stop-opacity="0" offset="1" />
        </linearGradient>
      </defs>
      <g>
        <path
          d="m0 12.5h24"
          fill="none"
          stroke="currentColor"
          stroke-opacity=".99751"
        />
        <rect
          y="12.9"
          width="24"
          height="8.1"
          fill="url(#linearGradient3153)"
        />
      </g>
    </>
  ),
});
