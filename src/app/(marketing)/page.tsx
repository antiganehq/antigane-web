import { Showcase } from "@/features/products/components/showcase";
import Hero from "./_components/hero";
import { Reveal } from "@/shared/components/ui/reveal";
import OurFocus from "./_components/our-focus";
import { createMetadata } from "@/shared/lib/metadata";

export const metadata = createMetadata({
  title: "Antigane — Building Game, Blockchain & AI Products",
  description:
    "Discover Peridot Vault, Peridot Wallet, Peridot Code, and MainGame — products built under Antigane for game distribution, Web3 infrastructure, and AI-powered development.",
});

export default function Home() {
  return (
    <div>
      <Reveal>
        <Hero />
      </Reveal>
      <Reveal>
        <OurFocus />
      </Reveal>
      <Reveal>
        <Showcase />
      </Reveal>
    </div>
  );
}
