// Single source of truth for all site copy. Derived from the ORIZON
// Identity & Business Plan (software & intelligence divisions only).

import { photo, photos } from "./images";

export const site = {
  name: "ORIZON",
  tagline: "Engineering beyond the horizon.",
  description:
    "ORIZON is a technology group that designs, builds and operates intelligent software — AI & LLM systems, custom platforms, data, cloud and security — for organizations that can't afford to get it wrong.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  email: "ayoub.orizon@gmail.com",
  phone: "+213 792 975 400",
  phoneHref: "+213792975400",
  whatsapp: "https://wa.me/213792975400",
  address: {
    line1: "Bab Ezzouar",
    city: "Algiers",
    country: "Algeria",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Bab+Ezzouar+Algiers",
  },
  hours: "Sun – Thu · 09:00 – 18:00 (GMT+1)",
  founded: "MMXXVI",
};

export const nav = [
  { label: "Solutions", href: "/solutions" },
  { label: "AI", href: "/ai" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Company", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export type Division = {
  slug: string;
  index: string;
  name: string;
  kicker: string;
  summary: string;
  deliver: string[];
  outcomes: string[];
  stack: string[];
  icon: "brain" | "code" | "layout" | "database" | "cloud" | "shield" | "workflow";
  image: string;
};

export const divisions: Division[] = [
  {
    slug: "intelligence",
    index: "01",
    name: "Intelligence",
    kicker: "Artificial intelligence & large language models",
    summary:
      "Our core. We design, fine-tune and deploy AI systems and LLMs — from copilots and agents to bespoke domain models running securely inside your walls.",
    deliver: [
      "Custom & fine-tuned LLMs and agents",
      "Retrieval, RAG & private knowledge",
      "Computer vision, NLP & predictive ML",
      "On-prem & sovereign AI deployment",
    ],
    outcomes: [
      "Knowledge work that scales without headcount",
      "Models that speak your domain, privately",
      "Compounding intelligence as your moat",
    ],
    stack: ["LLMs", "RAG", "Agents", "Vision", "MLOps"],
    icon: "brain",
    image: photo(photos.intelligence, 1400),
  },
  {
    slug: "software-engineering",
    index: "02",
    name: "Software Engineering",
    kicker: "Custom software, built to last",
    summary:
      "The discipline everything rests on. Robust, scalable, beautiful software — bespoke systems engineered for performance and the long term.",
    deliver: [
      "Custom software & platform engineering",
      "Architecture & technical strategy",
      "API, backend & systems design",
      "Modernization & technical rescue",
    ],
    outcomes: [
      "Software that scales instead of breaking",
      "Clean foundations that lower future cost",
      "Engineering you can build a company on",
    ],
    stack: ["TypeScript", "Python", "Go", "APIs", "Microservices"],
    icon: "code",
    image: photo(photos.software, 1400),
  },
  {
    slug: "digital-products",
    index: "03",
    name: "Digital Products",
    kicker: "Apps, websites & experiences",
    summary:
      "Where technology meets people. Web and mobile products that make powerful systems feel effortless — design and engineering fused.",
    deliver: [
      "Web & mobile application development",
      "Product, UX & interface design",
      "High-performance websites & platforms",
      "Brand, motion & immersive experiences",
    ],
    outcomes: [
      "Products users love, not just tolerate",
      "Faster adoption, lower support cost",
      "A digital surface worthy of the brand",
    ],
    stack: ["React", "Next.js", "iOS", "Android", "Design systems"],
    icon: "layout",
    image: photo(photos.products, 1400),
  },
  {
    slug: "data-platforms",
    index: "04",
    name: "Data & Platforms",
    kicker: "Turning information into advantage",
    summary:
      "The pipelines, warehouses and governance that turn scattered information into one trustworthy source of truth.",
    deliver: [
      "Data engineering & real-time pipelines",
      "Lakehouse & warehouse architecture",
      "Governance, lineage & quality",
      "Analytics, BI & decision dashboards",
    ],
    outcomes: [
      "One trusted version of the truth",
      "Decisions on evidence, not instinct",
      "A data estate ready for AI",
    ],
    stack: ["Streaming", "Lakehouse", "dbt", "BI", "Governance"],
    icon: "database",
    image: photo(photos.data, 1400),
  },
  {
    slug: "cloud-infrastructure",
    index: "05",
    name: "Cloud & Infrastructure",
    kicker: "The foundation that scales",
    summary:
      "Cloud and platform infrastructure that is scalable, resilient and cost-efficient — the base everything else runs on.",
    deliver: [
      "Cloud architecture & migration",
      "Containers, Kubernetes & platforms",
      "Site reliability & observability",
      "Cost, performance & FinOps",
    ],
    outcomes: [
      "Elastic scale without chaos",
      "Lower run-cost, higher reliability",
      "Infrastructure ready for global scale",
    ],
    stack: ["AWS", "GCP", "Azure", "Kubernetes", "Terraform"],
    icon: "cloud",
    image: photo(photos.cloud, 1400),
  },
  {
    slug: "cybersecurity",
    index: "06",
    name: "Cybersecurity & Trust",
    kicker: "Security, engineered in",
    summary:
      "Trust is the business. We protect data, systems and people at every layer so speed never costs safety.",
    deliver: [
      "Security architecture & zero-trust",
      "Threat detection & incident response",
      "Penetration testing & red teaming",
      "Identity, encryption & compliance",
    ],
    outcomes: [
      "Resilience against modern threats",
      "Confidence to move fast, safely",
      "An audit-ready, defensible posture",
    ],
    stack: ["Zero-trust", "IAM", "SIEM", "Pentest", "Compliance"],
    icon: "shield",
    image: photo(photos.security, 1400),
  },
  {
    slug: "enterprise-systems",
    index: "07",
    name: "Enterprise Systems",
    kicker: "The operational backbone",
    summary:
      "The systems large organizations run on — workflow, operations and line-of-business platforms, made intelligent.",
    deliver: [
      "Custom enterprise & LOB software",
      "Workflow & process automation",
      "Systems integration & modernization",
      "Intelligent operations tooling",
    ],
    outcomes: [
      "Operations that scale with the business",
      "Automation that removes drag",
      "Modern systems without rip-and-replace risk",
    ],
    stack: ["ERP", "CRM", "Automation", "Integration", "Workflows"],
    icon: "workflow",
    image: photo(photos.enterprise, 1400),
  },
];

export const offers = [
  {
    name: "AI Sprint",
    what: "A focused LLM or automation pilot that proves value on your real data.",
    engagement: "Fixed scope · 2–4 weeks",
    highlight: "Fastest way to start",
  },
  {
    name: "Build Project",
    what: "A custom app, platform or data system — designed, engineered and shipped.",
    engagement: "Fixed outcome · 6–16 weeks",
  },
  {
    name: "Intelligence Platform",
    what: "A bespoke AI or data product, deployed in your environment and licensed to you.",
    engagement: "Project + license",
  },
  {
    name: "Managed Intelligence",
    what: "Our SaaS products and managed AI, operated and improved continuously.",
    engagement: "Monthly subscription",
  },
  {
    name: "Retainer & Support",
    what: "Ongoing engineering capacity with clear SLAs and a dedicated team.",
    engagement: "Monthly · SLA-backed",
  },
  {
    name: "Enterprise Program",
    what: "Multi-team, multi-year transformation with one accountable partner.",
    engagement: "Annual contract",
  },
];

export const aiSolutions = [
  {
    name: "Private Knowledge Assistant",
    summary:
      "A ChatGPT-grade assistant that answers from your documents, policies and systems — with citations, permissions and audit trails.",
    tags: ["RAG", "Citations", "SSO"],
  },
  {
    name: "Autonomous Agents",
    summary:
      "Agents that read, decide and act across your tools: triage tickets, reconcile invoices, update the CRM, escalate the edge cases.",
    tags: ["Tool use", "Workflows", "Human-in-the-loop"],
  },
  {
    name: "Document Intelligence",
    summary:
      "Extract, classify and validate data from contracts, invoices, IDs and forms — in Arabic, French and English.",
    tags: ["OCR", "Extraction", "Multilingual"],
  },
  {
    name: "Customer AI",
    summary:
      "24/7 conversational support on web, WhatsApp and voice that resolves requests and hands off cleanly to your team.",
    tags: ["Chat", "Voice", "Omnichannel"],
  },
  {
    name: "Vision & Inspection",
    summary:
      "Computer-vision models for quality control, counting, safety monitoring and visual search, deployed at the edge or in the cloud.",
    tags: ["Detection", "Edge", "Real-time"],
  },
  {
    name: "Forecasting & Decisions",
    summary:
      "Predictive models for demand, risk, churn and pricing — wired into dashboards and the systems that act on them.",
    tags: ["ML", "Time-series", "BI"],
  },
  {
    name: "Sovereign LLM",
    summary:
      "Fine-tuned open models running fully on-prem or in national cloud. Your data never leaves your perimeter.",
    tags: ["On-prem", "Fine-tuning", "Compliance"],
  },
  {
    name: "AI Copilots for Teams",
    summary:
      "Domain copilots embedded in the software your people already use — drafting, reviewing and summarizing in context.",
    tags: ["Productivity", "Integrations", "Analytics"],
  },
];

export const industries = [
  { name: "Finance & Banking", focus: "Risk intelligence, secure platforms, automation." },
  { name: "Healthcare", focus: "Data platforms, predictive models, secure systems." },
  { name: "Energy & Utilities", focus: "Forecasting, optimization, operations." },
  { name: "Telecom & Networks", focus: "Platforms, automation, data activation." },
  { name: "Retail & Commerce", focus: "Demand intelligence, experience platforms." },
  { name: "Logistics & Mobility", focus: "Optimization, routing, real-time visibility." },
  { name: "Public Institutions", focus: "Secure platforms, AI-assisted operations." },
  { name: "Manufacturing", focus: "Automation, quality intelligence, digital twins." },
];

export const values = [
  { name: "Innovation", line: "Pushing boundaries and creating what's next.", depth: "We treat the status quo as a starting line and invest in the hard problems others avoid — that is where durable advantage is created." },
  { name: "Excellence", line: "An uncompromising commitment to quality.", depth: "Good enough is a liability in the systems we build. We obsess over craft, performance and detail because our clients cannot afford less." },
  { name: "Integrity", line: "Doing the right thing — with transparency and trust.", depth: "Trust is the entire business. We are transparent, honest about trade-offs, and rigorous about security." },
  { name: "Collaboration", line: "Stronger together. We win as one team.", depth: "Shared standards, open knowledge, and a culture where the best idea wins." },
  { name: "Impact", line: "Technology with purpose. Solutions that matter.", depth: "We choose work by the size of the dent it makes. If it won't move an organization, an industry, or lives — it is not our project." },
];

export const deliverySteps = [
  { step: "01", name: "Discover", text: "We map the problem, the data and the constraints with your team, then define a measurable outcome." },
  { step: "02", name: "Design", text: "Architecture, UX and a delivery plan you can hold us to — fixed scope, fixed outcome." },
  { step: "03", name: "Build", text: "Short cycles, weekly demos, AI-augmented delivery. You see working software from week one." },
  { step: "04", name: "Launch", text: "Security review, load testing and a calm, observable rollout to production." },
  { step: "05", name: "Operate", text: "We monitor, support and keep improving — or hand over cleanly with full documentation." },
];

export const principles = [
  { name: "Ship, then sharpen", text: "Working systems first, then relentless refinement." },
  { name: "Trust is the product", text: "Security, reliability and honesty are non-negotiable." },
  { name: "Leverage everything", text: "Automate, templatize, reuse. One should produce like many." },
  { name: "Secure by design", text: "Built in from the first commit, never bolted on." },
  { name: "Cloud-native by default", text: "Elastic, observable, automated." },
  { name: "Documentation as infrastructure", text: "Knowledge that outlives anyone." },
];

export const edges = [
  { name: "Founder-grade talent", text: "An AI engineer with a data-science master's at the helm — elite capability from day one." },
  { name: "Full-stack breadth", text: "Intelligence, software, data, cloud and security under one roof. We solve whole problems." },
  { name: "Trust as a moat", text: "Security and reliability engineered in, opening doors price-led competitors can't." },
  { name: "Speed & leverage", text: "AI-augmented delivery lets a focused team out-ship far larger firms." },
  { name: "Fixed outcomes", text: "Priced on results, not billable hours. Faster and more technical than consultancies." },
  { name: "Sovereign-friendly", text: "Bespoke systems that run where your data must stay — delivered as a partnership, not a portal." },
];

export const roles = [
  { title: "Senior AI / LLM Engineer", team: "Intelligence", type: "Full-time · Algiers / Remote" },
  { title: "Full-stack Engineer (TypeScript)", team: "Software Engineering", type: "Full-time · Algiers / Remote" },
  { title: "Product Designer", team: "Digital Products", type: "Full-time · Algiers / Remote" },
  { title: "Data Engineer", team: "Data & Platforms", type: "Full-time · Remote" },
  { title: "DevOps / Platform Engineer", team: "Cloud & Infrastructure", type: "Full-time · Remote" },
  { title: "Security Engineer", team: "Cybersecurity & Trust", type: "Contract · Remote" },
];

export const founder = {
  name: "Ayoub Abdallah Ben Chahla",
  role: "Founder & Chief Executive",
  credentials: "M.Sc. Data Science & Artificial Intelligence · AI Engineer",
  quote:
    "I started with a conviction and a laptop — that intelligence, well-engineered, can move the world.",
  letter: [
    "Orizon was not born from a building, a board, or a budget. It was born from a single idea: that the distance between what technology can do and what the world actually has is enormous — and that distance is the greatest opportunity of our era.",
    "We begin where we are strongest: artificial intelligence, large language models, and software. We earn trust one delivered system at a time, reinvest every advantage, and compound relentlessly.",
  ],
};
