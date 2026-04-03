import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 先做条件 class 拼接，再交给 tailwind-merge 去重冲突类名。
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
