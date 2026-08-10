export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark" | "system";

export function getThemeScript(): string {
  return `
    (function () {
      var root = document.documentElement;
      var stored = null;
      try {
        stored = localStorage.getItem("${THEME_STORAGE_KEY}");
      } catch (_) {}
      var theme = stored || "system";
      var dark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    })();
  `;
}
