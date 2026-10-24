export type Theme = "light" | "dark";

export function getThemeScript(): string {
  return `
    (function () {
      var root = document.documentElement;
      // Static theme: dark everywhere, no stored override.
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    })();
  `;
}
