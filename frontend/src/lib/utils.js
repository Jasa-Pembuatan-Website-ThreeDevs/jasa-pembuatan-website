import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility untuk menggabungkan class Tailwind CSS
 * Menghapus konflik antar class yang tumpang tindih
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
