"use client";

import type { ReactNode } from "react";
import { ReducedMotionProvider } from "../lib/motion";
import { ThemeProvider } from "./theme-provider";
import { SmoothScroll } from "./smooth-scroll";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider>
      <ReducedMotionProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
