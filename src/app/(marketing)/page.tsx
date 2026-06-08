import { Showcase } from "@/features/products/components/showcase";
import Hero from "./_components/hero";
import { Reveal } from "@/shared/components/ui/reveal";
import OurFocus from "./_components/our-focus";

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
