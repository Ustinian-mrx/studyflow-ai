import { AUTH_COOKIE_NAME } from "@/lib/constants";

const TOKEN_KEY = AUTH_COOKIE_NAME;

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

export function getAuthHeaders() {
const token = getToken();

if (!token) {
return {};
}

return {
Authorization: `Bearer ${token}`,
};
}