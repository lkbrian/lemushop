import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function handleApiResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 402) {
      throw new Error("API quota exceeded. Please try again later.");
    }
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} ${errorText}`);
  }
  return response.json();
}
