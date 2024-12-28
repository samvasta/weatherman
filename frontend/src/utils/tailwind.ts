import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ColorSchemeClasses = {
  neutral: "scheme-neutral",
  primary: "scheme-primary",
  danger: "scheme-danger",
  success: "scheme-success",
  info: "scheme-info",
};
