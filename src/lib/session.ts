import { cookies } from "next/headers";
import type { JwtPayload } from "@/lib/jwt";
import { verifyToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser(): Promise<JwtPayload | null> {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  return verifyToken(token);
}
