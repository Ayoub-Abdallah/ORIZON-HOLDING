import Link from "next/link";

export default function NotFound() {
  return (
    <main className="tone-dark relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="stars pointer-events-none absolute inset-0" aria-hidden />
      <div className="horizon-glow pointer-events-none absolute inset-x-0 bottom-0 h-1/2" aria-hidden />
      <p className="eyebrow relative">404</p>
      <h1 className="display text-gradient relative mt-6 text-5xl md:text-7xl">Beyond the horizon.</h1>
      <p className="relative mt-6 max-w-md text-muted">This page doesn&apos;t exist — yet.</p>
      <Link href="/" className="relative mt-10 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-black">
        Back home
      </Link>
    </main>
  );
}
