import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ChatWidget } from "@/components/site/chat-widget";
import { CommandMenu } from "@/components/site/command-menu";
import { RevealObserver } from "@/components/site/reveal";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ChatWidget />
      <CommandMenu />
      <RevealObserver />
    </>
  );
}
