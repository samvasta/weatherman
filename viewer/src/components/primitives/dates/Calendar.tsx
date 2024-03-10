import * as React from "react";

import { DayPicker } from "react-day-picker";

import { ChevronLeftIcon } from "@/icons/svgs/ChevronLeft";
import { ChevronRightIcon } from "@/icons/svgs/ChevronRight";
import { cn } from "@/utils/tailwind";

import { buttonVariants } from "../button/Button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      weekStartsOn={1}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-neutral-12"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-neutral-12 rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary-6 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost", colorScheme: "primary" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-neutral-12"
        ),
        day_selected:
          "bg-primary-8 text-neutral-12 border hover:bg-primary-8 hover:text-neutral-12 focus:bg-primary-8 focus:text-neutral-12 hover:border-3",
        day_today: "bg-secondary-4 text-neutral-12",
        day_outside: "text-neutral-11 opacity-50",
        day_disabled: "text-neutral-10 opacity-50",
        day_range_middle:
          "aria-selected:bg-primary-6 aria-selected:text-neutral-12",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeftIcon size="sm" label="prev" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRightIcon size="sm" label="next" {...props} />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
