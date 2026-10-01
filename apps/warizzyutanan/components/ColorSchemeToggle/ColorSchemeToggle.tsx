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
        "raw-mono text-xs font-black uppercase transition-colors hover:text-primary md:text-sm dark:hover:text-primary-invert",
        "focus:ring-2 focus:ring-primary focus:outline-hidden dark:focus:ring-primary-invert",
        className,
      )}
    >
      [ {preferredColorScheme} ]
    </button>
  );
}
