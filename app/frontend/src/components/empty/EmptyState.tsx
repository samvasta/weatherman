import { cn } from "@/utils/tailwind";

import { Heading } from "../primitives/text/Heading";
import { Txt } from "../primitives/text/Text";

export type EmptyStateProps = {
  heading: string;
  message?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function EmptyState({
  heading,
  message,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      {...rest}
      className={cn(
        "flex min-h-[15rem] flex-col justify-center rounded-sm border border-dotted border-neutral-7 bg-neutral-3 px-comfortable py-comfortable",
        className
      )}
    >
      <Heading className="text-neutral-10">{heading}</Heading>
      {message && <Txt intent="subtle">{message}</Txt>}
    </div>
  );
}
