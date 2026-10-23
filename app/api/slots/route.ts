import { NextResponse } from "next/server";
import type { Lead } from "@/lib/schemas";
import { store } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const leads = await store.all<Lead>("leads");
  const taken = leads
    .filter((l) => l.kind === "booking" && l.status !== "closed")
    .map((l) => String(l.data?.slot));
  return NextResponse.json({ taken });
}
