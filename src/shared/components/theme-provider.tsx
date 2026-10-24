"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Theme } from "@/shared/lib/theme-script";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {},
});

// Static theme: always dark. Research stays light via the `.theme-light`
// scope in its layout. setTheme is a no-op kept for existing consumers.
export function ThemeProvider({ children }: { children: ReactNode }): ReactNode {
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: "dark",
      resolvedTheme: "dark",
      setTheme: () => {},
    }),
    [],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
