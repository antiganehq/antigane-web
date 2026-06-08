import { SectionCorners } from "@/shared/components/ui/section-corners";

export default function OurFocus() {
  return (
    <section id="focus" className="relative border-b border-border p-6 sm:p-10 lg:p-14">
      <h2 className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-3xl lg:text-[2.5rem]">
        What We Focus On
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mt-16 lg:gap-6">
        {[
          {
            title: "Game",
            body: "Building platforms that help games get discovered, distributed, and grown by players.",
          },
          {
            title: "Blockchain",
            body: "Creating wallet, licensing, and payment infrastructure for digital products.",
          },
          {
            title: "Artificial Intelligence",
            body: "Developing intelligent tools that help creators and developers build faster.",
          },
        ].map((card, i) => (
          <article
            key={card.title}
            className={`group relative flex min-h-65 flex-col justify-between rounded-2xl bg-muted p-6 sm:p-8 lg:min-h-75 ${
              i > 0
                ? "md:before:absolute md:before:-left-2 md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-border md:before:content-[''] lg:before:-left-3"
                : ""
            }`}
          >
            <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
              {card.title}{" "}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </h3>
            <p className="mt-12 max-w-[28ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              {card.body}
            </p>
          </article>
        ))}
      </div>
      <SectionCorners />
    </section>
  );
}
