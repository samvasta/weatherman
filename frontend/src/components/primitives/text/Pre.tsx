import { type HTMLAttributes } from "react";

import { cn } from "@/utils/tailwind";

export function Pre({
  children,
  className,
  ...rest
}: React.PropsWithChildren<HTMLAttributes<HTMLPreElement>>) {
  return (
    <pre
      className={cn(
        "inline w-fit border border-neutral-6 bg-neutral-3 px-tight/2 py-xtight/2 font-mono font-normal text-neutral-11",
        className
      )}
      {...rest}
    >
      {children}
    </pre>
  );
}
