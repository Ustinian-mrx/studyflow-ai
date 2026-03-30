import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

type TokenPayload = {
  userId: number;
  email?: string;
  username?: string;
};

const TOKEN_KEY = AUTH_COOKIE_NAME;
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}