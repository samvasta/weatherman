export const StandardFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  compactDisplay: "short",
  notation: "compact",
});

export function formatNumber(n: number) {
  return StandardFormatter.format(n);
}
