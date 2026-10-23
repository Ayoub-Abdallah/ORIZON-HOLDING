import { z } from "zod";

const email = z.string().trim().email("Enter a valid email").max(200);
const name = z.string().trim().min(2, "Tell us your name").max(120);
const optional = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const leadKinds = ["contact", "brief", "booking", "careers", "newsletter"] as const;
export type LeadKind = (typeof leadKinds)[number];

export const contactSchema = z.object({
  kind: z.literal("contact"),
  name,
  email,
  company: optional(120),
  phone: optional(40),
  topic: z.enum(["AI solution", "Custom software", "Enterprise program", "Partnership", "Other"]),
  message: z.string().trim().min(10, "A few more words, please").max(5000),
});

export const briefSchema = z.object({
  kind: z.literal("brief"),
  name,
  email,
  company: optional(120),
  phone: optional(40),
  message: optional(5000),
  data: z.object({
    solution: z.string().max(80),
    capabilities: z.array(z.string().max(80)).max(10),
    stage: z.string().max(80),
    timeline: z.string().max(80),
    scale: z.string().max(80),
    estimate: z.string().max(200),
  }),
});

export const bookingSchema = z.object({
  kind: z.literal("booking"),
  name,
  email,
  company: optional(120),
  message: optional(2000),
  data: z.object({
    slot: z.string().datetime(),
    topic: z.string().max(80),
  }),
});

export const careersSchema = z.object({
  kind: z.literal("careers"),
  name,
  email,
  phone: optional(40),
  message: z.string().trim().min(20, "Tell us a bit more about you").max(5000),
  data: z.object({
    role: z.string().max(120),
    link: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  }),
});

export const newsletterSchema = z.object({
  kind: z.literal("newsletter"),
  email,
});

export const leadSchema = z.discriminatedUnion("kind", [
  contactSchema,
  briefSchema,
  bookingSchema,
  careersSchema,
  newsletterSchema,
]);

export type LeadInput = z.infer<typeof leadSchema>;

export type Lead = {
  id: string;
  kind: LeadKind;
  status: "new" | "open" | "closed";
  createdAt: string;
  name?: string;
  email: string;
  company?: string;
  phone?: string;
  topic?: string;
  message?: string;
  data?: Record<string, unknown>;
};

export type ChatMessage = {
  id: string;
  role: "visitor" | "assistant" | "agent";
  text: string;
  at: string;
};

export type Conversation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  mode: "ai" | "human";
  status: "open" | "closed";
  unread: boolean;
  visitor: { name?: string; email?: string };
  messages: ChatMessage[];
};

export const chatSchema = z.object({
  conversationId: z.string().max(64).optional(),
  message: z.string().trim().min(1).max(2000),
});

export const handoffSchema = z.object({
  conversationId: z.string().max(64),
  name,
  email,
});
