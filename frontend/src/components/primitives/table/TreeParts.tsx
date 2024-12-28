import React from "react";

import { cn } from "@/utils/tailwind";

const TreeTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full">
    <table ref={ref} className={cn("w-full text-sm", className)} {...props} />
  </div>
));
TreeTable.displayName = "Table";

const TreeTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("sticky top-0 z-10 bg-neutral-1", className)}
    {...props}
  />
));
TreeTableHeader.displayName = "TreeTableHeader";

const TreeTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(className)} {...props} />
));
TreeTableBody.displayName = "TreeTableBody";

const TreeTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "h-[2.5rem] max-h-[2.5rem] min-h-[2.5rem] transition-colors",
      // padding
      "[&>td:first-of-type>div]:px-0 [&>td>div]:px-2",
      // borders
      "[&>td:first-of-type>div]:border-0 [&>td:last-of-type>div]:border-r-2 [&>td>div]:border-y [&>td>div]:border-neutral-6",
      // bg colors
      "[&:hover>td:first-of-type>div]:bg-none! data-[state=selected]:bg-cur-scheme-5 [&:hover>td>div]:bg-cur-scheme-4 [&>td>div]:bg-cur-scheme-3",
      // overrides for neutral palette
      "[&>td>div]:data-[scheme='neutral']:bg-neutral-1 [&>td>div]:data-[scheme='neutral']:hover:bg-neutral-4",
      className
    )}
    {...props}
  />
));
TreeTableRow.displayName = "TreeTableRow";

const TreeTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-neutral-11 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TreeTableHead.displayName = "TableHead";

const TreeTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-0 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] [&first-of-type]:border-0",
      className
    )}
    {...props}
  >
    <div className={cn("flex h-8 max-h-8 min-h-8 items-center", className)}>
      {children}
    </div>
  </td>
));
TreeTableCell.displayName = "TreeTableCell";

export {
  TreeTable,
  TreeTableHeader,
  TreeTableBody,
  TreeTableHead,
  TreeTableRow,
  TreeTableCell,
};
