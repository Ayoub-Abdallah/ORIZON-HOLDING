"use client";

import { useState } from "react";
import { roles } from "@/lib/content";
import { Button } from "@/components/ui";
import { Success } from "./contact-form";
import { Field, FormError, Honeypot, Input, Select, Textarea, formToObject, useLeadSubmit } from "./fields";

export function ApplicationForm() {
  const { state, error, fields, submit, reset } = useLeadSubmit();
  const [role, setRole] = useState(roles[0].title);

  if (state === "done") {
    return <Success title="Application received." text="We read every application. If there's a fit, we'll reach out within a week." onReset={reset} />;
  }

  return (
    <form
      id="apply"
      noValidate
      className="relative space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const d = formToObject(e.currentTarget);
        await submit({
          kind: "careers",
          name: d.name,
          email: d.email,
          phone: d.phone,
          message: d.message,
          website: d.website,
          data: { role, link: d.link },
        });
      }}
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={fields.name}>
          <Input name="name" autoComplete="name" invalid={!!fields.name} />
        </Field>
        <Field label="Email" error={fields.email}>
          <Input name="email" type="email" autoComplete="email" invalid={!!fields.email} />
        </Field>
        <Field label="Role">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            {roles.map((r) => (
              <option key={r.title}>{r.title}</option>
            ))}
            <option>Open application</option>
          </Select>
        </Field>
        <Field label="Portfolio, GitHub or LinkedIn" hint="Optional" error={fields.data}>
          <Input name="link" type="url" placeholder="https://" />
        </Field>
      </div>
      <Field label="Why ORIZON? What have you built?" error={fields.message}>
        <Textarea name="message" invalid={!!fields.message} />
      </Field>
      <FormError message={error} />
      <Button type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Submit application"}
      </Button>
    </form>
  );
}
