import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true, demo: true });
  setAuthCookie(res, {
    id: "demo-owner",
    email: "owner.demo@example.com",
    role: "owner",
  });
  return res;
}


