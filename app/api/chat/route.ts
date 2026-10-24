import { NextResponse } from "next/server";
import { chatSchema, type ChatMessage, type Conversation } from "@/lib/schemas";
import { store, newId } from "@/lib/server/store";
import { answer } from "@/lib/server/assistant";
import { rateLimit } from "@/lib/server/guard";

const msg = (role: ChatMessage["role"], text: string): ChatMessage => ({
  id: newId("m"),
  role,
  text,
  at: new Date().toISOString(),
});

export async function POST(req: Request) {
  if (!(await rateLimit("chat", 20, 60_000))) {
    return NextResponse.json({ error: "You're sending messages too fast." }, { status: 429 });
  }
  const parsed = chatSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  const { conversationId, message } = parsed.data;

  const now = new Date().toISOString();
  let convo = conversationId ? await store.get<Conversation>("conversations", conversationId) : null;
  if (!convo) {
    convo = { id: newId("c"), createdAt: now, updatedAt: now, mode: "ai", status: "open", unread: false, visitor: {}, messages: [] };
  }
  if (convo.messages.length > 200) {
    return NextResponse.json({ error: "This conversation is full. Please email us." }, { status: 400 });
  }

  convo.messages.push(msg("visitor", message));
  convo.status = "open";
  convo.updatedAt = now;

  if (convo.mode === "ai") {
    convo.messages.push(msg("assistant", await answer(convo.messages)));
  } else {
    convo.unread = true;
  }
  await store.put("conversations", convo);

  return NextResponse.json({ conversation: publicView(convo) });
}

function publicView(c: Conversation) {
  return { id: c.id, mode: c.mode, messages: c.messages };
}
