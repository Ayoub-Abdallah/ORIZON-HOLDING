import { NextResponse } from "next/server";
import { z } from "zod";
import type { Conversation, Lead } from "@/lib/schemas";
import { store } from "@/lib/server/store";
import { isAdmin } from "@/lib/server/guard";

export const dynamic = "force-dynamic";

const byNewest = (a: { createdAt: string; updatedAt?: string }, b: { createdAt: string; updatedAt?: string }) =>
  (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt);

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [leads, conversations] = await Promise.all([
    store.all<Lead>("leads"),
    store.all<Conversation>("conversations"),
  ]);
  return NextResponse.json({
    leads: leads.sort(byNewest),
    // Hide AI-only chats with a single exchange to keep the inbox signal-heavy.
    conversations: conversations.filter((c) => c.mode === "human" || c.messages.length > 2).sort(byNewest),
  });
}

const patchSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("lead"), id: z.string(), status: z.enum(["new", "open", "closed"]) }),
  z.object({ type: z.literal("conversation"), id: z.string(), status: z.enum(["open", "closed"]).optional(), read: z.boolean().optional() }),
]);

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const p = parsed.data;

  if (p.type === "lead") {
    const lead = await store.get<Lead>("leads", p.id);
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await store.put("leads", { ...lead, status: p.status });
  } else {
    const convo = await store.get<Conversation>("conversations", p.id);
    if (!convo) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await store.put("conversations", {
      ...convo,
      status: p.status ?? convo.status,
      unread: p.read === undefined ? convo.unread : !p.read,
    });
  }
  return NextResponse.json({ ok: true });
}
