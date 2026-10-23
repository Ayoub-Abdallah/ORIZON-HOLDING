import { Bot, CheckCircle2, FileText, Gauge, LayoutGrid, Lock, MessageSquare, Workflow } from "lucide-react";

// A product-style illustration built in HTML/CSS (no image weight).
export function Console() {
  return (
    <div className="relative mx-auto w-full max-w-5xl" aria-hidden>
      <div className="absolute -inset-x-10 -top-10 bottom-0 rounded-[3rem] bg-accent/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#08090b] shadow-[0_50px_120px_-30px_rgb(0_0_0/0.9)] md:rounded-3xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="ml-4 hidden rounded-md bg-white/[0.04] px-3 py-1 text-[11px] text-white/40 sm:block">console.orizon · Operations Intelligence</span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-emerald-300/80">
            <span className="size-1.5 rounded-full bg-emerald-400" /> All systems normal
          </span>
        </div>

        <div className="grid grid-cols-12">
          {/* Sidebar */}
          <div className="col-span-3 hidden border-r border-white/[0.07] p-3 md:block">
            {[
              [LayoutGrid, "Overview", true],
              [Bot, "Agents", false],
              [FileText, "Documents", false],
              [Workflow, "Automations", false],
              [MessageSquare, "Conversations", false],
              [Lock, "Access & audit", false],
            ].map(([Icon, label, active]) => {
              const I = Icon as typeof Bot;
              return (
                <div key={label as string} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] ${active ? "bg-white/[0.06] text-white" : "text-white/45"}`}>
                  <I className="size-3.5" strokeWidth={1.75} /> {label as string}
                </div>
              );
            })}
            <div className="mt-6 rounded-xl border border-white/[0.07] p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/35">Deployment</p>
              <p className="mt-1.5 text-[12px] text-white/80">On-prem · Algiers DC</p>
              <div className="mt-3 h-1 rounded-full bg-white/[0.06]">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-accent to-accent-soft" />
              </div>
              <p className="mt-1.5 text-[10px] text-white/35">GPU utilization 62%</p>
            </div>
          </div>

          {/* Main */}
          <div className="col-span-12 space-y-3 p-3 md:col-span-9 md:p-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Requests resolved", "18,204", "+12.4%"],
                ["Avg. handling time", "38s", "−61%"],
                ["Answer accuracy", "97.8%", "+2.1 pts"],
              ].map(([label, value, delta]) => (
                <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                  <p className="truncate text-[10px] text-white/40 md:text-[11px]">{label}</p>
                  <p className="mt-1 text-base font-light text-white md:text-2xl">{value}</p>
                  <p className="text-[10px] text-emerald-300/80">{delta}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-5">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-white/50">Agent activity · 7 days</p>
                  <Gauge className="size-3.5 text-white/30" />
                </div>
                <svg viewBox="0 0 300 90" className="mt-3 h-24 w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#5b8cff" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 70 C30 64 45 40 75 46 S120 66 150 42 S205 18 230 28 S275 12 300 8 V90 H0Z" fill="url(#area)" />
                  <path d="M0 70 C30 64 45 40 75 46 S120 66 150 42 S205 18 230 28 S275 12 300 8" fill="none" stroke="#9db8ff" strokeWidth="1.5" />
                  <path d="M0 80 C40 78 70 70 110 72 S180 60 220 62 S270 52 300 50" fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="1" strokeDasharray="3 4" />
                </svg>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 lg:col-span-2">
                <p className="text-[11px] text-white/50">Live run · Invoice agent</p>
                <ul className="mt-3 space-y-2.5 text-[11px]">
                  {[
                    ["Read 42 invoices from inbox", true],
                    ["Extracted totals & VAT (AR/FR)", true],
                    ["Matched against ERP orders", true],
                    ["Flagged 2 mismatches for review", false],
                  ].map(([t, done]) => (
                    <li key={t as string} className="flex items-start gap-2 text-white/70">
                      {done ? (
                        <CheckCircle2 className="mt-px size-3.5 shrink-0 text-emerald-400/90" />
                      ) : (
                        <span className="mt-[3px] size-2.5 shrink-0 animate-pulse rounded-full border border-accent-soft" />
                      )}
                      {t as string}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="hidden rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 sm:block">
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px]">HR</span>
                <p className="text-[12px] text-white/60">What is our remote-work policy for contractors in Oran?</p>
              </div>
              <div className="mt-3 flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-black">O</span>
                <p className="text-[12px] leading-relaxed text-white/85">
                  Contractors may work remotely up to 3 days a week with manager approval
                  <span className="mx-1 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent-soft">Policy HR-14 §3.2</span>
                  — on-site presence is required for client workshops.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
