# ORIZON — website & client platform

The public site and lightweight client platform for ORIZON: AI, software engineering and custom solutions for companies.

Built with Next.js (App Router), React 19, Tailwind CSS v4 and TypeScript. One typeface (Montserrat), two colors (obsidian and white), sections that alternate between dark and light.

## Features

- **Pages**: home, solutions (+ one page per division), AI solutions, enterprise / custom solutions, company, careers, contact.
- **AI concierge chat** on every page. Uses Claude when `ANTHROPIC_API_KEY` is set, otherwise a built-in knowledge base. Visitors can hand off to a human at any time.
- **Team inbox** at `/admin` (password-protected): live chats with reply, contact messages, project briefs, booked calls, job applications and newsletter subscribers. Status tracking and CSV export.
- **Project planner** (`/enterprise#brief`): a four-step brief that gives an instant recommended engagement, team and timeline.
- **Call booking** (`/contact#book`): Sun–Thu slots in Algiers time, double-booking protection, `.ics` calendar download.
- **Contact, careers and newsletter forms** with validation, honeypot spam protection and rate limiting.
- **⌘K command menu** for search and quick actions.
- **SEO**: metadata, sitemap, robots, generated Open Graph image and icons.
- **Fast hero**: pure CSS (no video, no images) — it paints on first frame.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in what you need
pnpm dev
```

Open http://localhost:3000. The inbox lives at http://localhost:3000/admin once `ADMIN_PASSWORD` is set.

## Configuration

See `.env.example`. Everything works without configuration; each variable switches on a production capability:

| Variable | Enables |
| --- | --- |
| `ADMIN_PASSWORD` | The `/admin` inbox |
| `ANTHROPIC_API_KEY` | Claude-powered answers in the chat |
| `SMTP_*`, `NOTIFY_EMAIL` | Email notification for every new lead and chat handoff |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Persistent storage in production (required on Vercel) |

## Editing content

All copy — divisions, AI solutions, offers, industries, values, roles, contact details — lives in `lib/content.ts`.

## Structure

```
app/(site)/        public pages
app/admin/         team inbox
app/api/           leads, chat, slots, admin endpoints
components/        UI primitives, sections, forms, chat, header/footer
lib/content.ts     all site copy
lib/server/        storage, email, auth/rate-limit, AI assistant
```
