"use client";

import clsx from "clsx";

import usePreferredColorScheme from "./usePreferredColorScheme";

interface Props {
  className?: string;
}

export default function ColorSchemeToggle({ className }: Props) {
  const { preferredColorScheme, toggleColorScheme } = usePreferredColorScheme();

  return (
    <button
      data-testid="color-scheme-toggle"
      onClick={() => toggleColorScheme()}
      aria-label={`Current theme: ${preferredColorScheme}. Click to toggle.`}
      className={clsx(
        "raw-mono font-black uppercase text-xs md:text-sm hover:text-primary dark:hover:text-primary-invert transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-invert",
        className,
      )}
    >
      [ {preferredColorScheme} ]
    </button>
  );
}
