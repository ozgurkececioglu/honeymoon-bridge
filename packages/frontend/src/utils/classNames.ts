import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function classNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default classNames;
