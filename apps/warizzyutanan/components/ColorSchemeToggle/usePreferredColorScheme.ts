"use client";

import { useEffect, useState, useCallback } from "react";

import mapToColorScheme from "./mapToColorScheme";

type ColorScheme = "light" | "dark" | "system";

export default function usePreferredColorScheme() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("system");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("preferredColorScheme");
    if (saved) {
      setColorScheme(mapToColorScheme(saved));
    }
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorScheme((prev) => {
      let next: ColorScheme;
      switch (prev) {
        case "light":
          next = "dark";
          break;
        case "dark":
          next = "system";
          break;
        case "system":
        default:
          next = "light";
          break;
      }
      localStorage.setItem("preferredColorScheme", next);
      return next;
    });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      const isDarkColorScheme = mediaQuery.matches;
      const useDarkColorScheme =
        colorScheme === "dark" ||
        (colorScheme === "system" && isDarkColorScheme);

      if (useDarkColorScheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateTheme();

    // Listen for system changes
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [colorScheme]);

  return { preferredColorScheme: colorScheme, toggleColorScheme };
}
