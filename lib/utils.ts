import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  options?: {
    currency?: string;
    locale?: string;
    maximumFractionDigits?: number;
  },
) {
  const {
    currency = "USD",
    locale = "en-US",
    maximumFractionDigits = 2,
  } = options ?? {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(value);
}
