// Lightweight cookie-based auth utilities for demo purposes
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "app_auth";

export function getUserFromCookies() {
  const cookieStore = cookies();
  const raw = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      id: parsed.id || "demo-user",
      email: parsed.email || "demo@example.com",
      role: parsed.role || "owner",
    };
  } catch {
    return null;
  }
}

export function setAuthCookie(response, user) {
  const value = JSON.stringify({
    id: user.id || "user",
    email: user.email || "user@example.com",
    role: user.role || "client",
  });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookie(response) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });
}

export const AUTH_COOKIE_NAME_CONST = AUTH_COOKIE_NAME;


