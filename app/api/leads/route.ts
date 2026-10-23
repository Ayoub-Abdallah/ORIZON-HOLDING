import { NextResponse } from "next/server";
import { leadSchema, type Lead } from "@/lib/schemas";
import { isValidSlot, formatSlot } from "@/lib/slots";
import { store, newId } from "@/lib/server/store";
import { notifyTeam } from "@/lib/server/mail";
import { rateLimit } from "@/lib/server/guard";

const SUBJECTS: Record<Lead["kind"], string> = {
  contact: "New message",
  brief: "New project brief",
  booking: "New call booked",
  careers: "New application",
  newsletter: "New subscriber",
};

export async function POST(req: Request) {
  if (!(await rateLimit("leads", 8, 60_000))) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  // Honeypot: real users never fill this hidden field.
  if (body?.website) return NextResponse.json({ ok: true });

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const input = parsed.data;

  if (input.kind === "booking") {
    if (!isValidSlot(input.data.slot)) {
      return NextResponse.json({ error: "That slot is no longer available." }, { status: 409 });
    }
    const leads = await store.all<Lead>("leads");
    const taken = leads.some((l) => l.kind === "booking" && l.status !== "closed" && l.data?.slot === input.data.slot);
    if (taken) return NextResponse.json({ error: "That slot was just booked. Please pick another." }, { status: 409 });
  }

  if (input.kind === "newsletter") {
    const leads = await store.all<Lead>("leads");
    if (leads.some((l) => l.kind === "newsletter" && l.email.toLowerCase() === input.email.toLowerCase())) {
      return NextResponse.json({ ok: true });
    }
  }

  const lead: Lead = {
    id: newId("lead"),
    status: "new",
    createdAt: new Date().toISOString(),
    ...input,
  } as Lead;
  await store.put("leads", lead);

  const fields: Record<string, unknown> = { ...input, kind: undefined };
  if (input.kind === "booking") fields.when = `${formatSlot(input.data.slot)} (Algiers)`;
  await notifyTeam({ subject: `${SUBJECTS[input.kind]} — ${"name" in input ? input.name : input.email}`, fields, replyTo: input.email });

  return NextResponse.json({ ok: true, id: lead.id });
}
