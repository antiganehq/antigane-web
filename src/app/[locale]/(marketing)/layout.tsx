import { Header } from "@/shared/components/common/header";
import { Footer } from "@/shared/components/common/footer";
import { Reveal } from "@/shared/components/ui/reveal";
import { FinalCTA } from "@/shared/components/common/final-cta";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      id="main-content"
      className="mx-auto flex min-h-screen w-[calc(100%-1.5rem)] max-w-[1440px] flex-col border-x border-border sm:w-[calc(100%-2.5rem)] lg:w-[calc(100%-3rem)]"
    >
      <Header />

      {children}
      <Reveal>
        <FinalCTA />
      </Reveal>
      <Footer />
    </div>
  );
}
