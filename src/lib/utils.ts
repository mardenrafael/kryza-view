import { clsx, type ClassValue } from "clsx";
import { getToken } from "next-auth/jwt";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSubdomain(host: string | null): string | null {
  if (!host) return null;

  const parts = host.split(".");
  if (parts.length < 3) return null;

  return parts[0];
}

export async function getUserData(req: Request) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token) {
    throw new Error("Token not found");
  }

  return token;
}
