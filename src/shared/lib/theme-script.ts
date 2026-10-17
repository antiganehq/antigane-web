export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function getThemeScript(): string {
  return `
    (function () {
      var root = document.documentElement;
      var stored = null;
      try {
        stored = localStorage.getItem("${THEME_STORAGE_KEY}");
      } catch (_) {}
      // Static theme: dark everywhere unless explicitly stored as light.
      // The device color-scheme preference is intentionally ignored.
      var dark = stored !== "light";
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    })();
  `;
}
