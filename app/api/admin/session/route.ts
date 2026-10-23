import { NextResponse } from "next/server";
import { adminEnabled, checkPassword, endSession, rateLimit, startSession } from "@/lib/server/guard";

export async function POST(req: Request) {
  if (!adminEnabled()) return NextResponse.json({ error: "Admin is disabled. Set ADMIN_PASSWORD." }, { status: 503 });
  if (!(await rateLimit("admin-login", 5, 5 * 60_000))) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  const { password } = ((await req.json().catch(() => ({}))) ?? {}) as { password?: string };
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  await startSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await endSession();
  return NextResponse.json({ ok: true });
}
