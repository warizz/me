import clsx from "clsx";

import usePreferredColorScheme from "./usePreferredColorScheme";

export default function ColorSchemeToggle({
  className,
}: {
  className?: string;
}) {
  const { preferredColorScheme, toggleColorScheme } = usePreferredColorScheme();

  return (
    <button
      data-testid="color-scheme-toggle"
      onClick={() => toggleColorScheme()}
      className={clsx(
        "border px-2 py-0 prose-sm rounded-md border-black dark:border-white",
        className
      )}
    >
      <span className="font-sans">{"color: "}</span>
      <strong className="text-amber-500">
        <i>{preferredColorScheme}</i>
      </strong>
    </button>
  );
}
