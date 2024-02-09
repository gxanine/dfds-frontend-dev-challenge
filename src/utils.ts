import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Relative path /api/${path}
 * @param path
 * @returns
 */
export async function fetchData(path: string) {
  const response = await fetch(`/api/${path}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export function mergeTimeAndDate(time: string, date: Date): Date {
  const timeSplit = time.split(":");
  const hours = parseInt(timeSplit[0] ?? "0", 10);
  const minutes = parseInt(timeSplit[1] ?? "0", 10);
  const seconds = parseInt(timeSplit[2] ?? "0", 10);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    seconds,
  );
}
