"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { openChat } from "./reveal";

export function ChatButton({ label = "Ask the AI concierge", variant = "secondary" }: { label?: string; variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <Button type="button" variant={variant} onClick={openChat}>
      <MessageCircle className="size-4" strokeWidth={1.75} /> {label}
    </Button>
  );
}
