import { Header } from "@/shared/components/common/header";
import { Footer } from "@/shared/components/common/footer";

// Research chrome: same frame as marketing, but scoped forced-light —
// the public /research/* section stays paper even when <html> is .dark.
// No FinalCTA here: a "read the research" pitch on research pages is noise.
export default function ResearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="theme-light bg-background text-foreground">
      <div
        id="main-content"
        className="mx-auto flex min-h-screen w-[calc(100%-1.5rem)] max-w-[1440px] flex-col border-x border-border sm:w-[calc(100%-2.5rem)] lg:w-[calc(100%-3rem)]"
      >
        <Header />

        {children}
        <Footer />
      </div>
    </div>
  );
}
