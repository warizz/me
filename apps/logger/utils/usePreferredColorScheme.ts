import { useEffect, useState } from "react";

import mapToColorScheme from "./mapToColorScheme";

export default function usePreferredColorScheme() {
  const [preferredColorScheme, setPreferredColorScheme] = useState<
    "light" | "dark" | "system-default"
  >("light");

  const toggleColorScheme = () => {
    switch (preferredColorScheme) {
      case "light": {
        localStorage.setItem("preferredColorScheme", "dark");
        return setPreferredColorScheme("dark");
      }

      case "dark": {
        localStorage.setItem("preferredColorScheme", "system-default");
        return setPreferredColorScheme("system-default");
      }

      case "system-default":
      default: {
        localStorage.setItem("preferredColorScheme", "light");
        return setPreferredColorScheme("light");
      }
    }
  };

  useEffect(() => {
    const colorScheme = mapToColorScheme(localStorage.preferredColorScheme);
    setPreferredColorScheme(colorScheme);
  }, []);

  useEffect(() => {
    const isDarkColorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const useDarkColorScheme =
      preferredColorScheme === "dark" ||
      (!preferredColorScheme && isDarkColorScheme) ||
      (preferredColorScheme === "system-default" && isDarkColorScheme);

    if (useDarkColorScheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [preferredColorScheme]);

  return { preferredColorScheme, toggleColorScheme };
}
