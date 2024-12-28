import { type LucideProps } from "lucide-react";

import { sizeLookup } from "@/components/icons/createIcon";

export function WithLeftNodeIcon({
  children,
  IconComponent,
}: React.PropsWithChildren<{
  IconComponent: React.ComponentType<LucideProps>;
}>) {
  return (
    <div className="flex h-full gap-2 rounded-sm bg-cur-scheme-1">
      <div className="grid h-full place-items-center rounded-l-sm border-r-2 border-cur-scheme-6 bg-cur-scheme-3">
        <IconComponent
          size={sizeLookup.lg.width}
          className="stroke-cur-scheme-11"
        />
      </div>
      <div className="flex flex-col gap-2 p-3">{children}</div>
    </div>
  );
}

export function WithLeftNodeIconPreview({
  children,
  IconComponent,
}: React.PropsWithChildren<{
  IconComponent: React.ComponentType<LucideProps>;
}>) {
  return (
    <div className="flex h-full items-center gap-2 rounded-sm bg-cur-scheme-1">
      <div className="grid h-full place-items-center rounded-l-sm border-r-2 border-cur-scheme-6 bg-cur-scheme-3">
        <IconComponent
          size={sizeLookup.lg.width}
          className="stroke-cur-scheme-11"
        />
      </div>
      {children}
    </div>
  );
}
