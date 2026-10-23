import { NextResponse } from "next/server";
import type { Conversation } from "@/lib/schemas";
import { store } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const convo = await store.get<Conversation>("conversations", id);
  if (!convo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ conversation: { id: convo.id, mode: convo.mode, messages: convo.messages } });
}
