import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { aiSolutions, divisions, industries, offers, deliverySteps as steps, site } from "@/lib/content";
import type { ChatMessage } from "@/lib/schemas";

// The website concierge. Uses Claude when ANTHROPIC_API_KEY is set,
// otherwise answers from a small built-in knowledge base.

const SYSTEM = `You are the ORIZON concierge on orizon's website. ORIZON is a technology group based in ${site.address.line1}, ${site.address.city}, ${site.address.country}, that designs, builds and operates intelligent software.

Divisions:
${divisions.map((d) => `- ${d.name}: ${d.summary} Delivers: ${d.deliver.join("; ")}.`).join("\n")}

AI solutions: ${aiSolutions.map((s) => s.name).join(", ")}.
Engagement models: ${offers.map((o) => `${o.name} (${o.engagement})`).join(", ")}.
Industries: ${industries.map((i) => i.name).join(", ")}.
Delivery process: ${steps.map((s) => s.name).join(" → ")}.
Contact: ${site.email}, ${site.phone}, ${site.hours}. Visitors can book a call at /contact#book or scope a project at /enterprise#brief.

Rules:
- Reply in the visitor's language (English, French or Arabic). Keep answers under 90 words, warm and precise. Plain text, no markdown headings.
- Never quote prices, commit to deadlines, or invent clients, case studies or certifications. Pricing is value-based and fixed-outcome; offer a call for a tailored proposal.
- When the visitor shows buying intent, suggest booking a call or pressing "Talk to a human".
- Only discuss ORIZON, its services and general technology questions related to them.`;

let client: Anthropic | null | undefined;
function getClient() {
  if (client === undefined) client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
  return client;
}

export async function answer(history: ChatMessage[]): Promise<string> {
  const c = getClient();
  if (!c) return fallback(history.at(-1)?.text ?? "");

  const messages: Anthropic.Beta.BetaMessageParam[] = history
    .filter((m) => m.role !== "agent")
    .slice(-12)
    .map((m) => ({ role: m.role === "visitor" ? "user" : "assistant", content: m.text }));
  while (messages[0]?.role === "assistant") messages.shift();

  try {
    const res = await c.beta.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-opus-5-5",
      max_tokens: 1024,
      system: SYSTEM,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages,
    });
    if (res.stop_reason === "refusal") return fallback(history.at(-1)?.text ?? "");
    const text = res.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return text || fallback(history.at(-1)?.text ?? "");
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) console.warn("[assistant] rate limited");
    else if (err instanceof Anthropic.APIError) console.error(`[assistant] API error ${err.status}`, err.message);
    else console.error("[assistant] unexpected error", err);
    return fallback(history.at(-1)?.text ?? "");
  }
}

const KB: { match: RegExp; reply: string }[] = [
  {
    match: /\b(price|pricing|cost|budget|quote|tarif|prix|combien)\b/i,
    reply:
      "Our pricing is value-based and fixed-outcome — you pay for results, not hours. Most clients start with a 2–4 week AI Sprint or a 6–16 week Build Project. Share your scope at /enterprise#brief and we'll send a tailored proposal within two business days.",
  },
  {
    match: /\b(ai|llm|gpt|chatbot|agent|rag|machine learning|ml|intelligence|ia)\b/i,
    reply:
      "AI is our core: private knowledge assistants with citations, autonomous agents that work across your tools, document intelligence in Arabic/French/English, vision models and sovereign on-prem LLMs. Explore /ai — or tell me your use case and I'll point you to the right starting point.",
  },
  {
    match: /\b(app|website|web|mobile|software|platform|saas|erp|crm|logiciel|site)\b/i,
    reply:
      "We engineer custom software end-to-end: web and mobile apps, platforms, APIs, enterprise systems and modernization of legacy stacks. Every build ships with security review, observability and documentation. See /solutions or scope your project at /enterprise#brief.",
  },
  {
    match: /\b(security|secure|pentest|cyber|compliance|sécurité)\b/i,
    reply:
      "Security is engineered in from the first commit: zero-trust architecture, identity and encryption, penetration testing and incident response. For sensitive data we deploy on-prem or in national cloud so it never leaves your perimeter.",
  },
  {
    match: /\b(where|location|address|office|algiers|alger|bab ezzouar|located)\b/i,
    reply: `We're based in ${site.address.line1}, ${site.address.city}, and work with clients worldwide. Reach us at ${site.email} or ${site.phone} (${site.hours}).`,
  },
  {
    match: /\b(job|career|hiring|join|recrut|emploi|internship|stage)\b/i,
    reply: "We're hiring engineers and designers who compound. See open roles and apply at /careers.",
  },
  {
    match: /\b(call|meeting|meet|book|demo|rendez|appointment|talk)\b/i,
    reply:
      "Happy to talk. Pick a slot at /contact#book — a 30-minute call with an engineer, not a salesperson. Or press \"Talk to a human\" below and we'll reply right here.",
  },
  {
    match: /^(hi|hello|hey|salut|bonjour|salam|assalam)/i,
    reply:
      "Hello! I'm the ORIZON concierge. Ask me about AI solutions, custom software, or how we work — or press \"Talk to a human\" anytime.",
  },
];

function fallback(question: string) {
  return (
    KB.find((k) => k.match.test(question))?.reply ??
    "Good question. ORIZON builds AI systems, custom software, data platforms, cloud and security for organizations. Tell me a bit about what you're trying to achieve — or press \"Talk to a human\" and our team will reply here."
  );
}
