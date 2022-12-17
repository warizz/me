import { useEffect, useState } from "react";

import mapToColorScheme from "./mapToColorScheme";

type ColorScheme = "light" | "dark" | "system";

function _getToggleHandler(
  preferredColorScheme: string,
  setPreferredColorScheme: (colorScheme: ColorScheme) => void
) {
  return () => {
    switch (preferredColorScheme) {
      case "light": {
        localStorage.setItem("preferredColorScheme", "dark");
        return setPreferredColorScheme("dark");
      }

      case "dark": {
        localStorage.setItem("preferredColorScheme", "system");
        return setPreferredColorScheme("system");
      }

      case "system":
      default: {
        localStorage.setItem("preferredColorScheme", "light");
        return setPreferredColorScheme("light");
      }
    }
  };
}

export default function usePreferredColorScheme() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  const toggleColorScheme = _getToggleHandler(colorScheme, setColorScheme);

  useEffect(() => {
    const colorScheme = mapToColorScheme(localStorage.preferredColorScheme);
    setColorScheme(colorScheme);
  }, []);

  useEffect(() => {
    const isDarkColorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const useDarkColorScheme =
      colorScheme === "dark" ||
      (!colorScheme && isDarkColorScheme) ||
      (colorScheme === "system" && isDarkColorScheme);

    if (useDarkColorScheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [colorScheme]);

  return { preferredColorScheme: colorScheme, toggleColorScheme };
}
