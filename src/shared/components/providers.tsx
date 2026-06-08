"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { ReducedMotionProvider } from "../lib/motion";
import { SmoothScroll } from "./smooth-scroll";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReducedMotionProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
