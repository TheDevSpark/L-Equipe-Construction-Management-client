import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body;

  // In real app, validate against DB; here accept any non-empty
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  setAuthCookie(res, { id: email, email, role: "owner" });
  return res;
}


