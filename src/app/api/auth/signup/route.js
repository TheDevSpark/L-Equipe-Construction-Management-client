import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { firstName, lastName, email, password, role } = body;
  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const effectiveRole = role || "owner";
  const res = NextResponse.json({ ok: true });
  setAuthCookie(res, { id: email, email, role: effectiveRole, firstName, lastName });
  return res;
}


