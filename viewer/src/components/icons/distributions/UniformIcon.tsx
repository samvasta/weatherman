import { createIcon } from "../createIcon";

export const UniformIcon = createIcon({
  displayName: "DistributionUniform",
  viewBox: "0 0 24 20",
  path: (
    <>
      <defs>
        <linearGradient
          id="linearGradient4579"
          x1="11"
          x2="11"
          y1="7"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" stopOpacity={0.4} offset="0" />
          <stop stopColor="currentColor" stopOpacity="0" offset="1" />
        </linearGradient>
        <clipPath id="clipPath5838">
          <rect width="24" height="24" />
        </clipPath>
      </defs>
      <g>
        <g clipPath="url(#clipPath5838)">
          <path d="m-1 21v-4l26-10v14z" fill="url(#linearGradient4579)" />
          <path
            d="m-1 17 26-10"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".99751"
          />
        </g>
      </g>
    </>
  ),
});
