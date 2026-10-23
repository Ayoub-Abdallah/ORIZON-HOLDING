import { NextResponse } from "next/server";
import { handoffSchema, type Conversation } from "@/lib/schemas";
import { store, newId } from "@/lib/server/store";
import { notifyTeam } from "@/lib/server/mail";
import { rateLimit } from "@/lib/server/guard";

// Moves a conversation from the AI concierge to the human team.
export async function POST(req: Request) {
  if (!(await rateLimit("handoff", 5, 60_000))) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  const parsed = handoffSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please add your name and a valid email." }, { status: 400 });
  }
  const { conversationId, name, email } = parsed.data;
  const now = new Date().toISOString();
  const convo: Conversation = (await store.get<Conversation>("conversations", conversationId)) ?? {
    id: conversationId,
    createdAt: now,
    updatedAt: now,
    mode: "ai",
    status: "open",
    unread: true,
    visitor: {},
    messages: [],
  };

  convo.mode = "human";
  convo.unread = true;
  convo.updatedAt = now;
  convo.visitor = { name, email };
  convo.messages.push({
    id: newId("m"),
    role: "assistant",
    text: `Thanks ${name.split(" ")[0]} — a member of the team will reply here shortly. We'll also follow up at ${email} if you leave.`,
    at: now,
  });
  await store.put("conversations", convo);

  await notifyTeam({
    subject: `Live chat — ${name} wants to talk`,
    fields: {
      name,
      email,
      transcript: convo.messages.map((m) => `[${m.role}] ${m.text}`).join("\n"),
    },
    replyTo: email,
  });

  return NextResponse.json({ conversation: { id: convo.id, mode: convo.mode, messages: convo.messages } });
}
