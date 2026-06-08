import { DitherShader } from "@/shared/components/dither-shader";
import { SectionCorners } from "@/shared/components/ui/section-corners";
import React from "react";

export default function Hero() {
  return (
    <section className="relative border-b border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex min-h-130 flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:min-h-160 lg:border-r lg:border-border lg:px-14 lg:py-24">
          <h1
            style={{ ["--enter-delay" as string]: "380ms" }}
            className="enter text-4xl font-medium leading-[1.05] tracking-tighter text-foreground sm:text-5xl lg:text-[4rem] xl:text-[5.5rem]"
          >
            Building Game, Blockchain, and AI Products.
          </h1>
          <div
            style={{ ["--enter-delay" as string]: "520ms" }}
            className="enter mt-10 flex flex-wrap items-center gap-6"
          >
            <a
              href="#products"
              className="focus-ring inline-flex items-center gap-2 rounded-full px-2 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition-colors hover:text-muted-foreground"
            >
              Explore Products
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground"
                aria-hidden="true"
              >
                <span className="ml-px block h-0 w-0 border-y-4 border-l-[6px] border-y-transparent border-l-background" />
              </span>
            </a>
          </div>
        </div>

        <div
          style={{ ["--enter-delay" as string]: "200ms" }}
          className="enter-fade relative min-h-80 overflow-hidden lg:min-h-160"
        >
          <DitherShader />
        </div>
      </div>

      <div className="grid grid-cols-1 border-t border-border lg:grid-cols-2">
        <div className="border-b border-border px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-14">
          <p
            style={{ ["--enter-delay" as string]: "680ms" }}
            className="enter max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Antigane builds products across game distribution, blockchain
            infrastructure, AI developer tools, and creator-powered discovery.
          </p>
        </div>
        <div className="grid grid-cols-3 px-6 py-10 sm:px-10 lg:px-14">
          {[
            { label: "Products", value: "4+" },
            { label: "Focus Areas", value: "3" },
            { label: "Commercial Use", value: "Ready" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{ ["--enter-delay" as string]: `${740 + i * 80}ms` }}
              className="enter"
            >
              <p className="text-xs font-medium tracking-wide text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <SectionCorners />
    </section>
  );
}
