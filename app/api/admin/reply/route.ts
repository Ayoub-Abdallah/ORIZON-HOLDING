import { NextResponse } from "next/server";
import { z } from "zod";
import type { Conversation } from "@/lib/schemas";
import { store, newId } from "@/lib/server/store";
import { isAdmin } from "@/lib/server/guard";

const schema = z.object({ conversationId: z.string(), text: z.string().trim().min(1).max(4000) });

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid reply" }, { status: 400 });

  const convo = await store.get<Conversation>("conversations", parsed.data.conversationId);
  if (!convo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date().toISOString();
  convo.messages.push({ id: newId("m"), role: "agent", text: parsed.data.text, at: now });
  convo.mode = "human";
  convo.unread = false;
  convo.updatedAt = now;
  await store.put("conversations", convo);
  return NextResponse.json({ conversation: convo });
}
