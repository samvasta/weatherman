import { cn } from "@/utils/tailwind";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-neutral-12/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
